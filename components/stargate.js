const ABI_STARGATE_BRIDGE_V1 = require('../data/abi-stargate-v1.json');
const ABI_USDV_CONTARCT = require('../data/abi-usdv-contract.json');
const { LZ_CHAIN_IDS, STARGATE_CONTRACTS, USDV_TOKEN_ADDRESS } = require('../constants/constants');

class Stargate {
  constructor(web3, lzChainId, chain) {
    this.web3 = web3;
    this.lzChainId = lzChainId;
    const { addressContract, contract } = this.getContractAddress(chain);
    this.addressContract = addressContract;
    this.bridgeContract = contract;
    this.usdvContractAddress = USDV_TOKEN_ADDRESS[chain];
    this.usdvContract = new this.web3.eth.Contract(ABI_USDV_CONTARCT, this.usdvContractAddress);
  }

  getContractAddress(chain) {
    let addressContract = STARGATE_CONTRACTS.COMMON_BRIDGE;

    switch (chain) {
      case 'FANTOM':
        addressContract = STARGATE_CONTRACTS.FANTOM_BRIDGE;
        break;
      case 'BSC':
        addressContract = STARGATE_CONTRACTS.BSC_BRIDGE;
        break;
      case 'OPTIMISM':
        addressContract = STARGATE_CONTRACTS.OPTIMISM_BRIDGE;
        break;
      case 'METIS':
        addressContract = STARGATE_CONTRACTS.METIS_BRIDGE;
        break;
      case 'ARBITRUM':
        addressContract = STARGATE_CONTRACTS.ARBITRUM_BRIDGE;
        break;
      case 'ZKSYNC':
        addressContract = STARGATE_CONTRACTS.ZKSYNC_BRIDGE;
        break;
      case 'BASE':
        addressContract = STARGATE_CONTRACTS.BASE_STARGATE_ROUTER_CONTRACT;
        break;
    //   case 'KAVA':
    //     addressContract = STARGATE_CONTRACTS.KAVA_STARGATE_ROUTER_CONTRACT;
    //     break;
    }

    addressContract = this.web3.utils.toChecksumAddress(addressContract);

    // Create the contract object
    const contract = new this.web3.eth.Contract(ABI_STARGATE_BRIDGE_V1, addressContract);

    return { addressContract, contract };
  }

  async getFee(wallet, toChain, extraGas = 0) {
    return await this.bridgeContract.methods.quoteLayerZeroFee(
      LZ_CHAIN_IDS[toChain],
      1,
      wallet,
      '0x',
      [extraGas, 0, wallet],
    ).call();
  }

  async sendUsdvMethod(to, amount, minAmount, distChain) {
    const walletBytes = to.replace('0x', '0x000000000000000000000000');

    const params = [walletBytes, amount, minAmount, LZ_CHAIN_IDS[distChain]];

    const EXTRA_OPTIONS = {
      POLYGON: '0x00010000000000000000000000000000000000000000000000000000000000029810',
      BSC: '0x00010000000000000000000000000000000000000000000000000000000000029810',
      AVAX: '0x00010000000000000000000000000000000000000000000000000000000000029810',
    };

    const extraOptions = EXTRA_OPTIONS[distChain];

    const lzFee = await this.getFee(to, distChain);
    const msgFee = [lzFee[0], 0];
    const composeMsg = '0x';

    return {
      method: this.usdvContract.methods.send(params, extraOptions, msgFee, to, composeMsg),
      feeNative: lzFee[0],
    };
  }
}

module.exports = {
  Stargate,
};
