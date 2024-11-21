import path from "path";

const config = {
    getDataBaseConfig: () => ({
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "3306")
    })
}
export default config;