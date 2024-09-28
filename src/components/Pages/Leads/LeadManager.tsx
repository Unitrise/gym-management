// LeadManager.tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import apiService from '../../../services/ApiService'; // Placeholder for API interaction
import dayjs from 'dayjs';

const LeadManager: React.FC = () => {
  const [leads, setLeads] = useState([]);  // Stores lead data
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [form] = Form.useForm();

  // Fetch leads from API on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response:any = await apiService.get('/leads');
      setLeads(response.data);
    } catch (error) {
      message.error('Failed to fetch leads.');
    }
  };

  // Add/Edit lead
  const handleSaveLead = async (values: any) => {
    try {
      if (selectedLead) {
        await apiService.put(`/leads/${selectedLead._id}`, values);
        message.success('Lead updated successfully.');
      } else {
        await apiService.post('/leads', values);
        message.success('Lead added successfully.');
      }
      fetchLeads();  // Refresh leads after adding
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save lead.');
    }
  };

  // Edit lead
  const handleEditLead = (lead: any) => {
    setSelectedLead(lead);
    form.setFieldsValue({
      ...lead,
      interactionDate: dayjs(lead.interactionDate),
    });
    setIsModalVisible(true);
  };

  // Table columns
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_:any, lead:any) => (
        <Button onClick={() => handleEditLead(lead)}>Edit</Button>
      ),
    },
  ];

  return (
    <div>
      <h2>Lead Management</h2>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Add New Lead
      </Button>
      <Table columns={columns} dataSource={leads} rowKey="_id" />

      {/* Modal for adding/editing leads */}
      <Modal
        title={selectedLead ? 'Edit Lead' : 'Add Lead'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSaveLead} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {selectedLead ? 'Update Lead' : 'Add Lead'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default LeadManager;
