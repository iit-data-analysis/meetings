module.exports = {

    development: {
        client: 'pg',
        connection: process.env.PG_CONNECTION_STRING,
        seeds: {
            directory: './db/seeds'
        },
        migrations: {
            directory: './db/migrations'
        }
    }

};
