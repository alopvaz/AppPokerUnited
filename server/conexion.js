import { createConnection } from 'mysql';

var con = createConnection({
    host: "db",
    user: "user",
    password: "password",
    database: "mydatabase"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Conectado a la base de datos 'mydatabase'!");
});

export default con;