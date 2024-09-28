import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Select, List, Switch, Modal, message } from 'antd';
import apiService from '../../../../services/ApiService';

const { Option } = Select;

const LeadAutomations: React.FC = () => {
  const [automations, setAutomations] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      const response:any = await apiService.get('/automations');
      setAutomations(response.data);
    } catch (error) {
      console.error('Error fetching automations', error);
    }
  };

  const handleCreateAutomation = async (values: any) => {
    try {
      await apiService.post('/automations', values);
      message.success('Automation created successfully!');
      setIsModalVisible(false);
      form.resetFields();
      fetchAutomations(); // Refresh automations list
    } catch (error) {
      message.error('Failed to create automation.');
    }
  };

  const toggleAutomationStatus = async (automationId: string, isActive: boolean) => {
    try {
      await apiService.put(`/automations/${automationId}/status`, { isActive });
      message.success('Automation status updated.');
      fetchAutomations();
    } catch (error) {
      message.error('Failed to update status.');
    }
  };

  return (
    <div>
      <h2>Lead Automations</h2>

      {/* Button to create a new automation */}
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Create New Automation
      </Button>

      {/* List existing automations */}
      <List
        itemLayout="horizontal"
        dataSource={automations}
        renderItem={(automation) => (
          <Card title={automation.name}>
            <p>Trigger: {automation.trigger}</p>
            <p>Action: {automation.action}</p>
            <Switch
              checked={automation.isActive}
              onChange={(checked) => toggleAutomationStatus(automation._id, checked)}
            />
            <span style={{ marginLeft: '10px' }}>
              {automation.isActive ? 'Active' : 'Inactive'}
            </span>
          </Card>
        )}
      />

      {/* Modal to create a new automation */}
      <Modal
        title="Create New Automation"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateAutomation}>
          <Form.Item label="Automation Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Trigger" name="trigger" rules={[{ required: true }]}>
            <Select placeholder="Select a trigger">
              <Option value="new_lead">New Lead</Option>
              <Option value="trial_class">Trial Class Signup</Option>
              <Option value="no_activity">No Activity for 14 Days</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Action" name="action" rules={[{ required: true }]}>
            <Select placeholder="Select an action">
              <Option value="send_email">Send Email</Option>
              <Option value="send_sms">Send SMS</Option>
              <Option value="assign_task">Assign Task</Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Create Automation
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default LeadAutomations;
