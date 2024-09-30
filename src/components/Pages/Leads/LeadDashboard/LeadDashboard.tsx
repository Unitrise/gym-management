import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, message } from 'antd';
import apiService from '../../../../services/ApiService';

const LeadDashboard: React.FC = () => {
  const [totalLeads, setTotalLeads] = useState(0);
  const [convertedLeads, setConvertedLeads] = useState(0);
  const [leadsInPipeline, setLeadsInPipeline] = useState(0);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response: any = await apiService.get('/leads');
      const allLeads = response.data;
      const converted = allLeads.filter((lead: any) => lead.status === 'Converted').length;
      const inPipeline = allLeads.length - converted;

      setTotalLeads(allLeads.length);
      setConvertedLeads(converted);
      setLeadsInPipeline(inPipeline);
    } catch (error) {
      message.error('Error fetching lead statistics');
    }
  };

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic title="Total Leads" value={totalLeads} />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="Converted Leads" value={convertedLeads} />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="Leads in Pipeline" value={leadsInPipeline} />
        </Card>
      </Col>
    </Row>
  );
};

export default LeadDashboard;
