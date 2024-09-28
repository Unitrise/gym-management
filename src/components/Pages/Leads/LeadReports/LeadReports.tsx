import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Table, Select, Button, Statistic, Row, Col } from 'antd';
import apiService from '../../../../services/ApiService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const LeadReports: React.FC = () => {
  const [leadStats, setLeadStats] = useState<any>({});
  const [conversionData, setConversionData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'days'), dayjs()]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeadStats();
  }, [dateRange]);

  const fetchLeadStats = async () => {
    setLoading(true);
    try {
      const [statsResponse, conversionResponse, activityResponse] = await Promise.all([
        apiService.get(`/reports/lead-stats?start=${dateRange[0].toISOString()}&end=${dateRange[1].toISOString()}`),
        apiService.get(`/reports/conversions?start=${dateRange[0].toISOString()}&end=${dateRange[1].toISOString()}`),
        apiService.get(`/reports/activities?start=${dateRange[0].toISOString()}&end=${dateRange[1].toISOString()}`),
      ]);
      setLeadStats((statsResponse as any).data);
      setConversionData((conversionResponse as any).data);
      setActivityData((activityResponse as any).data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching lead reports', error);
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
  };

  const downloadReport = (format: string) => {
    // Implement the download functionality (CSV, PDF, etc.)
    console.log(`Downloading report in ${format} format...`);
  };

  const conversionChartConfig = {
    data: conversionData,
    xField: 'stage',
    yField: 'count',
    label: { position: 'middle', style: { fill: '#ffffff', opacity: 0.6 } },
    point: { size: 5, shape: 'diamond' },
    tooltip: { showTitle: false },
  };

  const activityChartConfig = {
    data: activityData,
    xField: 'date',
    yField: 'count',
    point: { size: 5, shape: 'circle' },
    lineStyle: { stroke: '#1890ff' },
  };

  return (
    <div>
      <h2>Lead Reports</h2>
      <Card>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="Total Leads" value={leadStats?.totalLeads || 0} loading={loading} />
          </Col>
          <Col span={6}>
            <Statistic title="Qualified Leads" value={leadStats?.qualifiedLeads || 0} loading={loading} />
          </Col>
          <Col span={6}>
            <Statistic title="Conversions" value={leadStats?.conversions || 0} loading={loading} />
          </Col>
          <Col span={6}>
            <Statistic title="Conversion Rate" value={`${leadStats?.conversionRate || 0}%`} loading={loading} />
          </Col>
        </Row>

        <RangePicker onChange={handleDateRangeChange} style={{ marginTop: '16px' }} />
      </Card>

      <Card title="Conversion Funnel" style={{ marginTop: '24px' }}>
        {/* <Line {...conversionChartConfig} /> */}
      </Card>

      <Card title="Lead Activity Overview" style={{ marginTop: '24px' }}>
        {/* <Line {...activityChartConfig} /> */}
      </Card>

      <div style={{ marginTop: '24px' }}>
        <Button onClick={() => downloadReport('csv')} type="primary" style={{ marginRight: '8px' }}>
          Download CSV
        </Button>
        <Button onClick={() => downloadReport('pdf')} type="default">
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default LeadReports;
