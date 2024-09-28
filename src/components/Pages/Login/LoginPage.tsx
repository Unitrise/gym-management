import React, { useState } from 'react';
import { Form, Input, Button, Alert, Modal } from 'antd';
import useAuthStore from '../../../store/authStore';
import apiService from '../../../services/ApiService';
import RegisterForm from './RegisterForm';

const LoginPage: React.FC = () => {
  const [error, setError] = useState<any>('');
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const { login } = useAuthStore();

  // Handle login form submission
  const onFinish = async (values: any) => {
    try {
      // Call your API to authenticate the user and retrieve the token
      const response:any = await apiService.post<any>('/auth/login', values);
      console.log('Response from login API:', response);  // Debug: log the full response

      // Check if a token is present in the response
      if (response.data && response.data.token) {
        login(response.data.token);  // Pass the token to the login function in the store
        setError(null);  // Clear any previous errors
      } else {
        setError('Login failed. No token received.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred during login.');
    }
  };

  // Open the registration modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Close the registration modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <Alert message={error} type="error" showIcon />}
      <Form onFinish={onFinish}>
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>

      <Button type="link" onClick={showModal}>
        Don't have an account? Register
      </Button>

      {/* Register Modal */}
      <Modal
        title="Register"
        open={isModalVisible}
        footer={null} // No footer buttons
        onCancel={handleCancel}
      >
        <RegisterForm onRegisterSuccess={handleCancel} />
      </Modal>
    </div>
  );
};

export default LoginPage;
