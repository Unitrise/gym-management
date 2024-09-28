import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, Alert, Card, Table } from 'antd';
import { Member } from '../MemberForm/MemberFormProps';
import apiService from '../../../../services/ApiService';
import './MemberProfile.css';
import { ExcludedMemberFields } from './MemberProfileProps';

interface MemberProfileProps {
    member: Member | null;
    onClose: () => void;
}

const MemberProfile: React.FC<MemberProfileProps> = ({ member, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const excludedFields = new Object(ExcludedMemberFields);

    useEffect(() => {
        if (member) {
            setVisible(true);
            form.setFieldsValue(member); // Populate the form with the selected member's details
        } else {
            setVisible(false);
        }
    }, [member, form]);

    const handleEdit = () => {
        setIsEditing(true);
        form.setFieldsValue(member); // Populate form with member details
    };

    const handleSave = async (values: any) => {
        try {
            await apiService.put(`/members/${member?._id}`, values);
            setIsEditing(false);
            setVisible(false);
            onClose(); // Close modal after saving
        } catch (error) {
            console.error('Failed to update member', error);
        }
    };

    const renderObjectFields = (obj: any, parentKey: string = '') => {
        return Object.entries(obj).map(([key, value]) => {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Recursively render nested objects
                return (
                    <div key={fullKey} style={{ marginBottom: '12px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#bfbfbf' }}>{key.toUpperCase()}:</span>
                        <div style={{ paddingLeft: '16px' }}>
                            {renderObjectFields(value, fullKey)} {/* Recursion for nested object */}
                        </div>
                    </div>
                );
            } else {
                // Render primitive values
                return (
                    <p key={fullKey} style={{ marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#bfbfbf' }}>{key.toUpperCase()}: </span>
                        <span style={{ fontSize: '16px', color: '#ffffff' }}>{value as any}</span>
                    </p>
                );
            }
        });
    };

    if (!member) {
        return <Alert message="No member selected" type="info" />;
    }

    return (
        <Modal
            open={visible}
            onCancel={() => {
                setVisible(false);
                setIsEditing(false);
                onClose();
            }}
            footer={null}
        >
            <Card>
                <h2>{isEditing ? 'Edit Profile' : `${member.name}'s Profile`}</h2>
                {!isEditing ? (
                    <div className='member-details-container'>
                        {/* Iterate over fields dynamically */}
                        {Object.entries(member).map(([key, value]) => {
                            if (excludedFields.hasOwnProperty(key)) return null; // Skip excluded fields
                            return (
                                <div key={key}>
                                    <strong>{key.toUpperCase()}:</strong>
                                    {typeof value === 'object' && value !== null ? (
                                        <div style={{ paddingLeft: '16px' }}>
                                            {renderObjectFields(value, key)} {/* Render nested objects */}
                                        </div>
                                    ) : (
                                        <span> {value}</span>
                                    )}
                                </div>
                            );
                        })}
                        <Table dataSource={[]} columns={[{ title: 'Date', dataIndex: 'date' }, { title: 'Amount', dataIndex: 'amount' }]} />
                    </div>
                ) : (
                    <Form form={form} onFinish={handleSave} layout="vertical">
                        <Form.Item label="Name" name="name">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Email" name="email">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Phone" name="phone">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Address" name={['address', 'street']}>
                            <Input placeholder="Street" />
                        </Form.Item>
                        <Form.Item name={['address', 'city']}>
                            <Input placeholder="City" />
                        </Form.Item>
                        <Form.Item name={['address', 'state']}>
                            <Input placeholder="State" />
                        </Form.Item>
                        <Form.Item name={['address', 'postalCode']}>
                            <Input placeholder="Postal Code" />
                        </Form.Item>
                        <Form.Item label="Membership Type" name={['membership', 'type']}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Membership Status" name={['membership', 'status']}>
                            <Input />
                        </Form.Item>
                        <Button  htmlType="submit">
                            Save
                        </Button>
                    </Form>
                )}
                <Button onClick={handleEdit} type="primary" style={{ marginTop: '16px' }}>
                    Edit
                </Button>
            </Card>
        </Modal>
    );
};

export default MemberProfile;
