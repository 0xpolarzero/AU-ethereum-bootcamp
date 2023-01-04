import { Popover } from 'antd';
import useGlobal from '../stores/useGlobal';

export const FormattedAddress = ({ address, type = 'account' }) => {
  const { setAddress, setIsAccountModalOpen } = useGlobal();

  const openAccountInfo = () => {
    if (type !== 'account') return;
    setAddress(address);
    setIsAccountModalOpen(true);
  };

  return (
    <Popover content={address}>
      <span
        className={type === 'account' ? 'link' : ''}
        onClick={openAccountInfo}
      >
        {address.slice(0, 6)}...{address.slice(-4)}
      </span>
    </Popover>
  );
};

export const FormattedValue = ({ value }) => {
  const formatted = value.toString() / 1000000000000000000;
  const rounded = Number(formatted.toFixed(4));

  return (
    <Popover content={`${formatted.toString()} ETH`}>
      <span>{rounded} ETH</span>
    </Popover>
  );
};
