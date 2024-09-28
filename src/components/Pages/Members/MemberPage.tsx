import React, { useState, useEffect } from 'react';
import { Table, Card, Tabs, Progress, QRCode, Badge, Button, Form, Input, Modal, Alert } from 'antd';
import apiService from '../../../services/ApiService'; // Example service for API requests
import AddMemberForm from './MemberForm/MemberForm';
import MemberProfile from './MemberProfile/MemberProfile';
import useAuthStore from '../../../store/authStore';
import ClassManagement from './ClassManagement/ClassManager';
import CheckInComponent from './CheckIN/CheckIn';
import AtRiskMembers from './AtRiskMember/AtRiskMembers';
import { title } from 'process';

const { TabPane } = Tabs;
const { Search } = Input; // AntD Search Input

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]); // State for filtered members
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const { currentView } = useAuthStore();

  const fetchMembers = async () => {
    try {
      const response: any = await apiService.get('/members');
      if (response && response.data) {
        setMembers(response.data);
        setFilteredMembers(response.data); // Initialize with all members
      } else {
        console.error('Error fetching members');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    if (currentView !== 'members') return;
    fetchMembers();
  }, [currentView]);

  const showProfile = (member: any) => {
    setSelectedMember(member);
    setIsModalVisible(true);
    fetchMembers();
  };

  // Handle member search
  const handleSearch = (value: string) => {
    const filtered = members.filter((member: any) =>
      member.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMembers(filtered); // Set the filtered list
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Membership Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: any) => <Badge status={status === 'Inactive' ? 'error' : 'success'} text={status} />,
    },
    {
      title: 'Membership Type',
      dataIndex: 'membership',
      key: 'membership',
      render: (membership: any) => <span>{membership.type}</span>,
    },
    {
      title: 'Loyalty Points',
      dataIndex: 'loyalty',
      key: 'loyalty',
      render: (loyalty: any) => (
        <Progress percent={loyalty.points} status={loyalty.points >= 100 ? 'success' : 'normal'} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, member: any) => <Button onClick={() => showProfile(member)}>View Profile</Button>,
    },
  ];

  return (
    <div>
      <Card>
        <Tabs defaultActiveKey="1">
          {/* Members List Tab */}
          <TabPane tab="Members List" key="1">
            <Search
              placeholder="Search by name"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)} // Update search on input change
              style={{ marginBottom: '16px', width: '300px' }}
            />
            <Table columns={columns} dataSource={filteredMembers} rowKey="_id" />
          </TabPane>

          {/* Class Management Tab */}
          <TabPane tab="Class Management" key="2">
            <ClassManagement />
          </TabPane>

          {/* Attendance & Check-In Tab */}
          <TabPane tab="Attendance & Check-In" key="3">
            <CheckInComponent />
          </TabPane>

          {/* Loyalty & Rewards Tab */}
          <TabPane tab="At-Risk Members" key="4">
            <AtRiskMembers /> {/* Use the new component */}
          </TabPane>

          {/* Add New Member Tab */}
          <TabPane tab="Add New Member" key="5">
            <AddMemberForm />
          </TabPane>
        </Tabs>
      </Card>

      {/* Member Profile Modal */}
      <Modal open={isModalVisible} onCancel={() => setIsModalVisible(false)}>
        {selectedMember ? (
          <MemberProfile member={selectedMember} onClose={() => setIsModalVisible(false)} />
        ) : (
          <Alert message="No member selected" type="info" />
        )}
      </Modal>
    </div>
  );
};

export default MembersPage;
