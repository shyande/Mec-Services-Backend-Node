const Yup = require('yup');
const Veiculo = require('../models/Veiculo');
const User = require('../models/User');

class VeiculoController{

  async show(req,res){
    const isUser = await User.findByPk(req.userId);

    if(!isUser){
      return res.status(401).json({error:'Dados inváidos'});
    }

    const cars = await Veiculo.findAll({
      where:{user:req.userId}
    });

    return res.json(cars);
  }

  async store(req,res){
    
    const schema = Yup.object().shape({
      placa: Yup.string().required(),
      marca: Yup.string().required(),
      modelo: Yup.string().required(),
      ano: Yup.number().required(),
      motor: Yup.string().required(),
      user: Yup.number().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({error:'Dados inváidos'});
    }

    const checkUser = await User.findOne({
      where:{id:req.body.user},
    });

    if(!checkUser){
      return res.status(401).json({error:'Usuario não existe!'});
    }

    const {placa} = req.body;

    const checkCarExists = await Veiculo.findOne({
      where:{placa}
    });

    if(checkCarExists){
      return res.status(401).json({error:'Veículo já cadastrado'});
    }

    const {modelo,ano,id,user} = await Veiculo.create(req.body);

    return res.json({
      id,
      placa,
      modelo,
      ano,
      id,
      user,
    });
  }

  async update(req,res){

    const schema = Yup.object().shape({
      placa: Yup.string().required(),
      marca: Yup.string().required(),
      modelo: Yup.string().required(),
      ano: Yup.number().required(),
      motor: Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({error:'Dados inváidos'});
    }

    const {id} = req.params;

    const veiculo = await Veiculo.findOne({
      where:{id}
    });

    if(!veiculo){
      return res.status(401).json({error:'Veículo não cadastrado'});
    }

    if(veiculo.user !== req.userId){
      return res.status(401).json({error:'Apenas o proprietario pode atualizar os dados'});
    }

    const {placa, marca, modelo, ano, motor} = await veiculo.update(req.body);

    return res.json({
      placa,
      marca,
      modelo,
      ano,
      motor,
    });
  }

}

module.exports = new VeiculoController();