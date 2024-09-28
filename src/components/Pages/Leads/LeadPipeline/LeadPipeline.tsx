import React, { useState, useEffect } from 'react';
import { Card, Steps, Button } from 'antd';
import apiService from '../../../../services/ApiService';

const { Step } = Steps;

const LeadPipeline: React.FC = () => {
    const [leads, setLeads] = useState<any[]>([]); // Ensure default is an empty array
  
    useEffect(() => {
      const fetchLeads = async () => {
        try {
          const response:any = await apiService.get('/leads');
          setLeads(response.data || []); // Ensure response.data is set as an array
        } catch (error) {
          console.error('Error fetching leads:', error);
        }
      };
  
      fetchLeads();
    }, []);
  
    // Add a safe check before using .map
    return (
      <div>
        <h2>Lead Pipeline</h2>
        {leads.length > 0 ? (
          <ul>
            {leads.map((lead) => (
              <li key={lead.id}>{lead.name}</li>
            ))}
          </ul>
        ) : (
          <p>No leads available</p>
        )}
      </div>
    );
  };
  

export default LeadPipeline;
