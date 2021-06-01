export function getUrl(path: string) {
  const origin = process.env.JEQZ_BASE_URL;
  if (origin) {
    const baseUrl = new URL(path.replace(/^\//, ""), `${origin}/api/v1/`);
    return baseUrl.href;
  }
  return path;
}
