#include <expat.h>

#include <algorithm>
#include <charconv>
#include <iostream>
#include <regex>
#include <stack>
#include <string_view>

#include <cassert>
#include <cerrno>
#include <cstring>

namespace {

using namespace std::string_view_literals;

using String = std::basic_string<XML_Char>;
using StringView = std::basic_string_view<XML_Char>;
using Regex = std::basic_regex<XML_Char>;
using MatchResult = std::match_results<typename String::const_iterator>;

constexpr size_t BUFSIZE = 4096;
constexpr auto PAGE_TAG = "page"sv;
constexpr auto REVISION_TAG = "revision"sv;
constexpr auto ID_TAG = "id"sv;
constexpr auto TITLE_TAG = "title"sv;
constexpr auto TEXT_TAG = "text"sv;
constexpr auto BYTES_ATTR = "bytes"sv;
constexpr auto TIMESTAMP_TAG = "timestamp"sv;

const auto TITLE_REGEX = Regex {R"((.*) equation)"};
const auto EQUATION_REGEX = Regex {R"(\n:*\s*<math.*?>(.+?)\\?[,.]?\s*</math>\n)"};

bool contains(const StringView s, const StringView needle)
{
    return s.find(needle) != StringView::npos;
}

std::string quote(const StringView s)
{
    auto ret = std::string {"\""};
    auto i = StringView::size_type {}, j = s.find('"');
    while(j != StringView::npos) {
        ret.append(s.substr(i, j-i+1));
        i = j;
        j = s.find('"', i+1);
    }
    ret.append(s.substr(i));
    ret.append(1, '"');
    return ret;
}

enum class ParseState {
    UNKNOWN,
    PARSING_PAGE,
    PARSING_REVISION,
    PARSING_PAGE_ID,
    PARSING_PAGE_TITLE,
    PARSING_PAGE_TEXT,
    PARSING_PAGE_TIMESTAMP,
};

struct ParseContext {

    void start(const StringView name, const XML_Char** attrs)
    {
        if (!tagsToSkip.empty()) {
            tagsToSkip.emplace(name);
            return;
        }

        if (name == PAGE_TAG) {
            state = ParseState::PARSING_PAGE;
            currentPageId = std::string {};
            currentPageTitle = std::string {};
            currentPageText = std::string {};
            currentPageTimestamp = std::string {};
        } else if (name == REVISION_TAG && state == ParseState::PARSING_PAGE) {
            state = ParseState::PARSING_REVISION;
        } else if (name == ID_TAG && state == ParseState::PARSING_REVISION) {
            state = ParseState::PARSING_PAGE_ID;
        } else if (name == TIMESTAMP_TAG && state == ParseState::PARSING_REVISION) {
            state = ParseState::PARSING_PAGE_TIMESTAMP;
        } else if (name == TITLE_TAG && state == ParseState::PARSING_PAGE) {
            state = ParseState::PARSING_PAGE_TITLE;
        } else if (name == TEXT_TAG && state == ParseState::PARSING_REVISION) {
            state = ParseState::PARSING_PAGE_TEXT;
            for (auto i = 0; attrs[i]; i += 2) {
                if (attrs[i] == BYTES_ATTR) {
                    auto bytes = 0u;
                    const auto first = attrs[i + 1];
                    const auto last = first + std::strlen(first);
                    const auto [ptr, ec] = std::from_chars(first, last, bytes);
                    if (ptr == last && ec == std::errc {}) {
                        currentPageText.reserve(bytes);
                        break;
                    }
                }
            }
        } else if (state == ParseState::PARSING_REVISION) {
            // If we're descended to the revision tag, we don't want to traverse
            // further. Skip tags unless they are something we're interested to
            // parse.
            if (!tagsToSkip.empty()) {
                std::cerr << "invariant error\n";
                std::exit(1);
            }
            tagsToSkip.emplace(name);
        }
    }

