// Update with your config settings.

function sqlite3Config(filename: string) {
  return {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename,
    },
  }
}

export default {
  development: sqlite3Config('./tmp/db.sqlite3'),
  test: sqlite3Config(':memory:'),
  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
  }

};
