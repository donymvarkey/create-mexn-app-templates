'use strict';
import { createLogger, format, transports } from 'winston';
import { inspect } from 'node:util';
import path from 'node:path';
import { install } from 'source-map-support';
import { red, blue, yellow, green, magenta } from 'colorette';
import config from '../config/index.js';
import EApplicationEnvironment from '../constants/application.js';

// For linking trace support
install();

// Colorize the level string
const colorizeLevel = (level) => {
  switch (level) {
    case 'ERROR':
      return red(level);
    case 'INFO':
      return blue(level);
    case 'WARN':
      return yellow(level);
    default:
      return level;
  }
};

const consoleLogFormat = format.printf((info) => {
  const { level, message, timestamp, meta = {} } = info;

  const customLevel = colorizeLevel(level.toUpperCase());

  const customTimestamp = green(timestamp);

  const customMessage = message;

  const customMeta = inspect(meta, {
    showHidden: false,
    depth: null,
    colors: true,
  });

  const customLog = `${customLevel} [${customTimestamp}] ${customMessage}\n${magenta('META')} ${customMeta}\n`;

  return customLog;
});

const consoleTransport = () => {
  if (config.env === EApplicationEnvironment.DEVELOPMENT) {
    return [
      new transports.Console({
        level: 'info',
        format: format.combine(format.timestamp(), consoleLogFormat),
      }),
    ];
  }

  return [
    new transports.Console({
      level: 'info',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ];
};

const fileLogFormat = format.printf((info) => {
  const { level, message, timestamp, meta = {} } = info;

  const logData = {
    level: level.toUpperCase(),
    message,
    timestamp,
    meta,
  };

  return JSON.stringify(logData, null, 4);
});

const FileTransport = () => {
  return [
    new transports.File({
      filename: path.join(
        process.cwd(),
        'logs',
        `${config.env || 'development'}.log`,
      ),
      level: 'info',
      format: format.combine(format.timestamp(), fileLogFormat),
    }),
  ];
};

const logger = createLogger({
  defaultMeta: {
    meta: {},
  },
  transports: [...FileTransport(), ...consoleTransport()],
});

export default logger;
