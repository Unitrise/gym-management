import React from 'react';
import { Form, Input, Button } from 'antd';
import apiService from '../../../../services/ApiService';

const LeadCapture: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      await apiService.post('/leads', values);
      form.resetFields();
    } catch (error) {
      console.error('Error adding lead', error);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label="Name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button  htmlType="submit">
          Add Lead
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LeadCapture;
