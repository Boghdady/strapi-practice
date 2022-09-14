module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "127.0.0.1"),
      port: env.int("DATABASE_PORT", 5435),
      database: env("DATABASE_NAME", "stardustdb"),
      user: env("DATABASE_USERNAME", "stardust_user"),
      password: env("DATABASE_PASSWORD", "dbPassword"),
      ssl: env.bool("DATABASE_SSL", false),
    },
  },
});

// psql -U stardust_user
// create database stardustDB;
