const ccxt = require('ccxt');
const { BITGET_API_KEY, SECRET_BITGET, BITGET_PHRASE } = require('../settings');
const { logger } = require('../utils/logger');

const exchange = new ccxt.bitget({
  apiKey: BITGET_API_KEY,
  secret: SECRET_BITGET,
  password: BITGET_PHRASE,
  enableRateLimit: true,
});

async function getUsdvBitgetBalance() {
  const balance = await exchange.fetchBalance();

  return balance?.USDV?.free;
}

async function withdrawUsdv(address, amount) {
  try {
    const tag = '';

    const withdrawal = await exchange.withdraw('USDV', amount, address, tag, { network: 'BSC' });
    logger.info('Response withdraw', withdrawal);

    return withdrawal;
  } catch (error) {
    logger.error('Error withdraw', error);
  }
}

module.exports = {
  withdrawUsdv,
  getUsdvBitgetBalance,
};
