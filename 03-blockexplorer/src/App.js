import { useEffect } from 'react';
import LatestBlocks from './components/LatestBlocks';
import AccountDrawer from './components/AccountDrawer';
import useGlobal from './stores/useGlobal';
import './App.css';
import SearchBar from './components/SearchBar';

function App() {
  const { alchemy, setBlockNumber } = useGlobal();

  const getBlockNumber = async () => {
    setBlockNumber(await alchemy.core.getBlockNumber());
  };

  useEffect(() => {
    getBlockNumber();
  }, []);

  return (
    <div className='App'>
      <LatestBlocks />
      <AccountDrawer />
      <SearchBar />
    </div>
  );
}

export default App;
