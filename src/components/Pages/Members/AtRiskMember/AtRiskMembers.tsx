import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import apiService from '../../../../services/ApiService';
import dayjs from 'dayjs';

const AtRiskMembers = () => {
  const [atRiskMembers, setAtRiskMembers] = useState([]);

  useEffect(() => {
    fetchAtRiskMembers();
  }, []);

  const fetchAtRiskMembers = async () => {
    try {
      const response: any = await apiService.get('/members');
      const today = dayjs();
      
      const atRisk = response.data.filter((member: any) => {
        const lastCheckIn = member.attendance.lastCheckIn ? dayjs(member.attendance.lastCheckIn) : null;
        return lastCheckIn && today.diff(lastCheckIn, 'day') > 20;
      });
      
      setAtRiskMembers(atRisk);
    } catch (error) {
      console.error('Error fetching at-risk members:', error);
      message.error('Failed to fetch at-risk members.');
    }
  };

  const callMember = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const sendReminder = (memberId: string) => {
    message.success(`Reminder sent to member with ID: ${memberId}`);
    // Future enhancement: API integration to send SMS/email reminders
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => (
        <Button onClick={() => callMember(phone)} type="link">
          {phone}
        </Button>
      ),
    },
    {
      title: 'Last Check-In',
      dataIndex: 'attendance',
      key: 'lastCheckIn',
      render: (attendance: any) =>
        attendance.lastCheckIn ? dayjs(attendance.lastCheckIn).format('YYYY-MM-DD') : 'No Check-Ins',
    },
    {
      title: 'Membership Status',
      dataIndex: 'membership',
      key: 'membershipStatus',
      render: (membership: any) => membership.status,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <>
          <Button onClick={() => callMember(record.phone)}>Call</Button>
          <Button onClick={() => sendReminder(record._id)} style={{ marginLeft: '10px' }}>
            Send Reminder
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>At-Risk Members (No Attendance for Over 20 Days)</h2>
      <Table columns={columns} dataSource={atRiskMembers} rowKey="_id" />
    </div>
  );
};

export default AtRiskMembers;
