const Empresa = require('../models/Empresa');
const Yup = require('yup');

class EmpresaController{
  async show(req,res){
    const empresaExists = await Empresa.findOne({
      where:{id: req.userId}
    });

    const {email,name,telefone,cnpj,endereco} = empresaExists

    return res.json({
      email,
      name,
      endereco,
      telefone,
      cnpj
    })
  }
  async store(req,res){

    const schema = Yup.object().shape({
      email:Yup.string().required().email(),
      cnpj:Yup.string().required(),
      endereco:Yup.string().required(),
      name:Yup.string().required(),
      password:Yup.string().required().min(6),
      telefone:Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({error:'Erro na validação dos dados'});
    }

    const empresaExists = await Empresa.findOne({
      where:{email: req.body.email}
    });

    if(empresaExists){
      return res.status(401).json({error:'Empresa já existe'});
    }

    const {name,email,telefone,endereco} = await Empresa.create(req.body);

    return res.json({
      name,
      email,
      telefone,
      endereco
    });
  }

  async update(req,res){

    const schema = Yup.object().shape({
      email:Yup.string().required().email(),
      name:Yup.string().required(),
      endereco:Yup.string().required(),
      cnpj:Yup.string().required(),
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

    const {email,name,oldpassword,cnpj} = req.body;

    const empresa = await Empresa.findByPk(req.userId);

    if(email !== empresa.email){
      return res.status(401).json({error:'Atualização não permitida'});
    }

    if(oldpassword && (! await empresa.checkPassword(oldpassword))){
      return res.status(401).json({error:'Senha incompatível'});
    }

    await empresa.update(req.body);

    return res.json({
      email,
      name,
      cnpj,
    });
  }
  
}

module.exports = new EmpresaController();