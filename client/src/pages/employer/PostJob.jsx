// File path: /client/src/pages/employer/PostJob.jsx
// Purpose: Modern job posting form with validation and animations
// Architecture: Uses React Hook Form, Zod validation, and Framer Motion

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createJob } from '../../services/job.service';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const jobSchema = z.object({
  workerType: z.string().min(1, 'Please select a worker type'),
  schedule: z.string().min(1, 'Please select a schedule'),
  housing: z.string().min(1, 'Please select housing type'),
  salaryMin: z.string().min(1, 'Minimum salary is required'),
  salaryMax: z.string().min(1, 'Maximum salary is required'),
  workingHours: z.string().optional(),
  preferredGender: z.string().optional(),
  minExperience: z.string().optional(),
  minEducation: z.string().optional(),
  isUrgent: z.boolean().optional(),
});

const PostJob = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      workerType: 'maid',
      schedule: 'full_time',
      housing: 'live_out',
      workingHours: 'morning',
      preferredGender: 'any',
      minExperience: '0',
      minEducation: 'none',
      isUrgent: false,
    },
  });

  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: (data) => {
      toast.success('Job posted successfully!');
      if (data.data?.requiresPayment) {
        toast(`Urgent hire fee: ${data.data.paymentAmount} ETB`, {
          icon: '💰',
          duration: 5000,
        });
      }
      navigate('/employer/my-jobs');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to post job');
    },
  });

  const onSubmit = (data) => {
    const jobData = {
      ...data,
      salaryMin: parseInt(data.salaryMin),
      salaryMax: parseInt(data.salaryMax),
      minExperience: parseInt(data.minExperience || '0'),
    };
    mutation.mutate(jobData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="post-job-page"
    >
      {/* Page Header */}
      <div className="page-header">
        <h1>Post a New Job ➕</h1>
        <p>Fill out the details below to find the perfect verified worker for your household.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="post-job-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2 className="section-title">Basic Information</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Worker Type *</label>
                <select {...register('workerType')} className="form-select">
                  <option value="maid">Maid</option>
                  <option value="nanny">Nanny</option>
                  <option value="cook">Cook</option>
                  <option value="driver">Driver</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="guard">Guard</option>
                </select>
                {errors.workerType && (
                  <span className="form-error">{errors.workerType.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Schedule *</label>
                <select {...register('schedule')} className="form-select">
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                </select>
                {errors.schedule && (
                  <span className="form-error">{errors.schedule.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Housing *</label>
                <select {...register('housing')} className="form-select">
                  <option value="live_in">Live-in</option>
                  <option value="live_out">Live-out</option>
                </select>
                {errors.housing && (
                  <span className="form-error">{errors.housing.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Working Hours</label>
                <select {...register('workingHours')} className="form-select">
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="night">Night</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="form-section">
            <h2 className="section-title">Salary Information</h2>
            
            <div className="form-grid">
              <Input
                label="Minimum Salary (ETB) *"
                type="number"
                placeholder="5000"
                error={errors.salaryMin?.message}
                {...register('salaryMin')}
              />

              <Input
                label="Maximum Salary (ETB) *"
                type="number"
                placeholder="7000"
                error={errors.salaryMax?.message}
                {...register('salaryMax')}
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="form-section">
            <h2 className="section-title">Requirements</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Preferred Gender</label>
                <select {...register('preferredGender')} className="form-select">
                  <option value="any">Any</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Minimum Experience (years)</label>
                <select {...register('minExperience')} className="form-select">
                  <option value="0">No experience required</option>
                  <option value="1">1+ years</option>
                  <option value="2">2+ years</option>
                  <option value="3">3+ years</option>
                  <option value="5">5+ years</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Minimum Education</label>
                <select {...register('minEducation')} className="form-select">
                  <option value="none">No requirement</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="certificate">Certificate</option>
                </select>
              </div>
            </div>
          </div>

          {/* Urgent Hire */}
          <div className="form-section">
            <div className="urgent-hire-option">
              <label className="checkbox-label">
                <input type="checkbox" {...register('isUrgent')} className="checkbox" />
                <span className="checkbox-text">
                  <strong>⚡ Mark as Urgent Hire</strong>
                  <span className="checkbox-description">
                    Boost your job visibility for 48 hours (200 ETB additional fee)
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/employer/my-jobs')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={mutation.isLoading}
              disabled={mutation.isLoading}
            >
              Post Job
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default PostJob;