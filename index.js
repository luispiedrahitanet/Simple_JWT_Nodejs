/**
 * Autor: Luis Arcadio Piedrahita
 * Email: luispiedrahita.net@gmail.com
 */

const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const secret = process.env.SECRET_KEY
const app = express()


// Obtener el Usuario que nos envían con el método post
app.post('/token', (req, res) =>{
    // Aquí se debe obtener el usuario de la base de datos y comprobar si existe
    
    // Este es un usuario directo como ejemplo
    const { id:sub, name } = { id: "l123", name: "Luis" }

    // CONSTRUYO EL TOKEN CON JWT
    // sign(param_paylod, key_secret)
    const token = jwt.sign({
        sub,
        name,
        exp: Date.now() + 60 * 1000 // expira en un minuto
    },
    secret)

    // Enviamos el token ya construido
    res.send({token})

})



// Acceder de manera pública
app.get('/public', (req, res) => {
    res.send("🌍 Estoy en el área publica que no necesita autorización")
})



// Obtenemos el token que nos envían en la cabezera verificamos su firma
app.get('/private', (req, res) => {
    try {
        // obtenemos el token de la cabecera en la variable 'autorizacion'
        //const token = req.headers.autorizacion
        
        // Obtenemos el token desde el 'Auth' 'Bearer' que envía el cliente
        // Hay que hacerle un split porque llega con el formato:
        //      'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...'
        const token = req.headers.authorization.split(" ")[1]

        // Verificamos el token con la firma
        // verify(token_user, secret_key)
        const payload = jwt.verify( token, secret )

        // Comprobamos si ya expiró el token
        if ( Date.now() > payload.exp ) return res.status(401).send({ error: 'Token ha expirado'})

        res.send("😁 Estoy en el área privada porque el token fue verificado correctamente.")

    } catch (error) {
        res.send({ error: error.message })
    }
})


app.listen( process.env.PORT || 3000 , ()=>{
    console.log(`Escuchando por el puerto 3000`)
})



