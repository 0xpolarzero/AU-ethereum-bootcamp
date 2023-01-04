const secp = require('ethereum-cryptography/secp256k1');
const { keccak256 } = require('ethereum-cryptography/keccak');
const { toHex } = require('ethereum-cryptography/utils');
const accounts = require('./mock-data');

const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

app.use(cors());
app.use(express.json());

/**
 * Balances
 */

const balances = {};
accounts.forEach((account) => {
  balances[account.address] = account.balance;
});

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;

  res.send({ balance });
});

/**
 * Accounts
 */

app.get('/accounts', (req, res) => {
  const accs = accounts.map((account) => {
    return {
      address: account.address,
      privateKey: account.privateKey,
      balance: balances[account.address] || 0,
    };
  });

  res.send(accs);
});

/**
 * Transactions
 */

app.post('/send', (req, res) => {
  try {
    const { signature, recoveryBit, amount, recipient } = req.body;

    // Hash message
    const msgUint8Array = Uint8Array.from([recipient, amount]);
    const msgHash = toHex(msgUint8Array);

    // Recover public key
    const publicKey = secp.recoverPublicKey(msgHash, signature, recoveryBit);

    // Get address from public key
    const senderAddress = `0x${toHex(keccak256(publicKey)).slice(-40)}`;

    // Verify signature
    const isVerified = secp.verify(signature, msgHash, toHex(publicKey));

    // Init balances
    setInitialBalance(senderAddress);
    setInitialBalance(recipient);

    if (!isVerified) {
      res.status(400).send({ message: 'Invalid signature!' });
    } else if (balances[senderAddress] < amount) {
      res.status(400).send({ message: 'Not enough funds!' });
    } else {
      balances[senderAddress] -= amount;
      balances[recipient] += amount;

      res.send({ sender: senderAddress, balance: balances[senderAddress] });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
