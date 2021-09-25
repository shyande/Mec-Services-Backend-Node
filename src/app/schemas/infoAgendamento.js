const mongoose = require('mongoose');

const InfoAgendamentoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  endereco: {
    type: String,
    required: true,
  },
  telefone:{
    type: String,
  },
  servico: {
    type: String,
    required: true,
  },
  veiculo: {
    type: String,
    required: true,
  },
  disponibilidade: {
    type: String,
    required: true,
  },
  dateCalc:{
    type:Date,
    requires: true,
  },
  referenciaId: {
    type: Number,
    required: true,
  },
  status:{
    type:String,
    requried:true
  }
},{
  timestamps: true,
}
);

module.exports = mongoose.model('InfoAgendamento',InfoAgendamentoSchema);