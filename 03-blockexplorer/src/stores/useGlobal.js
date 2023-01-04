import create from 'zustand';
import { Alchemy, Network } from 'alchemy-sdk';

export default create((set) => ({
  // Provider
  alchemy: new Alchemy({
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  }),

  // Block
  blockNumber: null,
  setBlockNumber: (blockNumber) => set({ blockNumber }),
  latestBlocks: [],
  setLatestBlocks: (latestBlocks) => set({ latestBlocks }),

  // Address
  address: null,
  setAddress: (address) => set({ address }),
  isAccountModalOpen: false,
  setIsAccountModalOpen: (isAccountModalOpen) => set({ isAccountModalOpen }),
}));
