const jwt = require('jsonwebtoken');
const config = require('../config');
const { connect } = require('../connect');
const { secret } = config;

module.exports = (app, nextMain) => {

  app.post('/login', async (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    try {
      // Get the database and collection on which to run the operation
      const  db = connect();
      const user = db.collection('user');
      // elementos a comparar
      const query = { email: email, password: password  };

      // Execute query
      const resultUser = await user.findOne(query);
      if(resultUser){
        const infoUser = {
          id:resultUser._id,
          email: resultUser.email,
          role: resultUser.role
        }
 
        const token = jwt.sign(infoUser, secret); // jsonwebtoken
        resp.json({"accessToken":token,"user":infoUser}); // leer la documentación de express
      
        console.log(resultUser);
      }else{
        next(404);
        console.log("No existe el usuario");
      }

      // Print the document returned by findOne()
    } catch(err){
      console.error(err);
      next(404);
    }
  });

  return nextMain();
};
