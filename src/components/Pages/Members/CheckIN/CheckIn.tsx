import React, { useState, useEffect, useRef } from 'react';
import { Table, Form, Input, Select, DatePicker, message, Button, Modal, QRCode } from 'antd';
import apiService from '../../../../services/ApiService';
import dayjs from 'dayjs';
import './CheckIn.css';
const { Option } = Select;

const CheckInComponent = () => {
  const [members, setMembers] = useState([]); // All members data
  const [todayCheckIns, setTodayCheckIns] = useState<any[]>([]); // Today's check-ins
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [checkInTime, setCheckInTime] = useState(dayjs());

  const [form] = Form.useForm();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response:any = await apiService.get('/members');
      setMembers(response.data);
      filterTodayCheckIns(response.data); // Filter check-ins for today
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const filterTodayCheckIns = (membersData: any[]) => {
    const today = dayjs().startOf('day');
  
    const checkIns = membersData.filter((member: any) => {
      // Find the last check-in in attendance
      const lastCheckIn = member.attendance.checkIns.length
        ? dayjs(member.attendance.checkIns[member.attendance.checkIns.length - 1].date)
        : null;
      
      // Check if the last check-in is today
      console.log('Last Check-In:', lastCheckIn);
      return lastCheckIn && lastCheckIn.isSame(today, 'day');
    });
  
    setTodayCheckIns(checkIns);
  };



  const handleCheckIn = async (memberId: any, method?:boolean) => {
    const checkInData = {
      date: dayjs(checkInTime).toISOString(),
      method: method ? 'Manual' :'QR' // or 'Manual' based on the check-in method
    };
  
    try {
      // Fetch the specific member by ID
      const response: any = await apiService.get(`/members/${memberId}`);
      const member = response.data;
  
      // Add the new check-in to the attendance array
      member.attendance.checkIns.push(checkInData);
      member.attendance.lastCheckIn = checkInData.date;
      member.attendance.totalCheckIns += 1;
      member.loyalty.points += 10; // Add 10 loyalty points for each check-in
  
      // Send a PUT request to update the member's attendance
      await apiService.put(`/members/${memberId}`, { attendance: member.attendance, loyalty: member.loyalty });
  
      message.success('Check-in successful!');
      setIsModalVisible(false);
      fetchMembers(); // Refresh the members list to update today's check-ins
    } catch (error) {
      console.error('Error updating check-in', error);
      message.error('Failed to update check-in.');
    }
  };

  const handleManualCheckIn = async () => {
    if (!selectedMemberId) {
      message.error('Please select a member');
      return;
    }
    handleCheckIn(selectedMemberId, true);
  };

  // Render today's check-ins in a table
  const renderCheckInsList = () => (
    <Table
      columns={[
        { title: 'Member Name', dataIndex: 'name', key: 'name' },
        { title: 'Check-In Time', dataIndex: 'attendance', key: 'attendance', render: (attendance: any) => {
            const lastCheckIn = attendance.checkIns.length
              ? attendance.checkIns[attendance.checkIns.length - 1]
              : null;
            return lastCheckIn ? dayjs(lastCheckIn.date).format('YYYY-MM-DD HH:mm') : 'No Check-Ins';
          }
        },
        { title: 'Check-In Method', dataIndex: 'attendance', key: 'method', render: (attendance: any) => {
            const lastCheckIn = attendance.checkIns.length
              ? attendance.checkIns[attendance.checkIns.length - 1]
              : null;
            return lastCheckIn ? lastCheckIn.method : 'No Method';
          }
        },
      ]}
      dataSource={todayCheckIns}
      rowKey="_id"
    />
  );

  return (
    <div className='check-in-view'>
      <h2>QR Check-In or Manual Check-In</h2>

      {/* QR Code Reader */}
      <div style={{ marginBottom: '20px' }}>
      {/* QR Code for Scanning */}
      <div style={{ marginBottom: '20px' }}>
        <h4>Scan this QR Code for Check-In</h4>
        <QRCode value="MemberCheckIn" /> {/* Replace the value with relevant data */}
      </div>
      </div>

      {/* Manual Check-In Form */}
      <Button  onClick={() => setIsModalVisible(true)}>
        Manual Check-In
      </Button>

      <Modal
        title="Manual Check-In"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleManualCheckIn}>
          <Form.Item label="Member" name="member" rules={[{ required: true }]}>
            <Select
              placeholder="Select a member"
              onChange={(value) => setSelectedMemberId(value)}
            >
              {members.map((member:any) => (
                <Option key={member._id} value={member._id}>
                  {member.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Check-In Time" name="checkInTime" rules={[{ required: true }]}>
            <DatePicker
              showTime
              value={checkInTime}
              onChange={(value) => setCheckInTime(value)}
              defaultValue={dayjs()}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>

          <Button  htmlType="submit">
            Check-In
          </Button>
        </Form>
      </Modal>

      {/* Today's Check-Ins List */}
      <div>
      <h4>Today's Check-Ins</h4>
      {renderCheckInsList()}
      </div>
    </div>
  );
};

export default CheckInComponent;
