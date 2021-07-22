const User = require('../models/User');
const Yup = require('yup');

class UserController{
  async store(req,res){

    const schema = Yup.object().shape({
      email:Yup.string().required().email(),
      name:Yup.string().required(),
      password:Yup.string().required().min(6),
      telefone:Yup.string().required(),
    })

    if(!(await schema.isValid(req.body))){
      return res.json({error:'Erro na validação dos dados'});
    }

    const userExists = await User.findOne({
      where:{email: req.body.email}
    })

    if(userExists){
      return res.json({error:'Usuario já existe'});
    }

    const {name,email,telefone} = await User.create(req.body);

    return res.json({
      name,
      email,
      telefone,
    })
  }

  async update(req,res){

    const schema = Yup.object().shape({
      email:Yup.string().required().email(),
      name:Yup.string().required(),
      telefone:Yup.string().required(),
      oldpassword:Yup.string().required(),
      password:Yup.string().min(6),
      confirmPassword:Yup.string().when('password',(password,field) => 
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({error:'Falha na validação dos dados'});
    }

    const {email,name,oldpassword,telefone} = req.body;

    const user = await User.findByPk(req.userId);

    if(email !== user.email){
      return res.status(401).json({error:'Atualização não permitida'});
    }

    if(oldpassword && (! await user.checkPassword(oldpassword))){
      return res.status(401).json({error:'Senha incompatível'});
    }

    await user.update(req.body);

    return res.json({
      email,
      name,
      telefone
    });
  }
}

module.exports = new UserController();