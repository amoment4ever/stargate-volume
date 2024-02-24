const { HttpsProxyAgent } = require('https-proxy-agent');
const { Web3 } = require('web3');
const { RPCS } = require('../constants/constants');
const { proxies } = require('../proxies');
const { LinkedList } = require('../utils/linked-list');

const web3sBscList = new LinkedList([]);

const RPC_BSC = RPCS.find((item) => item.chain === 'BSC');

proxies.array.forEach((proxy) => {
  let agent;
  if (proxy?.proxy) {
    agent = new HttpsProxyAgent(proxy?.proxy);
  }

  const web3sBsc = new Web3(new Web3.providers.HttpProvider(RPC_BSC.rpc, {
    providerOptions: { agent },
  }));

  // console.log(web3.provider.httpProviderOptions.providerOptions);
  // web3.provider.httpProviderOptions.agent = agent;

  web3sBscList.push(web3sBsc);
});

module.exports = {
  web3sBscList,
};
