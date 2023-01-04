import { Input } from 'antd';
import useGlobal from '../stores/useGlobal';

const { Search } = Input;

const SearchBar = () => {
  const { setIsAccountModalOpen, setAddress } = useGlobal();
  const onSearch = (value) => {
    setAddress(value);
    setIsAccountModalOpen(true);
  };

  return (
    <div className='searchbar'>
      <Search
        placeholder='lookup address'
        allowClear
        size='large'
        onSearch={onSearch}
      />
    </div>
  );
};

export default SearchBar;
