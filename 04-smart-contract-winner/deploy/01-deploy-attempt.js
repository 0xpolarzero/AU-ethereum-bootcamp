const { ethers } = require('hardhat');
const { TARGET_CONTRACT } = require('../helper-hardhat-config');

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const attempt = await deploy('Attempt', {
    from: deployer,
    args: [TARGET_CONTRACT],
    log: true,
  });

  const attemptContract = await ethers.getContractAt(
    'Attempt',
    attempt.address,
  );
  console.log('Calling attempt()...');
  const tx = await attemptContract.attempt();
  console.log('attempt() called. Waiting for tx to be mined...');
  await tx.wait(1);
  console.log('attempt() tx mined.');
};

module.exports.tags = ['all', 'attempt', 'main'];
