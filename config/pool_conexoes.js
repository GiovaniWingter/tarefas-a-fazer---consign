module.exports =  (application) => {

    const pool = application.config.middlewares.mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        // password: process.env.DB_PASSWORDITB,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    pool.getConnection((err, conn) => {
        if (err)
            console.log(err)
        else
            console.log("Conectado ao SGBD!")
    })

    return pool.promise()

}