module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const params = {
    from: deployer,
    args: [],
    log: true,
  };

  await deploy('Game1', params);
  await deploy('Game2', params);
  await deploy('Game3', params);
  await deploy('Game4', params);
  await deploy('Game5', params);
};

module.exports.tags = ['all', 'games', 'main'];
