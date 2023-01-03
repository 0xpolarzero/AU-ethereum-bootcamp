import { generateSignature } from './helpers';
import { useState } from 'react';
import server from './server';

function Transfer({ address, setBalance, privateKey, setPrivateKey }) {
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const transfer = async (e) => {
    e.preventDefault();

    try {
      const { signatureHex: signature, recoveryBit } = await generateSignature(
        sendAmount + recipient,
        privateKey,
      );

      const {
        data: { sender, balance },
      } = await server.post(`send`, {
        signature,
        recoveryBit,
        amount: parseInt(sendAmount),
        recipient,
      });
      setBalance(balance);
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
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder='Type an address, for example: 0x2'
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type='submit' className='button' value='Transfer' />
    </form>
  );
}

export default Transfer;
