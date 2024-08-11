import pino from 'pino';
import path from 'path';
import fs from 'fs';
import constants from '../constants.js';

const logDirectory = constants.app.log.directory;
if (! fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

const streams = [
  {
    level: "info",
    stream: fs.createWriteStream(path.join(logDirectory, 'info.log'), { flags: "a" }),
  },
  {
    level: "error",
    stream: fs.createWriteStream(path.join(logDirectory, 'error.log'), { flags: "a" }),
  },
  {
    level: "debug",
    stream: fs.createWriteStream(path.join(logDirectory, 'debug.log'), { flags: "a" }),
  },
];

const pinoConfig = { level: constants.app.log.level };
const logger = pino(pinoConfig, pino.multistream(streams));

process.on('exit', () => { logger.flush(); });

logger.debug('Log entry: Server started');

export default logger;
