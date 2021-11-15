const Yup = require('yup');
const Agendamento = require('../models/Agendamento');
const Empresa = require('../models/Empresa');
const Veiculo = require('../models/Veiculo');
const User = require('../models/User');
const Disponibilidade = require('../models/Disponibilidade');
const InfoAgendamento = require('../schemas/infoAgendamento');
const {subHours,isBefore,format,parseISO} = require('date-fns');

class AgendamentoController{

  async total(req,res){
    const isEmpresa = await Empresa.findByPk(req.userId);

    if(!isEmpresa){
      return res.status(401).json({error:'Empresa inválida'});
    }

    const infoAgendamentoDados = await InfoAgendamento.find({status:'Concluído'});

    return res.json(infoAgendamentoDados);

  }

  async findCandeled(req,res){
    const isEmpresa = await Empresa.findByPk(req.userId);

    if(!isEmpresa){
      return res.status(401).json({error:'Empresa inválida'});
    }

    const agendamentos = await Agendamento.findAll({
      where:{status_agendamento:false}
    });

    let agedamentosCancelados = []

    agendamentos.map((item) => {
     const {id,status_agendamento,user} = item
     
     let dia = item.canceled_at.getDate()
     let mes = item.canceled_at.getMonth() + 1
     let ano = item.canceled_at.getFullYear()
    
      if(dia < 10){
        dia = '0' + dia; 
      }
      if(mes < 10){
        mes = '0' + mes; 
      }

     const format = `${dia}-${mes}-${ano}` 
     const data = {format,id,status_agendamento,user}
     
     agedamentosCancelados.push(data)
    })
    return res.json(
      agedamentosCancelados
    )
  }

  async show(req,res){

    const isEmpresa = await Empresa.findByPk(req.userId);

    if(!isEmpresa){
      return res.status(401).json({error:'Empresa inválida'});
    }

    const infoAgendamentoDados = await InfoAgendamento.find().sort({_id:-1});

    const agendamentosAtivos = []
    const agendamentosAntigos = []

    infoAgendamentoDados.map(item => {
      if(isBefore(item.dateCalc, new Date())){
        agendamentosAntigos.push(item)
      } else{
        agendamentosAtivos.push(item)
      }
    });

    return res.json(agendamentosAtivos);
  }

  async index(req,res){
    
    const user = await User.findOne({
      where:{id:req.userId},
    });

    const infoAgendamentoDados = await InfoAgendamento.find({email:user.email});
    
    const agendamentosAtivos = []
    const agendamentosAntigos = []

    infoAgendamentoDados.map(item => {
      if(isBefore(item.dateCalc, new Date())){
        agendamentosAntigos.push(item)
      } else{
        agendamentosAtivos.push(item)
      }
    });
    
    return res.json(agendamentosAtivos)

  }
  
  async store(req,res){
    const schema = Yup.object().shape({
      user:Yup.string().required(),
      veiculo:Yup.string().required(),
      disponibilidade:Yup.string().required(),
      empresa:Yup.string().required(),
      servico:Yup.string().required(),
      status_agendamento:Yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(401).json({error:'Dados inválidos'});
    }

    const {user,veiculo,disponibilidade,empresa,servico,status_agendamento} = req.body;

    const checkUser = await User.findOne({
      where:{id:req.userId}
    });

    const checkCar = await Veiculo.findOne({
      where:{
        id:veiculo,
        user: req.userId
      }
    });

    const checkDisponibilidade = await Disponibilidade.findOne({
      where:{id:disponibilidade}
    });

    const checkEmpresa = await Empresa.findOne({
      where:{id:empresa}
    });
    
    if(!checkUser){
      return res.status(401).json({error:'identificação do usuario falhou'});
    }

    if(!checkCar){
      return res.status(401).json({error:'identificação do veiculo falhou'});
    }

    if(!checkDisponibilidade){
      return res.status(401).json({error:'identificação do horario falhou'});
    }

    if(!checkEmpresa){
      return res.status(401).json({error:'identificação da empresa falhou'});
    }

    /**Checando disponibilidade*/
    const checkAgendamento = await Agendamento.findOne({
      where:{disponibilidade}
    });

    if(checkAgendamento){
      return res.status(401).json({error:'Disponibilidade já utilizada'});
    }
    console.log(checkUser.name)

    const dateHour =  format(checkDisponibilidade.date, "dd-MM-yyyy' às 'HH:00")

    const agendamento = await Agendamento.create({
      user,
      veiculo,
      disponibilidade,
      empresa,
      status_agendamento,
      servico,
      status_agendamento: true,
    });

    checkDisponibilidade.status_disponibilidade = 1;

    await checkDisponibilidade.save();

    const {id} = agendamento;

    /**Salvando dados brutos para exibir para o usuario no frontend */
    const infoAgendamentoDados = await InfoAgendamento.create({
      email:checkUser.email,
      veiculo: checkCar.placa,
      endereco:checkEmpresa.endereco,
      servico,
      nome:checkUser.name,
      telefone:checkUser.telefone,
      disponibilidade:dateHour,
      referenciaId: id,
      dateCalc:checkDisponibilidade.date,
      status:'Recebido'
    });

    return res.json(infoAgendamentoDados);

  }

  async update(req,res){

    const infoAgendamentoDados = await InfoAgendamento.findOne({referenciaId:req.params.id});

    if(!infoAgendamentoDados){
      return res.status(401).json({error:'Agendamento não existe'});
    }

    const {status} = req.body;

    infoAgendamentoDados.status = status;

    infoAgendamentoDados.save()

    return res.status(200).json({status:'Atualizado'})

  }

  async delete(req,res){

    const isUser = await User.findByPk(req.userId);

    const agendamento = await Agendamento.findByPk(req.params.id);

    if(!agendamento){
      return res.status(401).json({error:'Agendamento não existe'});
    }

    const infoAgendamentoDados = await InfoAgendamento.findOne({referenciaId:req.params.id});

    if(agendamento.user !== isUser.id){
      return res.status(401).json({error:'Você não tem permissão para cancelar esse agendamento'});
    }

    if(!infoAgendamentoDados){
      return res.status(401).json({error:'agendamento já foi cancelado'})
    }

    const dateSub = subHours(infoAgendamentoDados.dateCalc, 2);
    
    if(isBefore(dateSub, new Date())){
      return res.status(401).json({error:'Você não pode cancelar, pois já passou do prazo ou é um agendamento antigo!'});
    }

    const checkDisponibilidade = await Disponibilidade.findOne({
      where:{id:agendamento.disponibilidade}
    });

    infoAgendamentoDados.delete();

    agendamento.canceled_at = new Date();
    agendamento.disponibilidade = null;
    agendamento.status_agendamento = false;

    checkDisponibilidade.status_disponibilidade = null;
    await checkDisponibilidade.save();
   
    await agendamento.save();

    return res.json(agendamento);
  }

}

module.exports = new AgendamentoController();