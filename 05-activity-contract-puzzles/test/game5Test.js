const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    const signer = await ethers.provider.getSigner(0);

    return { game, signer };
  }
  it('should be a winner', async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);

    const treshold = '0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf';
    const tresholdBytes = ethers.utils.arrayify(treshold);

    let isMatch = false;

    try {
      while (!isMatch) {
        // Create a wallet
        const wallet = ethers.Wallet.createRandom().connect(signer.provider);
        const address = wallet.address;
        const addressBytes = ethers.utils.arrayify(address);

        // Send it some funds
        await signer.sendTransaction({
          to: address,
          value: ethers.utils.parseEther('1.0'),
        });

        // If it can win, call the contract
        if (addressBytes < tresholdBytes) {
          await game.connect(wallet).win();
          isMatch = true;
        }
      }
    } catch (err) {
      console.log(err);
    }

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
