import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Popconfirm, message, Modal } from 'antd';
import apiService from '../../../../services/ApiService';
import LeadEditModal from './LeadEditModal'; // The new modal component

const LeadList: React.FC = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null); // Selected lead for editing
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // For opening/closing edit modal

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response: any = await apiService.get('/leads');
      setLeads(response.data);
    } catch (error) {
      message.error('Error fetching leads');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.delete(`/leads/${id}`);
      message.success('Lead deleted successfully');
      fetchLeads();
    } catch (error) {
      message.error('Failed to delete lead');
    }
  };

  const handleEditLead = (lead: any) => {
    setSelectedLead(lead); // Pass the selected lead to the edit modal
    setIsEditModalVisible(true); // Show the modal
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <>
          <Button type="link" onClick={() => handleEditLead(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure you want to delete this lead?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredLeads = leads?.filter((lead: any) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Input.Search
        placeholder="Search Leads"
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: '16px', width: '300px' }}
      />
      <Table dataSource={filteredLeads} columns={columns} rowKey="_id" />
      
      {/* Lead Edit Modal */}
      <LeadEditModal
        visible={isEditModalVisible}
        lead={selectedLead}
        onClose={() => setIsEditModalVisible(false)}
        refreshLeads={fetchLeads}
      />
    </div>
  );
};

export default LeadList;
