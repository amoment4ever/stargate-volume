const { default: BigNumber } = require('bignumber.js');
const { getUsdvBitgetBalance } = require('../components/bitget');
const { logger } = require('./logger');
const { retry } = require('./retry');
const { sleep } = require('./sleep');

async function waitForBitgetBalance(amount) {
  await retry(async () => {
    while (true) {
      const balance = await getUsdvBitgetBalance();

      logger.info('Balance', {
        balance,
        expect: amount,
      });

      if (balance > amount) {
        break;
      } else {
        logger.info('Sleep 10000ms, waiting for deposit USDV on BitGet');
        await sleep(10000);
      }
    }
  }, 30, 10000);
}

async function waitForTokenBalance(erc20Contract, amount, address) {
  await retry(async () => {
    while (true) {
      const decimals = await erc20Contract.getDecimals();
      const balance = await erc20Contract.getBalance(address);

      const readableBalance = new BigNumber(balance).div(10 ** Number(decimals));

      logger.info('Balance', {
        address,
        readableBalance,
        expect: amount,
      });

      if (readableBalance.gte(amount)) {
        break;
      } else {
        logger.info('Sleep 10000ms, wait for tokens');
        await sleep(10000);
      }
    }
  }, 30, 10000);
}

module.exports = {
  waitForTokenBalance,
  waitForBitgetBalance,
};
