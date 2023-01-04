import { Collapse, Table } from 'antd';
import { useState, useEffect } from 'react';
import { FormattedAddress, FormattedValue } from './Utils';
import useGlobal from '../stores/useGlobal';

const { Panel } = Collapse;

const LatestBlocks = () => {
  const { blockNumber: lastBlock, latestBlocks, setLatestBlocks } = useGlobal();

  useEffect(() => {
    if (lastBlock) {
      setLatestBlocks(Array.from({ length: 10 }, (_, i) => lastBlock - i));
    }
  }, [lastBlock]);

  return (
    <div>
      <h1>Last blocks</h1>
      <Collapse accordion>
        {latestBlocks.map((blockNumber) => (
          <Panel header={`Block ${blockNumber}`} key={blockNumber}>
            <BlockPanel blockNumber={blockNumber} />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

const BlockPanel = ({ blockNumber }) => {
  const [blockInfo, setBlockInfo] = useState({});
  const [fetched, setFetched] = useState(false);
  const { alchemy } = useGlobal();

  const getBlockInfo = async (blockNumber) => {
    const data = await alchemy.core.getBlockWithTransactions(blockNumber);
    let info = {};

    // Gas
    info.gasUsed = data.gasUsed.toString();
    info.gasLimit = data.gasLimit.toString();
    info.gasUsedPercent = (info.gasUsed / info.gasLimit) * 100;
    const baseFee = data.baseFeePerGas.toString();
    info.baseFee = (baseFee / 1000000000).toFixed();
    // Date
    const date = new Date(data.timestamp * 1000);
    info.date = date.toLocaleString();
    // Miner
    info.miner = data.miner;
    // Transactions
    info.transactions = data.transactions;

    setBlockInfo(info);
    setFetched(true);
  };

  useEffect(() => {
    if (blockNumber) {
      getBlockInfo(blockNumber);
    }
  }, [blockNumber]);

  if (!fetched) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>
        <strong>Date:</strong> {blockInfo.date}
      </p>
      <p>
        <strong>Miner:</strong> <FormattedAddress address={blockInfo.miner} />
      </p>
      <h3>Gas</h3>
      <p>
        <strong>Used:</strong> {blockInfo.gasUsed} / {blockInfo.gasLimit} (
        {blockInfo.gasUsedPercent.toFixed(2)}%)
      </p>
      <p>
        <strong>Base Fee:</strong> {blockInfo.baseFee} Gwei
      </p>
      <h3>Transactions ({blockInfo.transactions.length})</h3>
      <TransactionsList transactions={blockInfo.transactions} />
    </div>
  );
};

const TransactionsList = ({ transactions }) => {
  const columns = [
    {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const data = transactions.map((transaction) => {
    return {
      key: transaction.hash,
      hash: <FormattedAddress address={transaction.hash} type='hash' />,
      from: <FormattedAddress address={transaction.from} />,
      to: <FormattedAddress address={transaction.to} />,
      value: <FormattedValue value={transaction.value} />,
    };
  });

  return <Table columns={columns} dataSource={data} />;
};

export default LatestBlocks;
