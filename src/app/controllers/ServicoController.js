const Servico = require('../models/Servico');
const Empresa = require('../models/Empresa');

const Yup = require('yup');

class ServicoController{

  async show(req,res){

    const services = await Servico.findAll();

    return res.json(services);
  }
  
  async store(req,res){
    
    const schema = Yup.object().shape({
      tipo_servico:Yup.string().required(),
      tempo_estimado:Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({error:'Dados inválidos'});
    }

    const checkEmpresa = await Empresa.findOne({
      where:{id: req.userId}
    });
    
    if(!checkEmpresa){
      return res.status(401).json({error:'Cadastro pode ser efetuado apenas pela empresa'});
    }

    const {tipo_servico,tempo_estimado} = req.body;

    const servicoExists = await Servico.findOne({
      where:{tipo_servico}
    });

    if(servicoExists){
      return res.json({error:'Serviço já cadastrado'});
    }

    const {id} = await Servico.create(req.body);

    return res.json({
      id,
      tipo_servico,
      tempo_estimado,
    });
  }

  async update(req,res){
    
    const schema = Yup.object().shape({
      id:Yup.number().required(),
      tipo_servico:Yup.string().required(),
      tempo_estimado:Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({error:'Dados inválidos'});
    }

    const checkEmpresa = await Empresa.findByPk(req.userId);
    
    if(!checkEmpresa){
      return res.status(401).json({error:'Cadastro pode ser efetuado apenas pela empresa'});
    }
     
    const {id} = req.body;

    const servicoExists = await Servico.findOne({
      where:{id}
    });

    if(!servicoExists){
      return res.json({error:'Serviço não existe'});
    }

    const {tempo_estimado,tipo_servico} = await servicoExists.update(req.body);

    return res.json({
      id,
      tipo_servico,
      tempo_estimado
    });
  }
}

module.exports = new ServicoController();

