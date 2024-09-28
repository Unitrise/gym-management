import React from 'react';
import { Form, Input, Button, DatePicker, Select, InputNumber, message, Card } from 'antd';
import { Member } from './MemberFormProps';
import apiService from '../../../../services/ApiService';
import './MemberForm.css'; // Import the new CSS file

const { Option } = Select;

const AddMemberForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = async (values: Member) => {
    try {
      await apiService.post('/members', values);
      message.success('Member added successfully!');
      form.resetFields();
    } catch (error) {
      message.error('Failed to add member.');
    }
  };

  return (
    <Card title="Add New Member" className="add-member-form-card">
        <div className='form-scrollable'>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true }]} hasFeedback>
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]} hasFeedback>
          <Input />
        </Form.Item>

        <Form.Item label="Phone" name="phone" rules={[{ required: true }]} hasFeedback>
          <Input />
        </Form.Item>

        <Form.Item label="Address" required>
          <div className="input-group">
            <Form.Item name={['address', 'street']} noStyle rules={[{ required: true }]} hasFeedback>
              <Input placeholder="Street" />
            </Form.Item>
            <Form.Item name={['address', 'city']} noStyle rules={[{ required: true }]} hasFeedback>
              <Input placeholder="City" />
            </Form.Item>
            <Form.Item name={['address', 'state']} noStyle rules={[{ required: true }]} hasFeedback>
              <Input placeholder="State" />
            </Form.Item>
            <Form.Item name={['address', 'postalCode']} noStyle rules={[{ required: true }]} hasFeedback>
              <Input placeholder="Postal Code" />
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item label="Membership Type" name={['membership', 'type']} rules={[{ required: true }]} hasFeedback>
          <Select placeholder="Select a membership type">
            <Option value="Standard">Standard</Option>
            <Option value="Premium">Premium</Option>
            <Option value="VIP">VIP</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Membership Status" name={['membership', 'status']} rules={[{ required: true }]} hasFeedback>
          <Select placeholder="Select membership status">
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Membership Start Date" name={['membership', 'startDate']} rules={[{ required: true }]} hasFeedback>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Membership End Date" name={['membership', 'endDate']} rules={[{ required: true }]} hasFeedback>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Renewal Date" name={['membership', 'renewalDate']}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Fitness Goals" name={['progress', 'fitnessGoals']} hasFeedback>
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Loyalty Points" name={['loyalty', 'points']} rules={[{ type: 'number', min: 0 }]} hasFeedback>
          <InputNumber />
        </Form.Item>

        <Form.Item label="Emergency Contact Name" name={['emergencyContact', 'name']} rules={[{ required: true }]} hasFeedback>
          <Input />
        </Form.Item>

        <Form.Item label="Emergency Contact Phone" name={['emergencyContact', 'phone']} rules={[{ required: true }]} hasFeedback>
          <Input />
        </Form.Item>

        <Form.Item label="Relation to Emergency Contact" name={['emergencyContact', 'relation']} rules={[{ required: true }]} hasFeedback>
          <Input />
        </Form.Item>
      </Form>
        </div>
        <Button htmlType="submit" onClick={() => form.submit()}>
        Add Member
      </Button>
    </Card>
  );
};

export default AddMemberForm;
