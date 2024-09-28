import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';

const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    axios.get('/api/inventory')
      .then((response) => setInventory(response.data))
      .catch((error) => console.error(error));
  }, []);

  const columns = [
    { title: 'Item Name', dataIndex: 'itemName', key: 'itemName' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Last Restock', dataIndex: 'lastRestock', key: 'lastRestock' },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Button >Edit</Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Inventory</h1>
      <Table columns={columns} dataSource={inventory} rowKey="id" />
    </div>
  );
};

export default InventoryPage;
