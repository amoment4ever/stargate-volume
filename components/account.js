const rp = require('request-promise');
// const BigNumber = require('bignumber.js');
const { logger } = require('../utils/logger');

class EthAccount {
  constructor(privateKey, web3, proxy) {
    this.proxy = proxy;
    this.web3 = web3;

    const account = this.web3.eth.accounts.privateKeyToAccount(`0x${privateKey.replace(/^0x/, '')}`);
    this.account = account;
    this.web3.eth.accounts.wallet.add(account);

    this.request = rp.defaults({
      json: true,
      gzip: true,
      proxy: this.proxy,
      // timeout: 6000,
    });
  }

  get address() {
    return this.account.address;
  }

  get privateKey() {
    return this.account.privateKey;
  }

  signMessage(msg) {
    return this.web3.eth.sign(msg, this.address);
  }

  //   async signTransaction(tx) {

  //   }

  sendTransaction(transactionObject) {
    return this.web3.eth.sendTransaction(transactionObject);
  }

  async sendSignedTransaction(signedTransaction) {
    logger.info('Try to send transaction', { signedTransaction });

    try {
      // Отправьте подписанную транзакцию на узел Ethereum через прокси-сервер
      const response = await this.request.post(this.rpcUrl, {
        body: {
          jsonrpc: '2.0',
          method: 'eth_sendRawTransaction',
          params: [signedTransaction],
          id: 1,
        },
      });

      if (response?.error?.message?.includes('nonce too')) {
        delete this.nonce;
      }

      logger.info('Response from rpc', {
        response,
        address: this.address,
      });
      const transactionHash = response.result;
      return transactionHash;
    } catch (error) {
      throw new Error(`Ошибка при отправке транзакции: ${error.message}`);
    }
  }

  async getNonce() {
    try {
      const data = await this.web3.eth.getTransactionCount(this.address);

      logger.info('Success got nonce', { address: this.address, data });

      return data;
    } catch (exc) {
      logger.error('Error get nonce', exc);
    }
  }

  async getBalance() {
    try {
      const data = await this.web3.eth.getBalance(this.address);

      logger.info('Got balance', {
        data,
        address: this.address,
      });
      return data;
    } catch (exc) {
      logger.error('Error get balance', exc);
    }
  }

  async getGasPrice() {
    try {
      const gasPrice = await this.web3.eth.getGasPrice();
      // Для удобства можно конвертировать цену газа в Gwei
      const gasPriceInGwei = this.web3.utils.fromWei(gasPrice, 'gwei');

      logger.info('Current gas', {
        gasPriceInGwei,
        address: this.address,
      });
      return gasPriceInGwei;
    } catch (error) {
      logger.error('Ошибка при получении цены газа:', {
        errorMessage: error.message,
        account: this.account,
      });
    }
  }

  async getEstimateGas(payload) {
    try {
      const data = await this.web3.eth.estimateGas(payload);

      logger.info('Estimate gas', {
        data,
        address: this.address,
      });

      return data;
    } catch (exc) {
      logger.error('Error get estimate gas', exc);
    }
  }
}

module.exports = {
  EthAccount,
};
