const Disponibilidade = require('../models/Disponibilidade');
const Empresa = require('../models/Empresa');
const Yup = require('yup');

const {startOfHour, parseISO, isBefore, format, subHours} = require('date-fns');

class DisponibilidadeController{

  async show(req,res){

    const disponibilidadeOpen = await Disponibilidade.findAll({
      where:{status_disponibilidade:null},
      attributes:['id','date','status_disponibilidade','display_date','past']
    });

    return res.json(disponibilidadeOpen);
  }

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
    });
    
    if(!(await schema.isValid(req.body))){
      return res.status(401).json({error:'Dados inválidos'});
    }

    const checkEmpresa = await Empresa.findByPk(req.userId);

    if(!checkEmpresa){
      return res.status(401).json({error:'Cadastro pode ser efetuado apenas pela empresa'});
    }

    const {date} = req.body;

    const display_date =  format(parseISO(date), "dd-MM-yyyy' às 'HH:00")

    const hourStart = startOfHour(parseISO(date));

    if(isBefore(hourStart, new Date())){
      return res.status(401).json({error:'Disponibilidade não disponivel'});
    }

    const dateHour = await Disponibilidade.findOne({
      where:{
        date: hourStart,
      },
    });

    if(dateHour){
      return res.status(401).json({error:'Disponibilidade já cadastrada'});
    }
  
    const {id} = await Disponibilidade.create({
      date,
      display_date,
      status_disponibilidade:null,
    });

    return res.json({
      id,
      date,
      display_date,
    })
  }

}

module.exports = new DisponibilidadeController();