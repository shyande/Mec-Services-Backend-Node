const Disponibilidade = require('../models/Disponibilidade');
const Empresa = require('../models/Empresa');
const Yup = require('yup');

const {startOfHour, parseISO, isBefore, format, subHours} = require('date-fns');

class DisponibilidadeController{

  async index(req,res){

    const {date} = req.body;

    const disponibilidadeStatus = await Disponibilidade.findOne({
      where:{date}
    });

    if(!disponibilidadeStatus){
      return res.status(400).json({error:'Disponibilidade não cadastrada'});
    }

    const {status_disponibilidade,id} = disponibilidadeStatus;

    return res.json({
      id,
      date,
      status_disponibilidade
    });
  }
  
  async store(req,res){
    
    const schema = Yup.object().shape({
      date:Yup.date().required(),
      hour:Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({error:'Dados inválidos'});
    }

    const checkEmpresa = await Empresa.findByPk(req.userId);

    if(!checkEmpresa){
      return res.status(401).json({error:'Cadastro pode ser efetuado apenas pela empresa'});
    }

    const {date, hour} = req.body;

    const hourStart = startOfHour(parseISO(date));

    if(isBefore(hourStart, new Date())){
      return res.json({error:'Disponibilidade não disponivel'});
    }

    const dateHour = await Disponibilidade.findOne({
      where:{
        date: hourStart,
        hour
      },
    });

    if(dateHour){
      return res.json({error:'Disponibilidade já cadastrada'});
    }

    const {id} = await Disponibilidade.create(req.body);

    return res.json({
      id,
      date,
      hour,
    })
  }

}

module.exports = new DisponibilidadeController();