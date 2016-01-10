module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      database: 'meetings',
      user:     'postgres'
    },
    seeds: {
      directory: './db/seeds'
    },
    migrations: {
      directory: './db/migrations'
    }
  }

};
