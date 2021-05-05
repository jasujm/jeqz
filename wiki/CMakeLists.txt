cmake_minimum_required(VERSION 3.16)
project(JEQZ)

find_package(EXPAT)

set(PROGRAM jeqz-process-wiki)

add_executable(${PROGRAM} jeqz-process-wiki.cc)
target_link_libraries(${PROGRAM} EXPAT::EXPAT)
set_property(TARGET ${PROGRAM} PROPERTY CXX_STANDARD 17)

install(TARGETS ${PROGRAM})
