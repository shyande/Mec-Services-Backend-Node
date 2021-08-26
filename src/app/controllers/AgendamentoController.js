const Yup = require('yup');
const Agendamento = require('../models/Agendamento');
const Empresa = require('../models/Empresa');
const Veiculo = require('../models/Veiculo');
const Servico = require('../models/Servico');
const User = require('../models/User');
const Disponibilidade = require('../models/Disponibilidade');
const InfoAgendamento = require('../schemas/infoAgendamento');
const {subHours,isBefore,format} = require('date-fns');

class AgendamentoController{

  async show(req,res){

    const isEmpresa = await Empresa.findByPk(req.userId);

    if(!isEmpresa){
      return res.status(401).json({error:'Empresa inválida'});
    }

    const infoAgendamentoDados = await InfoAgendamento.find();

    return res.json(infoAgendamentoDados);
  }

  async index(req,res){
    
    const user = await User.findOne({
      where:{id:req.userId},
    });

    const infoAgendamentoDados = await InfoAgendamento.find({email:user.email});


    return res.json(infoAgendamentoDados)

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

    const checkServico = await Servico.findOne({
      where:{id:servico}
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

    if(!checkServico){
      return res.status(401).json({error:'identificação do serviço falhou'});
    }

    /**Checando disponibilidade*/
    const checkAgendamento = await Agendamento.findOne({
      where:{disponibilidade}
    });

    if(checkAgendamento){
      return res.status(401).json({error:'Disponibilidade já utilizada'});
    }

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
      servico:checkServico.tipo_servico,
      disponibilidade:dateHour,
      referenciaId: id,
      dateCalc:checkDisponibilidade.date
    });

    return res.json(infoAgendamentoDados);

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