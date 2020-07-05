// importa módulo do mongoose
import mongoose from 'mongoose';

// schema
const gradeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 0) throw new Error('Valor negativo para a nota');
    },
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

// nome da coleção é desafio
const gradeModel = mongoose.model('desafio', gradeSchema, 'desafio');

// exporta módulo
export { gradeModel };
