import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, List, message } from 'antd';
import LeadNotes from '../LeadNotes/LeadNotes';
import apiService from '../../../../services/ApiService';

interface Note {
  _id: string;
  message: string;
  createdAt: string;
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface LeadEditModalProps {
  visible: boolean;
  lead: Lead | null;
  onClose: () => void;
  refreshLeads: () => void;
}

const LeadEditModal: React.FC<LeadEditModalProps> = ({ visible, lead, onClose, refreshLeads }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (lead) {
      form.setFieldsValue(lead); // Set form fields to lead details when modal opens
    }
  }, [lead, form]);

  const handleSave = async (values: Lead) => {
    try {
      if (lead) {
        await apiService.put(`/leads/${lead._id}`, values);
        message.success('Lead updated successfully');
        refreshLeads(); // Refresh the lead list
        onClose(); // Close modal after saving
      }
    } catch (error) {
      message.error('Failed to update lead');
    }
  };

  return (
    <Modal
      title="Edit Lead"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSave} layout="vertical">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit">Save</Button>
      </Form>

      <h3 style={{ marginTop: '24px' }}>Notes</h3>
      {/* Include LeadNotes component and pass the lead's ID */}
      {lead && <LeadNotes leadId={lead._id} />}
    </Modal>
  );
};

export default LeadEditModal;
