require('@nomiclabs/hardhat-waffle');
require('hardhat-deploy');
require('dotenv').config();

const { PRIVATE_KEY, GOERLI_RPC_URL } = process.env;

module.exports = {
  solidity: '0.8.17',
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
