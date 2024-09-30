import React, { useEffect, useState } from 'react';
import { List, Button, Input, Form, Modal, message, Card } from 'antd';
import apiService from '../../../../services/ApiService';

const { TextArea } = Input;

interface Note {
  _id: string;
  message: string;
  date: string;
}

interface LeadNotesProps {
  leadId: string;
}

const LeadNotes: React.FC<LeadNotesProps> = ({ leadId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchNotes();
  }, [leadId]);

  const fetchNotes = async () => {
    try {
      const response: any = await apiService.get(`/leads/${leadId}/notes`);
      setNotes(response.data.notes);
    } catch (error) {
      message.error('Error fetching notes');
    }
  };

  const handleAddNote = async (values: any) => {
    try {
      const newNote = {
        ...values,
        date: new Date().toISOString(), // Add current date when creating a new note
      };
      await apiService.post(`/leads/${leadId}/notes`, newNote);
      form.resetFields();
      fetchNotes();
      message.success('Note added successfully');
    } catch (error) {
      message.error('Error adding note');
    }
  };

  const handleEditNote = async (noteId: string, values: any) => {
    try {
      await apiService.put(`/leads/${leadId}/notes/${noteId}`, values);
      setEditingNote(null);
      setIsEditing(false);
      fetchNotes();
      message.success('Note updated successfully');
    } catch (error) {
      message.error('Error updating note');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await apiService.delete(`/leads/${leadId}/notes/${noteId}`);
      fetchNotes();
      message.success('Note deleted successfully');
    } catch (error) {
      message.error('Error deleting note');
    }
  };

  return (
    <div>
      <Card
        style={{
          marginBottom: '16px',
          padding: '16px',
          borderRadius: '8px',
          color:'black'
        }}
      >
        <Form form={form} onFinish={handleAddNote}>
          <Form.Item
            name="message"
            rules={[{ required: true, message: 'Please enter a note' }]}
          >
            <TextArea
              rows={6}
              placeholder="Write your note here..."
              style={{
                fontSize: '16px',
                backgroundColor: '#ffffe0',
                border: '1px solid #d9d9d9',
                borderRadius: '8px',
                padding: '10px',
              }}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Add Note
          </Button>
        </Form>
      </Card>

      <List
        dataSource={notes}
        locale={{ emptyText: 'No notes available' }}
        renderItem={(note: Note) => (
          <List.Item
            actions={[
              <Button
                type="link"
                onClick={() => {
                  setEditingNote(note);
                  setIsEditing(true);
                }}
              >
                Edit
              </Button>,
              <Button type="link"  onClick={() => handleDeleteNote(note._id)}>
                Delete
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={`Date: ${new Date(note.date).toLocaleString()}`}
              description={note.message}
            />
          </List.Item>
        )}
      />

      {/* Edit Modal */}
      {isEditing && (
        <Modal
          title="Edit Note"
          open={isEditing}
          onCancel={() => setIsEditing(false)}
          footer={null}
        >
          <Form
            initialValues={editingNote as Note}
            onFinish={(values) => handleEditNote(editingNote?._id!, values)}
          >
            <Form.Item
              name="message"
              rules={[{ required: true, message: 'Please enter a note' }]}
            >
              <TextArea
                rows={6}
                style={{
                  fontSize: '16px',
                  backgroundColor: '#ffffe0',
                  border: '1px solid #d9d9d9',
                  borderRadius: '8px',
                  padding: '10px',
                }}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default LeadNotes;
