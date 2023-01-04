import Wallet from './Wallet';
import Transfer from './Transfer';
import './App.scss';
import server from './server';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  const getAccounts = async () => {
    const { data: accounts } = await server.get('accounts');
    return accounts;
  };

  useEffect(() => {
    getAccounts().then((accounts) => {
      console.table(accounts);
    });
  });

  return (
    <div className='app'>
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />
      <Transfer
        address={address}
        setBalance={setBalance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />
    </div>
  );
}

export default App;
