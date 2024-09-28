import React, { useEffect } from 'react';
import useAuthStore, { ViewPages } from './store/authStore';

import { Layout, Menu, Modal, ConfigProvider } from 'antd';
import { UserOutlined, AppstoreOutlined, FileDoneOutlined, LogoutOutlined } from '@ant-design/icons';
import ContractsPage from './components/Pages/Contracts/ContrcatsPage';
import InventoryPage from './components/Pages/Inventory/Inventory';
import LoginPage from './components/Pages/Login/LoginPage';
import MembersPage from './components/Pages/Members/MemberPage';
import './App.css'; // Import the global dark theme styles
import LeadManager from './components/Pages/Leads/LeadManager';

const { Header, Content, Sider } = Layout;

const App: React.FC = () => {
  const { isAuthenticated, currentView, setView, logout, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Check authentication on page load
  }, [checkAuth]);

  const renderView = () => {
    switch (currentView) {
      case ViewPages.MEMBERS:
        return <MembersPage />;
      case ViewPages.INVENTORY:
        return <InventoryPage />;
      case ViewPages.CONTRACTS:
        return <ContractsPage />;
        case ViewPages.LEADS:
        return <LeadManager/>;
      default:
        return <LoginPage />;
    }
  };

  const showLogoutConfirm = () => {
    Modal.confirm({
      title: 'Are you sure you want to log out?',
      content: 'You will need to log in again to access the system.',
      okText: 'Yes, Log out',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        logout(); // Call the logout function
      },
    });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          colorBgBase: '#141414',
          colorText: '#ffffff',
          colorBgContainer: '#1f1f1f',
          borderRadius: 6,
          colorTextPlaceholder: '#bfbfbf',
          boxShadow: 'rgba(0, 0, 0, 0.45)',
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        {isAuthenticated ? (
          <>
            <Sider collapsible>
              <div className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['members']}>
                <Menu.Item key="1" icon={<UserOutlined />} onClick={() => setView(ViewPages.MEMBERS)}>
                  Members
                </Menu.Item>
                <Menu.Item key="2" icon={<AppstoreOutlined />} onClick={() => setView(ViewPages.INVENTORY)}>
                  Inventory
                </Menu.Item>
                <Menu.Item key="3" icon={<FileDoneOutlined />} onClick={() => setView(ViewPages.CONTRACTS)}>
                  Contracts
                </Menu.Item>
                <Menu.Item key="4" icon={<FileDoneOutlined />} onClick={() => setView(ViewPages.LEADS)}>
                  Leads
                </Menu.Item>
                
                <Menu.Item key="5" icon={<LogoutOutlined />} onClick={showLogoutConfirm}>
                  Logout
                </Menu.Item>

              </Menu>
            </Sider>
            <Layout>
              <Header className="app-header">{currentView.toLocaleUpperCase()}</Header>
              <Content className="app-content">
                {renderView()} {/* Render the current view */}
              </Content>
            </Layout>
          </>
        ) : (
          <Content className="app-content">
            {renderView()} {/* Render the login page */}
          </Content>
        )}
      </Layout>
    </ConfigProvider>
  );
};

export default App;
