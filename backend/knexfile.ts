// Update with your config settings.

function pgConfig() {
  return {
    connection: process.env.JEQZ_DATABASE_URL,
  }
}

function sqlite3Config() {
  const filename = process.env.JEQZ_SQLITE3_FILENAME || ":memory:";
  return {
    useNullAsDefault: true,
    connection: {
      filename,
    },
  }
}

export default (function() {
  const client = process.env.JEQZ_DATABASE_CLIENT || "sqlite3";
  if (client) {
    return {
      client: client,
      ...(client === "pg" ? pgConfig() : sqlite3Config()),
    }
  }
  process.exit(1);
})();
