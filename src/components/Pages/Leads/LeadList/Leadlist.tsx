import React, { useEffect, useState } from 'react';
import { Table, Button, Input } from 'antd';
import apiService from '../../../../services/ApiService';

const LeadList: React.FC = () => {
  const [leads, setLeads] = useState([]);
  
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const response:any = await apiService.get('/leads');
    setLeads(response.data);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Actions', key: 'actions', render: () => <Button>Edit</Button> },
  ];

  return (
    <div>
      <Input.Search placeholder="Search Leads" onSearch={(value) => console.log(value)} style={{ marginBottom: '16px' }} />
      <Table dataSource={leads} columns={columns} rowKey="_id" />
    </div>
  );
};

export default LeadList;
