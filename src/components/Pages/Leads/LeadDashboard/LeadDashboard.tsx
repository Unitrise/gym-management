import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';

const LeadDashboard: React.FC = () => {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic title="Total Leads" value={120} />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="Converted Leads" value={45} />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="Leads in Pipeline" value={75} />
        </Card>
      </Col>
    </Row>
  );
};

export default LeadDashboard;
