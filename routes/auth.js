const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
const { connect } = require('../connect');
const { ObjectId } = require('mongodb');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { secret } = config;

module.exports = (app, nextMain) => {

  app.post('/login', async (req, resp, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(400);
      }

      const db = await connect();
      const user = db.collection('user');

      const userExists = await user.findOne({ email });
      if (!userExists) {
        return resp.status(401).json({ error: 'No existe el usuario' });
      }else{

        const isEqual = await bcrypt.compare(password, userExists.password);
        if (isEqual) {

          const infoUser = {
            uid : userExists._id,
            email: userExists.email,
            role: userExists.role,
          }
          
          const accessToken = jwt.sign(infoUser, secret, { expiresIn: '1h' });
          console.log("accessToken:", accessToken,"user",infoUser);
          //resp.json({ token: accessToken });
          resp.json({"token":accessToken,"user":infoUser});
        }  else {
          console.log("pass invalido");
          resp.status(401).json({ error: 'Credenciales Invalidas' });
        }
      }   
      //next();
    } catch (error) {
      console.error('Error durante authentication:', error);
      resp.status(500).json({ error: 'Error Iterno de Servidor' });
    }

    // TODO: Authenticate the user
    // It is necessary to confirm if the email and password
    // match a user in the database
    // If they match, send an access token created with JWT
  });
    /*try {
      if (!email || !password){
        console.log('campos vacios, ingresar datos');
        
        return resp.status(400).json({ error: 'campos vacios, ingresar datos' });
      }

      const db = connect();
      const user = db.collection('user');

      const loginUser = await user.findOne({ email: email});

      if (loginUser) {

        const authPassword = await bcrypt.compare(password, loginUser.password);
        
        if(authPassword){
            const infoUser = {
              id: loginUser._id,
              email: loginUser.email,
              role: loginUser.role,
            }
            const token = jwt.sign(infoUser, secret, {expiresIn: '1h'}); // jsonwebtoken
            resp.json({"accessToken":token,"user":infoUser}); // leer la documentación de express
    
           // console.log({"accessToken":token,"user":infoUser});
          
        }else{
          console.log('Contraseña incorrecta');
          return resp.status(404).json({ error: 'Contraseña incorrecta' })
        }
        //resp.json({ token: tokenIs });
      } else {
        console.log('No existe el correo');
        return resp.status(404).json({ error: 'No existe el correo' });
      }

    } catch (error) {
      console.error(error); // Imprimir el mensaje de error en la consola
      return next(500); // Enviar una respuesta de error al cliente
    }
  });
  */

  return nextMain();
};
