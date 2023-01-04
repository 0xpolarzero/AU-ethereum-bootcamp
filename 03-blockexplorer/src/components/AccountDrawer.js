import { Drawer } from 'antd';
import { useEffect, useState } from 'react';
import { FormattedValue } from './Utils';
import useGlobal from '../stores/useGlobal';

const AccountDrawer = () => {
  const [balance, setBalance] = useState(0);
  const [isError, setIsError] = useState(false);

  const {
    alchemy,
    address,
    setAddress,
    isAccountModalOpen,
    setIsAccountModalOpen,
  } = useGlobal();

  const getBalance = async () => {
    try {
      const bal = await alchemy.core.getBalance(address);
      setBalance(bal.toString());
    } catch (err) {
      setIsError(true);
      console.log(err);
    }
  };

  const onClose = () => {
    setIsAccountModalOpen(false);
    setAddress('');
    setBalance(0);
    setIsError(false);
  };

  useEffect(() => {
    if (address) {
      getBalance();
    }
  }, [address]);

  return (
    <Drawer
      title='Account Info'
      placement='left'
      onClose={onClose}
      open={isAccountModalOpen}
      width={600}
    >
      <div>
        <h3>Address</h3>
        <p>{address}</p>
        {isError ? (
          <div className='error'>
            Address not found. Are you sure this is a valid Ethereum address?
          </div>
        ) : (
          <>
            <h3>Balance</h3>
            <p>
              <FormattedValue value={balance} />
            </p>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default AccountDrawer;
