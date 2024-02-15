const jwt = require('jsonwebtoken');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      //return next(403);
      return next({ status: 403, message: 'El Token es Invalido' });
    }
    req.userId = decodedToken.uid;
    req.userRole = decodedToken.role;
    req.email = decodedToken.email;
    
    return next();
    // TODO: Verify user identity using `decodeToken.uid`
  });
};

module.exports.isAuthenticated = (req) => {

  const userId = req.userId ? req.userId.toString() : null;
  if(userId){
    console.log("isAuthenticated",userId);
    return true;
  }else{
    console.log(" no autenticado");
    return false;
  }
  // TODO: Decide based on the request information whether the user is authenticated
};

module.exports.isAdmin = (req) => {

  const userRol = req.userRole ? req.userRole.toString(): null;

  if(userRol != 'admin' ){
    console.log("No es admin");
    return false;
  }else{
    console.log("isAdmin");
    // TODO: Decide based on the request information whether the user is an admin
    return true;
  }
  // TODO: Decide based on the request information whether the user is an admin
};

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
