import { getApplicationHealth, getSystemHealth } from '../utils/common.js';

const getServerHealthDetails = () => {
  return {
    application: getApplicationHealth(),
    system: getSystemHealth(),
    timestamp: Date.now(),
  };
};

export default getServerHealthDetails;
