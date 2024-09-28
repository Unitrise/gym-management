import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import apiService from '../../../services/ApiService';

interface RegisterFormProps {
  onRegisterSuccess: () => void; // Callback function to close the modal on successful registration
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onFinish = async (values: any) => {
    try {
      const response = await apiService.post<any>('/users', values);
      if ('data' in response) {
        setSuccess(true);
        setError('');
        onRegisterSuccess(); // Close the modal on successful registration
      } else {
        setError(response.message || 'Registration failed');
        setSuccess(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setSuccess(false);
    }
  };

  return (
    <div>
      {error && <Alert message={error} type="error" showIcon />}
      {success && <Alert message="User registered successfully!" type="success" showIcon />}
      <Form onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="Role" name="role" rules={[{ required: true }]}>
          <Input placeholder="admin or staff" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;
