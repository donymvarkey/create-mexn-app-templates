import { getApplicationHealth, getSystemHealth } from '../utils/common.js';

export const getServerHealthDetails = () => {
  return {
    application: getApplicationHealth(),
    system: getSystemHealth(),
    timestamp: Date.now()
  };
};
