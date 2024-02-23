const RPCS = [
  {
    chain: 'ETH', rpc: 'https://rpc.ankr.com/eth', scan: 'https://etherscan.io', token: 'ETH',
  },
  {
    chain: 'ZKSYNC', rpc: 'https://rpc.ankr.com/zksync_era', scan: 'https://www.oklink.com/zksync', token: 'ETH',
  },
  {
    chain: 'ARBITRUM', rpc: 'https://arb1.arbitrum.io/rpc', scan: 'https://arbiscan.io', token: 'ETH',
  },
  {
    chain: 'NOVA', rpc: 'https://rpc.ankr.com/arbitrumnova', scan: 'https://nova.arbiscan.io', token: 'ETH',
  },
  {
    chain: 'OPTIMISM', rpc: 'https://rpc.ankr.com/optimism', scan: 'https://optimistic.etherscan.io', token: 'ETH',
  },
  {
    chain: 'SCROLL', rpc: 'https://rpc.ankr.com/scroll', scan: 'https://scrollscan.com', token: 'ETH',
  },
  {
    chain: 'BASE', rpc: 'https://1rpc.io/base', scan: 'https://basescan.org', token: 'ETH',
  },
  {
    chain: 'LINEA', rpc: 'https://1rpc.io/linea', scan: 'https://lineascan.build', token: 'ETH',
  },
  {
    chain: 'MANTA', rpc: 'https://1rpc.io/manta', scan: 'https://pacific-explorer.manta.network/', token: 'ETH',
  },
  {
    chain: 'ZORA', rpc: 'https://rpc.zora.energy', scan: 'https://explorer.zora.energy/', token: 'ETH',
  },
  {
    chain: 'ZKF', rpc: 'https://rpc.zkfair.io', scan: 'https://scan.zkfair.io', token: 'USDC',
  },
  {
    chain: 'BSC', rpc: 'https://rpc.ankr.com/bsc', scan: 'https://bscscan.com', token: 'BNB',
  },
  {
    chain: 'POLYGON', rpc: 'https://rpc.ankr.com/polygon', scan: 'https://polygonscan.com', token: 'MATIC',
  },
  {
    chain: 'AVAXC', rpc: 'https://avalanche.public-rpc.com', scan: 'https://snowtrace.io', token: 'AVAX',
  },
  {
    chain: 'FTM', rpc: 'https://rpc.ankr.com/fantom', scan: 'https://ftmscan.com', token: 'FTM',
  },
  {
    chain: 'CORE', rpc: 'https://rpc.coredao.org', scan: 'https://scan.coredao.org', token: 'CORE',
  },
  {
    chain: 'METIS', rpc: 'https://andromeda.metis.io/?owner=1088', scan: 'https://andromeda-explorer.metis.io', token: 'METIS',
  },
  {
    chain: 'GNOSIS', rpc: 'https://rpc.ankr.com/gnosis', scan: 'https://gnosisscan.io', token: 'XDAI',
  },
  {
    chain: 'CELO', rpc: 'https://rpc.ankr.com/celo', scan: 'https://celoscan.io', token: 'CELO',
  },
  {
    chain: 'HARMONY', rpc: 'https://rpc.ankr.com/harmony', scan: 'https://explorer.harmony.one', token: 'ONE',
  },
];

const LZ_CHAIN_IDS = {
  BSC: 102,
  AVAX: 106,
  APTOS: 30108,
  POLYGON: 109,
  ARBITRUM: 30110,
  DFK: 30115,
  FANTOM: 30112,
  OPTIMISM: 30111,
  METIS: 30151,
  HARMONY: 30116,
  COREDAO: 30153,
  GNOSIS: 30145,
  CELO: 30125,
  MOONRIVER: 30167,
  MOONBEAM: 30126,
  KAVA: 30177,
  DEXALOT: 30118,
  FUSE: 30138,
  KLAYTN: 150,
  CANTO: 30159,
  TENET: 30173,
  NOVA: 30175,
  METER: 30176,
  SEPOLIA: 40161,
  MANTLE: 30181,
  BASE: 30184,
  LINEA: 30183,
  CONFLUX: 30212,
  ASTAR: 30210,
  LOOT: 30197,
  SCROLL: 30214,
  MANTA: 30217,
  TOMO: 30196,
  OPBNB: 30202,
  ORDERLY: 30213,
  HORIZEN: 30215,
  XPLA: 30216,
  BEAM: 30198,
};

const USDV_TOKEN_ADDRESS = {
  BSC: '0x323665443cef804a3b5206103304bd4872ea4253',
  POLYGON: '0x323665443cef804a3b5206103304bd4872ea4253',
  AVAX: '0x323665443CEf804A3b5206103304BD4872EA4253',
};

const STARGATE_CONTRACTS = {
  COMMON_BRIDGE: '0x45A01E4e04F14f7A4a6702c74187c5F6222033cd',
  FANTOM_BRIDGE: '0xaf5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6',
  BSC_BRIDGE: '0x4a364f8c717cAAD9A442737Eb7b8A55cc6cf18D8',
  METIS_BRIDGE: '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590',
  OPTIMISM_BRIDGE: '0xB0D502E938ed5f4df2E681fE6E419ff29631d62b',
  ARBITRUM_BRIDGE: '0x53bf833a5d6c4dda888f69c22c88c9f356a41614',
  ZKSYNC_BRIDGE: '0xDAc7479e5F7c01CC59bbF7c1C4EDF5604ADA1FF2',
  BASE_STARGATE_ROUTER_CONTRACT: '0x45f1A95A4D3f3836523F5c83673c797f4d4d263B',
  LINEA_STARGATE_ROUTER_CONTRACT: '0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590',
  KAVA_STARGATE_ROUTER_CONTRACT: '0x83c30eb8bc9ad7C56532895840039E62659896ea',
};

const ETH_STARGATE_BRIDGE_CONTRACT = {
  ARBITRUM: '0xbf22f0f184bCcbeA268dF387a49fF5238dD23E40',
  OPTIMISM: '0xB49c4e680174E331CB0A7fF3Ab58afC9738d5F8b',
  BASE: '0x50b6ebc2103bfec165949cc946d739d5650d7ae4',
  LINEA: '0x8731d54e9d02c286767d56ac03e8037c07e01e98',
};

const NATIVE_TOKEN = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

module.exports = {
  RPCS,
  NATIVE_TOKEN,
  LZ_CHAIN_IDS,
  USDV_TOKEN_ADDRESS,
  STARGATE_CONTRACTS,
  ETH_STARGATE_BRIDGE_CONTRACT,
};
