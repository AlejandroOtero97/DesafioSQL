export const productsMariadb = {
    client: 'mysql2',
    connection: {
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "",
        database: "coderhouse"
    }
}

export const messagesSql = {
    client: "sqlite3",
    connection: {
        filename: "./DB/ecommerce.sqlite"
    },
    useNullAsDefault: true
}