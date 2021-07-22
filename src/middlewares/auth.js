const jwt = require('jsonwebtoken');
const {promisify} = require('util');

module.exports = async(req,res,next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader){
    return res.status(401).json({error:'Falha no token'});
  }

  const [, token] = authHeader.split(' ');

  try{
    const decoded = await promisify(jwt.verify)(token,'3228e8a9e5c3726304a62fa5353e5f06')

    req.userId = decoded.id;

    return next();
    
  }catch(error){
    return res.status(400).json({error:'Token não existe!'});
  }
}