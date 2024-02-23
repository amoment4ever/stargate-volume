const { logger } = require('./logger');
const { sleep } = require('./sleep');

/* eslint-disable no-param-reassign */
async function retry(func, maxAttempts = 2, delay = 1000, factor = 1.3) {
  let attempts = 0;

  const execute = async () => {
    try {
      return await func();
    } catch (error) {
      if (++attempts >= maxAttempts) throw error;
      logger.error('Error, will try again', error);
      await sleep(delay);
      delay *= factor;
      return execute();
    }
  };

  return execute();
}

module.exports = {
  retry,
};
