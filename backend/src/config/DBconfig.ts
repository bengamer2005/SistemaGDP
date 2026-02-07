import { Sequelize } from "sequelize"

const env = {
    DB_NAME: process.env.DB_NAME ?? "",
    DB_USER: process.env.DB_USER ?? "",
    DB_PASS: process.env.DB_PASS ?? "",
    DB_HOST: process.env.DB_HOST ?? ""
}

const DB = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
    host: env.DB_HOST,
    dialect: "mssql",
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: false,
            port: 1433
        }
    }
})

export default DB