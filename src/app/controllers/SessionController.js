const jwt = require('jsonwebtoken');
const Yup = require('yup');

const User = require('../models/User');

//const authConfig = require('../../config/auth');

class SessionController{
  async store(req,res){

    const schema = Yup.object().shape({
      email:Yup.string().required().email(),
      password:Yup.string().required().min(6),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({error:'Não autorizado, dados inválidos'});
    }

    const {email,password} = req.body;

    const user = await User.findOne({
      where:{email}
    });

    if(!user){
      return res.status(401).json({error:'Usuário não encontrado'});
    }

   if(!(await user.checkPassword(password))){
     return res.status(401).json({error:'Usuário ou senha inválidos'});
   }

   const {id,name,telefone} = user;

   const token = jwt.sign({
     id
    },'3228e8a9e5c3726304a62fa5353e5f06',{expiresIn:'7d'});

   return res.json({
     user:{
      id,
      name,
      email,
      telefone
     },
     token
   })
  }
}

module.exports = new SessionController();