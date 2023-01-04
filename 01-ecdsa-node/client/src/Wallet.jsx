import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { toHex } from 'ethereum-cryptography/utils';
import { useEffect } from 'react';

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  const onChange = async (e) => {
    const pvtKey = e.target.value;
    if (!pvtKey) return;

    setPrivateKey(pvtKey);
    const publicKey = secp.getPublicKey(pvtKey);
    const publicKeyHash = toHex(keccak256(publicKey));

    // Retrieve the public address
    setAddress(`0x${publicKeyHash.slice(-40)}`);
  };

  const getBalance = async () => {
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  };

  useEffect(() => {
    if (!address) return;
    getBalance();
  }, [address]);

  return (
    <div className='container wallet'>
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input
          placeholder='Type your private key'
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div className='address'>Address: {address}</div>
      <div className='balance'>Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
