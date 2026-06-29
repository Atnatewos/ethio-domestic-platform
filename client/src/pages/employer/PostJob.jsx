// File path: /client/src/pages/employer/PostJob.jsx
// Purpose: Employer job posting page - create new job listings.
// Architecture: Uses FormRenderer with config-driven form definition.

import React from 'react';
import { useToast } from '../../context/ToastContext';
import FormRenderer from '../../components/dynamic/FormRenderer';
import { createJob } from '../../services/job.service';

const EmployerPostJob = ({ onNavigate }) => {
  const { toast } = useToast();

  const handleSubmit = async (formData) => {
    try {
      const response = await createJob(formData);

      if (response.success) {
        toast.success('Job posted successfully!');
        
        if (response.data.requiresPayment) {
          toast.info(`Urgent hire fee of ${response.data.paymentAmount} ETB is pending.`);
        }
        
        if (onNavigate) {
          onNavigate('employer-my-jobs');
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to post job. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="app-main">
      <div className="page-header">
        <h1>Post a New Job</h1>
        <p>Fill out the details below to find the perfect verified worker for your household.</p>
      </div>

      <FormRenderer
        formId="jobPosting"
        onSubmit={handleSubmit}
        onCancel={() => onNavigate && onNavigate('employer-my-jobs')}
      />
    </div>
  );
};

export default EmployerPostJob;