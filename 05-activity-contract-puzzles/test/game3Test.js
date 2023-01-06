const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game3', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game3');
    const game = await Game.deploy();

    // Hardhat will create 10 accounts for you by default
    // you can get one of this accounts with ethers.provider.getSigner
    // and passing in the zero-based indexed of the signer you want:
    const signers = {
      A: ethers.provider.getSigner(0),
      B: ethers.provider.getSigner(1),
      C: ethers.provider.getSigner(2),
    };

    const addresses = {
      A: await signers.A.getAddress(),
      B: await signers.B.getAddress(),
      C: await signers.C.getAddress(),
    };

    return { game, signers, addresses };
  }

  it('should be a winner', async function () {
    const { game, signers, addresses } = await loadFixture(
      deployContractAndSetVariables,
    );

    // you'll need to update the `balances` mapping to win this stage

    // to call a contract as a signer you can use contract.connect
    await game.connect(signers.A).buy({ value: '2' });
    await game.connect(signers.B).buy({ value: '3' });
    await game.connect(signers.C).buy({ value: '1' });

    await game.win(addresses.A, addresses.B, addresses.C);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
