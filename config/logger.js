// configuração do arquivo de log
import winston from 'winston';
// módulo de log para mongodb
import winstondb from 'winston-mongodb';
// importa módulo do banco para passar ao criar log
import { db } from '../models/index.js';

const { combine, timestamp, label, printf } = winston.format;

const { createLogger, transports, format } = winston;

const myFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.MongoDB({
      level: 'info',
      db: db.url,
      collection: 'logs_grades',
      capped: true,
      cappedMax: 20,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
  ],
  format: format.combine(
    label({ label: 'grade-api' }),
    format.timestamp(),
    myFormat
  ),
});

export { logger };
