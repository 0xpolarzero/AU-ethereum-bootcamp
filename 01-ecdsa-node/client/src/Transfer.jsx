import { generateSignature } from './helpers';
import { useState } from 'react';
import server from './server';

function Transfer({ address, setBalance, privateKey, setPrivateKey }) {
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const transfer = async (e) => {
    e.preventDefault();

    try {
      const { signatureHex: signature, recoveryBit } = await generateSignature(
        [recipient, sendAmount],
        privateKey,
      );

      const {
        data: { sender, balance },
      } = await server.post(`send`, {
        signature,
        recoveryBit,
        amount: Number(sendAmount),
        recipient,
      });
      setBalance(balance);
      console.log(`Transaction sent from ${sender} to ${recipient}`);

      setSendAmount('');
      setRecipient('');
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form className='container transfer' onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder='1, 2, 3...'
          value={sendAmount}
          onChange={(e) => setSendAmount(e.target.value)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder='Type an address, for example: 0x2'
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        ></input>
      </label>

      <input type='submit' className='button' value='Transfer' />
    </form>
  );
}

export default Transfer;
