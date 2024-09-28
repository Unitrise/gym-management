import React, { useState, useEffect } from 'react';
import { List, Card, Button, Form, Input, Modal, message } from 'antd';
import apiService from '../../../../services/ApiService';

const LeadCommunication: React.FC = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response:any = await apiService.get('/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads', error);
    }
  };

  const openCommunicationModal = (lead: any) => {
    setSelectedLead(lead);
    setIsModalVisible(true);
  };

  const handleSendMessage = async (values: any) => {
    try {
      const payload = {
        ...values,
        leadId: selectedLead._id,
        timestamp: new Date().toISOString(),
      };
      await apiService.post('/leads/send-message', payload);
      message.success('Message sent successfully!');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to send message');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Lead Communication</h2>
      <List
        dataSource={leads}
        renderItem={(lead: any) => (
          <Card title={lead.name}>
            <p>Email: {lead.email}</p>
            <Button onClick={() => openCommunicationModal(lead)}>Send Message</Button>
          </Card>
        )}
      />

      {/* Communication Modal */}
      <Modal
        title={`Send Message to ${selectedLead?.name}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSendMessage}>
          <Form.Item name="message" label="Message" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">
              Send
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeadCommunication;
