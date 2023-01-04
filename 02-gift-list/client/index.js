const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

async function main() {
  // Create a Merkle tree from the nice list
  const tree = new MerkleTree(niceList);

  // Get a proof for a given name
  const name = 'Susan Goodwin';
  const index = niceList.indexOf(name);
  const proof = tree.getProof(index);

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    name,
    proof,
  });

  console.log({ gift });
}

main();
