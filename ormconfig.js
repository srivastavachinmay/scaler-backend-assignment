require("dotenv").config()


const isTS = process.env.TS === "1";
const URL = require("url").URL;
const uri = new URL(process.env.DB_URI);

module.exports = {
    type: uri.protocol.slice(0, -1),
    host: uri.hostname,
    port: uri.port || 3306,
    username: uri.username,
    password: uri.password || undefined,
    database: uri.pathname.slice(1),
    synchronize: false,
    logging: false,
    entities: [isTS ? "src/entity/*.ts" : ".build/src/entity/*.js"],
    migrations: [isTS ? "src/migrations/*.ts" : ".build/src/migrations/*.js"],
    cli: {
        migrationsDir: "src/migrations",
    }
};
