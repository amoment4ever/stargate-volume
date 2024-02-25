/* eslint-disable no-plusplus */
const { default: BigNumber } = require('bignumber.js');
const requestPromise = require('request-promise');
const WALLETS = require('./wallets.json');
const { EthAccount } = require('./components/account');
const { withdrawUsdv } = require('./components/bitget');
const { ERC20Contract } = require('./components/erc20');
const { Stargate } = require('./components/stargate');
const { web3sAvaxList } = require('./components/web3-avax');
const { web3sBscList } = require('./components/web3-bsc');
const { web3sBscPolygon } = require('./components/web3-polygon');
const { LZ_CHAIN_IDS, USDV_TOKEN_ADDRESS } = require('./constants/constants');
const {
  USDV_BRIDGE_MIN, USDV_BRIDGE_MAX, SLEEP_MAX_MS, SLEEP_MIN_MS,
} = require('./settings');
const { randomNumber, getRandomInt } = require('./utils/getRandomInt');
const { LinkedList } = require('./utils/linked-list');
const { logger } = require('./utils/logger');
const { waitForTokenBalance, waitForBitgetBalance } = require('./utils/wait-for');
const { retry } = require('./utils/retry');
const { proxies } = require('./proxies');
const { sleep } = require('./utils/sleep');

const web3sLists = {
  BSC: web3sBscList,
  POLYGON: web3sBscPolygon,
  AVAX: web3sAvaxList,
};

async function doBridgeUsdv({
  web3From,
  web3To,
  fromChain,
  toChain,
  privateKey,
  fullBalance,
  transferAmount,
}) {
  const stargate = new Stargate(web3From, LZ_CHAIN_IDS[fromChain], fromChain);
  const account = new EthAccount(privateKey, web3From, null);
  const usdvTokenContractFrom = new ERC20Contract(web3From, USDV_TOKEN_ADDRESS[fromChain]);

  const decimalsUsdv = await usdvTokenContractFrom.getDecimals();
  const balanceusdv = await usdvTokenContractFrom.getBalance(account.address);
  const readableBalance = new BigNumber(balanceusdv).div(10 ** Number(decimalsUsdv));

  logger.info('Balance USDV', {
    balanceusdv: readableBalance.toString(),
    address: account.address,
  });

  if (fullBalance) {
    // eslint-disable-next-line no-param-reassign
    transferAmount = readableBalance;
  }

  const transferAmountWei = new BigNumber(transferAmount).multipliedBy(10 ** Number(decimalsUsdv));
  const minAmountWei = new BigNumber(transferAmount).multipliedBy(10 ** Number(decimalsUsdv)).minus(100);

  await retry(async () => {
    const { method: sendMethod, feeNative } = await stargate.sendUsdvMethod(
      account.address,
      transferAmountWei.toString(),
      minAmountWei.toString(),
      toChain,
    );

    const gasPrice = await account.getGasPrice();
    const estimateGas = await sendMethod.estimateGas({
      from: account.address,
      value: feeNative,
    });

    logger.info('estimate gas bridge', {
      estimateGas,
      gasPrice: `${gasPrice} GWEI`,
    });

    if (estimateGas) {
      const response = await sendMethod.send({
        from: account.address,
        value: feeNative,
        gasPrice: +(gasPrice * 1e9 * 1.02).toFixed(0),
        gasLimit: +(Number(estimateGas) * 1.15).toFixed(0),
      });

      logger.info('Sent transaction bridge USDV', {
        address: account.address,
        txHash: response.transactionHash,
      });
    }
  }, 100, 10000);

  const usdvTokenContractTo = new ERC20Contract(web3To, USDV_TOKEN_ADDRESS[toChain]);
  await waitForTokenBalance(usdvTokenContractTo, transferAmount - 1, account.address);
}

async function start() {
  const ROUTES = new LinkedList([
    ['BSC', 'AVAX', 'POLYGON', 'BSC'],
    ['BSC', 'POLYGON', 'BSC'],
    ['BSC', 'AVAX', 'BSC'],
  ]);

  for (const { PRIVATE_KEY, DEPOSIT_BITGET_ADDRESS, ADDRESS } of WALLETS) {
    const { linkToChange } = proxies.get();

    logger.info('Try to bridge', {
      ADDRESS,
      DEPOSIT_BITGET_ADDRESS,
    });
    try {
      const web3Bsc = web3sLists.BSC.get();
      const web3Polygon = web3sLists.POLYGON.get();
      const web3Avax = web3sLists.AVAX.get();

      const transferAmount = randomNumber(USDV_BRIDGE_MIN, USDV_BRIDGE_MAX).toFixed(4);

      logger.info('Wait for balance on bitget');
      await waitForBitgetBalance(transferAmount);

      logger.info('Try to withdraw', {
        transferAmount,
      });
      await withdrawUsdv(ADDRESS, transferAmount);

      const usdvTokenContractBsc = new ERC20Contract(web3Bsc, USDV_TOKEN_ADDRESS.BSC);

      logger.info('Wait for tokens on account', {
        address: ADDRESS,
      });
      await waitForTokenBalance(usdvTokenContractBsc, transferAmount - 3, ADDRESS);

      const route = ROUTES.get();

      for (let i = 0; i < route.length - 1; i++) {
        const fromChain = route[i];
        const toChain = route[i + 1];

        const web3Map = {
          BSC: web3Bsc,
          AVAX: web3Avax,
          POLYGON: web3Polygon,
        };

        logger.info('Bridge', {
          fromChain,
          toChain,
        });

        await retry(async () => {
          await doBridgeUsdv({
            fromChain,
            toChain,
            fullBalance: true,
            privateKey: PRIVATE_KEY,
            web3From: web3Map[fromChain],
            web3To: web3Map[toChain],
          });
        }, 3);

        logger.info('Bridge done', {
          fromChain,
          toChain,
        });
      }

      await retry(async () => {
        const accountBsc = new EthAccount(PRIVATE_KEY, web3Bsc, null);
        const gasPriceBsc = await accountBsc.getGasPrice();
        const balanceUSDV = await usdvTokenContractBsc.getBalance(ADDRESS);

        const transferData = await usdvTokenContractBsc.transfer(DEPOSIT_BITGET_ADDRESS, balanceUSDV, {
          from: ADDRESS,
          gasLimit: 200000,
          gasPrice: +(gasPriceBsc * 1e9 * 1.02).toFixed(0),
        });

        logger.info('Transfer to bitget', {
          hash: transferData.transactionHash,
          balanceUSDV,
        });
      }, 3);
    } catch (exc) {
      logger.error('Error bridge', exc);
    }

    if (linkToChange) {
      logger.info('Chainging mobile ip on proxy');
      await requestPromise(linkToChange).catch((exc) => {
        logger.error('Error change proxy ip', exc);
      });
    }

    const sleepMs = getRandomInt(SLEEP_MIN_MS, SLEEP_MAX_MS);
    logger.info('Sleep before change account', {
      sleepMs: `${sleepMs}ms`,
    });
    await sleep(sleepMs);
  }
}

start();
