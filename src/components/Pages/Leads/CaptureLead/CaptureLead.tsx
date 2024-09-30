import React from 'react';
import { Form, Input, Button, Select, Radio, message } from 'antd';
import apiService from '../../../../services/ApiService';

const { Option } = Select;

const LeadCapture: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      await apiService.post('/leads', values);
      form.resetFields();
      message.success('Lead added successfully!');
    } catch (error) {
      message.error('Error adding lead');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {/* Name */}
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the lead\'s name' }]}>
        <Input placeholder="Enter lead's name" />
      </Form.Item>

      {/* Email */}
      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email address' }]}>
        <Input placeholder="Enter lead's email" />
      </Form.Item>

      {/* Phone */}
      <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please enter the phone number' }]}>
        <Input placeholder="Enter phone number" />
      </Form.Item>

      {/* Contact Method */}
      <Form.Item label="Preferred Contact Method" name="contactMethod" rules={[{ required: true, message: 'Please select a contact method' }]}>
        <Select placeholder="Select contact method">
          <Option value="Phone">Phone</Option>
          <Option value="Email">Email</Option>
          <Option value="In-Person">In-Person</Option>
        </Select>
      </Form.Item>

      {/* Interest */}
      <Form.Item label="Area of Interest" name="interest" rules={[{ required: true, message: 'Please specify the interest area' }]}>
        <Input placeholder="Enter area of interest (e.g., Gym Membership)" />
      </Form.Item>

      {/* Status */}
      <Form.Item label="Lead Status" name="status" rules={[{ required: true, message: 'Please select the status of the lead' }]}>
        <Select placeholder="Select lead status">
          <Option value="new">New</Option>
          <Option value="in-progress">In Progress</Option>
          <Option value="closed">Closed</Option>
        </Select>
      </Form.Item>

      {/* Submit */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Lead
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LeadCapture;
