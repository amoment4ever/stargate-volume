const { HttpsProxyAgent } = require('https-proxy-agent');
const { Web3 } = require('web3');
const { RPCS } = require('../constants/constants');
const { proxies } = require('../proxies');
const { LinkedList } = require('../utils/linked-list');

const web3sAvaxList = new LinkedList([]);

const RPC_AVAX = RPCS.find((item) => item.chain === 'AVAXC');

proxies.array.forEach((proxy) => {
  let agent;
  if (proxy?.proxy) {
    agent = new HttpsProxyAgent(proxy?.proxy);
  }

  const web3sAvax = new Web3(new Web3.providers.HttpProvider(RPC_AVAX.rpc, {
    providerOptions: { agent },
  }));

  // console.log(web3.provider.httpProviderOptions.providerOptions);
  // web3.provider.httpProviderOptions.agent = agent;

  web3sAvaxList.push(web3sAvax);
});

module.exports = {
  web3sAvaxList,
};
