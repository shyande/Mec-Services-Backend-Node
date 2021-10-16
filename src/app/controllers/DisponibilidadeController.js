const Disponibilidade = require('../models/Disponibilidade');
const Empresa = require('../models/Empresa');
const Yup = require('yup');

const {startOfHour, parseISO, isBefore, format, subHours} = require('date-fns');

class DisponibilidadeController{

  async findDay(req,res){
    const isEmpresa = await Empresa.findByPk(req.userId);

    if(!isEmpresa){
      return res.status(401).json({error:'Empresa inválida'});
    }

    const disponibilidadeOpen = await Disponibilidade.findAll({
      where:{
        status_disponibilidade:'1',
      },
      order: ['date'],
      limit:30,
      attributes:['id','date','status_disponibilidade','display_date','past']
    });
    const nextAgendamento = []
    for(let x = 0; x < disponibilidadeOpen.length; x++){
      if(disponibilidadeOpen[x].past === false){
        nextAgendamento.push(disponibilidadeOpen[x])
      }
    }
    let data = []
    nextAgendamento.map((item) => {
      let dia = item.date.getDate()
      let mes = item.date.getMonth() + 1
      let ano = item.date.getFullYear()

      let dateH = new Date()
      let diaH = dateH.getDate()
      let mesH = dateH.getMonth() + 1
      let anoH = dateH.getFullYear()

      if(dia < 10){
        dia = '0' + dia; 
      }
      if(mes < 10){
        mes = '0' + mes; 
      }
      if(diaH < 10){
        diaH = '0' + diaH; 
      }
      if(mesH < 10){
        mesH = '0' + mesH; 
      }

      const date1 = `${dia}-${mes}-${ano}` 
      const date2 = `${diaH}-${mesH}-${anoH}` 

       if(date1 == date2){
        data.push(item)
       }
       else{
         console.log(`${date1}  ! ${date2}`)
       }
    })
    return res.json(
      data
    )

  }


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
  async delete(req,res){

    const {id} = req.params;

    const disponibilidadeOpen = await Disponibilidade.findAll({
      where:{id},
    });

    if(!disponibilidadeOpen){
      res.status(400).json({error:'Disponibilidade não encontrada ou já retirada'});
    }

    disponibilidadeOpen.status_disponibilidade = 1;

    disponibilidadeOpen.save();

    return res.status(200).json({message:'Disponibilidade retirada'});

  }

}

module.exports = new DisponibilidadeController();