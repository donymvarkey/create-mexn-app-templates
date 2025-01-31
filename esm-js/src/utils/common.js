import { loadavg, totalmem, freemem } from 'os';
import config from '../config/index.js';

const getApplicationHealth = () => {
  return {
    env: config.env,
    uptime: `${process.uptime().toFixed(2)} Second`,
    memoryUsage: {
      heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
    },
  };
};

const getSystemHealth = () => {
  return {
    cpu_usage: loadavg(),
    totalMemory: `${(totalmem() / 1024 / 1024).toFixed(2)} MB`,
    freeMemory: `${(freemem() / 1024 / 1024).toFixed(2)} MB`,
  };
};

export { getApplicationHealth, getSystemHealth };