    void end(const StringView name)
    {
        if (!tagsToSkip.empty()) {
            if (tagsToSkip.top() != name) {
                std::cerr << "invariant error\n";
                std::exit(1);
            }
            tagsToSkip.pop();
        }

        if (name == PAGE_TAG && state == ParseState::PARSING_PAGE) {
            auto match = MatchResult {};
            if (std::regex_search(currentPageTitle, match, TITLE_REGEX)) {
                const auto name = match.str(1);
                // Heuristic for including equation if:
                // - Equation contains hyphenated list (example: Klein–Gordon equation), OR
                // - The equation contains apostrophe (example: Laplace's equation), OR
                // - The article contains link to an article ending with the person
                //   (example: Schrödinger equation article contains link [[Erwin Schrödinger]])
                const auto name_is_equation = contains(name, "–") || contains(name, "'") || contains(currentPageText, name + "]]");
                if (name_is_equation && std::regex_search(currentPageText, match, EQUATION_REGEX)) {
                    std::cout << quote(currentPageId) << "," << quote(currentPageTitle)
                              << "," << quote(match.str(1)) << "," << quote(currentPageTimestamp) << "\n";
                }
            }
        } else if (name == REVISION_TAG && state == ParseState::PARSING_REVISION) {
            state = ParseState::PARSING_PAGE;
        } else if (name == ID_TAG && state == ParseState::PARSING_PAGE_ID) {
            state = ParseState::PARSING_REVISION;
        } else if (name == TITLE_TAG && state == ParseState::PARSING_PAGE_TITLE) {
            state = ParseState::PARSING_PAGE;
        } else if (name == TEXT_TAG && state == ParseState::PARSING_PAGE_TEXT) {
            state = ParseState::PARSING_REVISION;
        } else if (name == TIMESTAMP_TAG && state == ParseState::PARSING_PAGE_TIMESTAMP) {
            state = ParseState::PARSING_REVISION;
        }
    }

    void characters(const StringView s)
    {
        if (!tagsToSkip.empty()) {
            return;
        }

        if (state == ParseState::PARSING_PAGE_ID) {
            currentPageId.append(s);
        } else if (state == ParseState::PARSING_PAGE_TITLE) {
            currentPageTitle.append(s);
        } else if (state == ParseState::PARSING_PAGE_TEXT) {
            currentPageText.append(s);
        } else if (state == ParseState::PARSING_PAGE_TIMESTAMP) {
            currentPageTimestamp.append(s);
        }
    }

private:

    ParseState state {ParseState::UNKNOWN};
    String currentPageId;
    String currentPageTimestamp;
    String currentPageTitle;
    String currentPageText;
    std::stack<String> tagsToSkip;
};

struct XmlParserWrapper {
    XmlParserWrapper() : parser {XML_ParserCreate("UTF-8")} {}
    ~XmlParserWrapper() { XML_ParserFree(parser); }
    operator const XML_Parser&() const { return parser; }
    XML_Parser parser;
};

}

extern "C" {

static void start(void* data, const XML_Char* name, const XML_Char** attrs)
{
    const auto ctx = reinterpret_cast<ParseContext*>(data);
    assert(ctx);
    ctx->start(name, attrs);
}

static void end(void* data, const XML_Char* name)
{
    const auto ctx = reinterpret_cast<ParseContext*>(data);
    assert(ctx);
    ctx->end(name);
}

static void characters(void* data, const XML_Char* s, int len)
{
    const auto ctx = reinterpret_cast<ParseContext*>(data);
    assert(ctx);
    ctx->characters({s, static_cast<String::size_type>(len)});
}


}

int main()
{
    const auto parser = XmlParserWrapper {};
    auto ctx = ParseContext {};
    XML_SetElementHandler(parser, start, end);
    XML_SetCharacterDataHandler(parser, characters);
    XML_SetUserData(parser, &ctx);

    std::cout << "id,name,markup,timestamp\n";

    while (!std::cin.eof()) {
        const auto buffer = XML_GetBuffer(parser, BUFSIZE);
        if (buffer == NULL) {
            std::cerr << "Failed to get buffer\n";
            return EXIT_FAILURE;
        }
        std::cin.read(static_cast<XML_Char*>(buffer), BUFSIZE);
        if (std::cin.bad()) {
            const auto err = errno;
            std::cerr << "Failed to read: " << strerror(err) << "\n";
            return EXIT_FAILURE;
        }
        const auto bytes_read = std::cin.gcount();
        if (!XML_ParseBuffer(parser, bytes_read, bytes_read == 0)) {
            const auto err = XML_GetErrorCode(parser);
            std::cerr << "Failed to parse at "
                      << XML_GetCurrentLineNumber(parser) << ":" << XML_GetCurrentColumnNumber(parser)
                      << ": " << XML_ErrorString(err) << "\n";
            return EXIT_FAILURE;
        }
    }

    return EXIT_SUCCESS;
}
