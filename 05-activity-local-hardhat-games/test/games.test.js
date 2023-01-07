const { assert, expect } = require('chai');
const { deployments, ethers } = require('hardhat');

describe('Games', function () {
  let game1;
  let game2;
  let game3;
  let game4;
  let game5;

  before(async () => {
    await deployments.fixture('main');
    game1 = await ethers.getContract('Game1');
    game2 = await ethers.getContract('Game2');
    game3 = await ethers.getContract('Game3');
    game4 = await ethers.getContract('Game4');
    game5 = await ethers.getContract('Game5');
  });

  describe('Game1', function () {
    it('should be a winner', async () => {
      await expect(game1.win()).to.emit(game1, 'Winner');
    });
  });

  describe('Game2', function () {
    it('should be a winner', async () => {
      await game2.setX(25);
      await game2.setY(25);

      await expect(game2.win()).to.emit(game2, 'Winner');
    });
  });

  describe('Game3', function () {
    it('should be a winner', async () => {
      await expect(game3.win(45)).to.emit(game3, 'Winner');
    });
  });

  describe('Game4', function () {
    it('should be a winner', async () => {
      // unchecked will allow overflowing (-128 to 127)
      await expect(game4.win(56)).to.emit(game4, 'Winner');
    });
  });

  describe('Game5', function () {
    it('should be a winner', async () => {
      await game5.giveMeAllowance(10000);
      await game5.mint(10000);

      await expect(game5.win()).to.emit(game5, 'Winner');
    });
  });
});
