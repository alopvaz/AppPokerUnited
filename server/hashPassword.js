//Importar biblioteca bcrypt para generar un hash de la contrasena proporcionada
import bcrypt from 'bcrypt';
//Contrasena proporcionada
var password = "javi";

//Llamada a la funcion hash() que genera un hash de la contrasena proporcionada
    //Argumentos: 
        //Contrasena proporcionada
        //Numero de rondas de salting que bcrypt usa para generar el hash
bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
        console.error(err);
    } else {
        console.log(hash);
    }
});