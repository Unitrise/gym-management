import React from 'react';
import { Tabs, Card } from 'antd';
import LeadDashboard from './LeadDashboard/LeadDashboard';
import LeadCapture from './CaptureLead/CaptureLead';
import LeadCommunication from './LeadCommunication/LeadCommunication';
import LeadPipeline from './LeadPipeline/LeadPipeline';
import LeadReports from './LeadReports/LeadReports';
import LeadAutomations from './LeadAutomations/LeadAutomations';
import LeadList from './LeadList/Leadlist';

const { TabPane } = Tabs;

const LeadManager: React.FC = () => {
  return (
    <Card title="Lead Management System">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Dashboard" key="1">
          <LeadDashboard />
        </TabPane>
        <TabPane tab="Lead List" key="2">
          <LeadList />
        </TabPane>
        <TabPane tab="Capture Lead" key="3">
          <LeadCapture />
        </TabPane>
        <TabPane tab="Communication" key="4">
          <LeadCommunication />
        </TabPane>
        <TabPane tab="Pipeline" key="5">
          <LeadPipeline />
        </TabPane>
        <TabPane tab="Reports" key="6">
          <LeadReports />
        </TabPane>
        <TabPane tab="Automated Workflows" key="7">
          <LeadAutomations />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default LeadManager;
