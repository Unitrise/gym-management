import React, { useState, useEffect } from 'react';
import { Calendar, Modal, Button, Form, Input, Select, DatePicker, message, Table, Badge } from 'antd';
import { Member } from '../MemberForm/MemberFormProps';
import apiService from '../../../../services/ApiService';
import dayjs from 'dayjs';  // Day.js for date formatting
import './ClassManager.css';

const { Option } = Select;

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentDate, setCurrentDate] = useState(dayjs()); // Track current date
  const [filteredClasses, setFilteredClasses] = useState([]); // For classes on the selected date

  const [form] = Form.useForm();

  // Fetch classes and members on component mount
  useEffect(() => {
    fetchClasses();
    fetchMembers();
  }, []);

  const fetchClasses = async () => {
    try {
      const response:any = await apiService.get('/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response:any = await apiService.get('/members');
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members', error);
    }
  };

  // Handle class creation and editing
  const handleCreateClass = () => {
    setSelectedClass(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSaveClass = async (values: any) => {
    const payload = {
      ...values,
      date: selectedDate,  // Use the selected date for the class
      time: values.time.toISOString(),  // Ensure time is in ISO format
    };

    try {
      if (selectedClass) {
        await apiService.put(`/classes/${selectedClass._id}`, payload);
      } else {
        await apiService.post('/classes', payload);
      }
      message.success('Class saved successfully!');
      setIsModalVisible(false);
      fetchClasses();  // Refresh class data after saving
    } catch (error) {
      console.error('Error saving class', error);
      message.error('Failed to save class.');
    }
  };
  const formatDate = (date: Date) => {
    return dayjs(date).format('YYYY-MM-DD');  // Use dayjs to format date
  };

  const dateCellRender = (value: any) => {
    const currentDate = formatDate(new Date(value.year(), value.month(), value.date()));
    const classOnDate = classes.some(
      (cls: any) => formatDate(new Date(cls.date)) === currentDate
    );

    return classOnDate ? <Badge color="red" text="Class Scheduled" /> : null;
  };

  // When a date is selected, show classes scheduled on that date
  const handleSelectDate = (date: any) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setSelectedDate(formattedDate);
    const classesOnSelectedDate = classes.filter((cls: any) =>
      dayjs(cls.date).format('YYYY-MM-DD') === formattedDate
    );
    setFilteredClasses(classesOnSelectedDate);
    setIsModalVisible(true);
  };

  

  // Handle class editing
  const handleClassClick = async (classItem: any) => {
    form.setFieldsValue({
      ...classItem,
      date: dayjs(classItem.date),
      time: dayjs(classItem.time),
    });
    setSelectedClass(classItem);
    setIsModalVisible(true);
  };

  // Remove a class
  const removeClass = async (classItem: any) => {
    try {
      await apiService.delete(`/classes/${classItem._id}`);
      message.success('Class deleted successfully!');
      fetchClasses();  // Refresh class data after deletion
    } catch (error) {
      console.error('Error deleting class', error);
      message.error('Failed to delete class.');
    }
  };

  // Render list of classes in a table
  const renderClassList = () => (
    <Table
      columns={[
        { title: 'Class Name', dataIndex: 'name', key: 'name' },
        { title: 'Instructor', dataIndex: 'instructor', key: 'instructor' },
        { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
        {title: 'Date', dataIndex: 'date', key: 'date', render: (date) => dayjs(date).format('YYYY-MM-DD')},
        { title: 'Actions', key: 'actions', render: (_, classItem) => (
            <>
              <Button onClick={() => handleClassClick(classItem)}>View / Edit</Button>
              <Button onClick={() => removeClass(classItem)}>Delete</Button>
            </>
        )}
      ]}
      dataSource={classes}
    />
  );
  const customHeaderRender = ({ value, onChange, type, onTypeChange }: any) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
        {/* Default Ant Design Calendar controls */}
        <div style={{ marginRight: '16px' }}>
          <DatePicker
            picker="date"
            value={value}
            onChange={onChange}
            allowClear={false}  // Disable clear to retain calendar consistency
          />
        </div>
        {/* Month/Year controls */}
        <Button onClick={() => onTypeChange(type === 'month' ? 'year' : 'month')}>
          {type === 'month' ? 'Year View' : 'Month View'}
        </Button>
      </div>
    );
  };
  

  return (
    <div className='calender-view'>
      <h2>Class Management</h2>
      <Calendar onSelect={handleSelectDate} cellRender={dateCellRender} headerRender={customHeaderRender} mode='month' />
      <Button onClick={handleCreateClass}>Create New Class</Button>
      {renderClassList()}

      <Modal open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null} width={780}>
        <h3>Classes on {selectedDate}</h3>
        <Button onClick={handleCreateClass} type="primary" style={{ marginBottom: '10px' }}>Create New Class</Button>
        {filteredClasses.length > 0 ? (
          renderClassList()
        ) : (
          <p>No classes scheduled for this date.</p>
        )}

        {/* Form for creating or editing a class */}
        <Form form={form} onFinish={handleSaveClass} layout="vertical">
          <Form.Item label="Class Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Instructor" name="instructor" rules={[{ required: true }]}>
            <Select>
              <Option value="John Doe">John Doe</Option>
              <Option value="Jane Smith">Jane Smith</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Class Capacity" name="capacity" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item label="Time" name="time" rules={[{ required: true }]}>
            <DatePicker showTime={{ format: 'HH:mm' }} format="HH:mm" picker="time" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="Members" name="members">
            <Select mode="multiple" placeholder="Select members">
              {members.map(member => (
                <Option key={member._id} value={member._id}>{member.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            {selectedClass ? 'Update Class' : 'Create Class'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassManagement;
