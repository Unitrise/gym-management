import React, { useEffect, useState } from 'react';
import { Table, Button } from 'antd';
import axios from 'axios';
import apiService from '../../../services/ApiService';

const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState([]);


  const getContracts = async () => {
    const response:any = await apiService.get('/api/contracts')
    return response.data;
  }

  useEffect(() => {
    const checkAuth = async () => {
    const response = getContracts()
    if (response) {
        setContracts(await response)
    }else {
        console.error('Error fetching contracts')
    }
    }
    checkAuth()
  }, []);

  const columns = [
    { title: 'Contract Details', dataIndex: 'contractDetails', key: 'contractDetails' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
    {
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Button>Edit</Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Contracts</h1>
      <Table columns={columns} dataSource={contracts} rowKey="id" />
    </div>
  );
};

export default ContractsPage;
