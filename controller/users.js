const { connect } = require('../connect');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

function buildLinkHeader(req, responseData) {
  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
  const nextPageUrl = `${baseUrl}?page=${responseData.currentPage + 1}&_limit=${responseData.limit}`;
  const lastPageUrl = `${baseUrl}?page=${responseData.totalPages}&_limit=${responseData.limit}`;
  return `<${lastPageUrl}>; rel="last", <${nextPageUrl}>; rel="next"`;
}

module.exports = {

  getUsers:async (req, resp, next) => {
    const  db = connect();
    const user = db.collection('user');
    const listUsers = await user.find({}).limit(10).toArray();
    const totalProducts = await user.countDocuments(); // cuenta el total de coleciones
    
    resp.json({users:listUsers, total:totalProducts}); // muestra el total en objeto
    console.log(listUsers);
  },

  registerUser:async (req, resp, next) => {

    try{

      const { email, password, role } = req.body;

      if(!email || !password || !role) {
        return resp.status(400).json({ error: 'campos vacios' });
       }
      
      if(password.length < 5){
        return resp.status(400).json({ error: 'La contraseña debe contener minimo 5 caracteres' });
      }
  
      const regexEmail = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm;
      if (!regexEmail.test(email)) {
        return resp.status(400).json({ error: 'Correo invalido' });
      }
  
      const newUser = {
        email,
        password: bcrypt.hashSync(password, 10),
        role
      };
      const db = connect();
      const user = db.collection('user');
      const resultUser = await user.findOne({email});
    
      if(resultUser){
        console.log("Ya existe el usuario");
        return resp.status(403).json({ error: 'Ya existe el usuario' });
        
      }else{
        const saveUser = await user.insertOne(newUser);
        if(saveUser){
          console.log('Se agrego el usuario con exito');
          delete newUser.password;
          return resp.status(200).json(newUser);
        }
      }
    
    }catch(err){
      console.error("error de registro de admin");
      return resp.status(402).json({ error: 'error de registro' });
     
    }
  },
};
