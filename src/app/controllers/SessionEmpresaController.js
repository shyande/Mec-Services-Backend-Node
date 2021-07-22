const jwt = require('jsonwebtoken');
const Yup = require('yup');

const Empresa = require('../models/Empresa');

//const authConfig = require('../../config/auth');

class SessionEmpresaController{
  async store(req,res){

    const schema = Yup.object().shape({
      email:Yup.string().required().email(),
      password:Yup.string().required().min(6),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({error:'Não autorizado, dados inválidos'});
    }

    const {email,password} = req.body;

    const empresa = await Empresa.findOne({
      where:{email}
    });

    if(!empresa){
      return res.status(401).json({error:'Usuário não encontrado'});
    }

   if(!(await empresa.checkPassword(password))){
     return res.json({error:'Usuário ou senha inválidos'});
   }

   const {id,name} = empresa;

   const token = jwt.sign({
     id
    },'3228e8a9e5c3726304a62fa5353e5f06',{expiresIn:'7d'});

   return res.json({
    empresa:{
      id,
      name,
      email,
     },
     token
   })
  }
}

module.exports = new SessionEmpresaController();