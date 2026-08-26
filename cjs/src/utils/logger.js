'use strict';
const { createLogger, format, transports } = require('winston');
const util = require('util');
const path = require('path');
const sourceMapSupport = require('source-map-support');
const { red, blue, yellow, green, magenta } = require('colorette');
const config = require('../config');
const EApplicationEnvironment = require('../constants/application');

// For linking trace support
sourceMapSupport.install();

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

  const customMeta = util.inspect(meta, {
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

module.exports = logger;
