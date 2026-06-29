// File path: /client/src/pages/admin/Settings.jsx
// Purpose: Modern admin page to manage platform settings and pricing
// Architecture: Uses React Query, Framer Motion, and modern UI components

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getPlatformSettings, updatePlatformSetting } from '../../services/admin.service';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const Settings = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});
  const [savingKey, setSavingKey] = useState(null);

  // Fetch platform settings
  const { data, isLoading } = useQuery({
    queryKey: ['platform-settings'],
    queryFn: getPlatformSettings,
  });

  // Update setting mutation
  const updateMutation = useMutation({
    mutationFn: ({ key, value }) => updatePlatformSetting(key, value),
    onSuccess: () => {
      toast.success('Setting updated successfully!');
      queryClient.invalidateQueries(['platform-settings']);
      setSavingKey(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update setting');
      setSavingKey(null);
    },
  });

  useEffect(() => {
    if (data?.data) {
      setFormData(data.data);
    }
  }, [data]);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (key) => {
    setSavingKey(key);
    updateMutation.mutate({ key, value: formData[key] });
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="settings-page"
      >
        <Skeleton.Card />
        <Skeleton.Card />
        <Skeleton.Card />
      </motion.div>
    );
  }

  const settings = data?.data || {};

  const settingGroups = [
    {
      title: 'Platform Identity',
      icon: '🏠',
      settings: [
        { key: 'platform.name', label: 'Platform Name', type: 'text' },
        { key: 'platform.tagline', label: 'Tagline', type: 'text' },
      ],
    },
    {
      title: 'Registration Fees (ETB)',
      icon: '💰',
      settings: [
        { key: 'pricing.registration.worker.amount', label: 'Worker Registration Fee', type: 'number' },
        { key: 'pricing.registration.employer.amount', label: 'Employer Registration Fee', type: 'number' },
      ],
    },
    {
      title: 'Commission Rates (%)',
      icon: '📊',
      settings: [
        { key: 'pricing.commission.worker.percent', label: 'Worker Commission %', type: 'number' },
        { key: 'pricing.commission.employer.percent', label: 'Employer Commission %', type: 'number' },
      ],
    },
    {
      title: 'Premium Features',
      icon: '⭐',
      settings: [
        { key: 'pricing.urgentHire.amount', label: 'Urgent Hire Badge Fee (ETB)', type: 'number' },
        { key: 'pricing.urgentHire.durationHours', label: 'Urgent Badge Duration (Hours)', type: 'number' },
        { key: 'pricing.officeService.amount', label: 'Office Service Fee (ETB)', type: 'number' },
      ],
    },
    {
      title: 'Worker Collateral',
      icon: '🔒',
      settings: [
        { key: 'pricing.collateral.amount', label: 'Collateral Amount (ETB)', type: 'number' },
        { key: 'pricing.collateral.holdMonths', label: 'Hold Duration (Months)', type: 'number' },
      ],
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="settings-page"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="page-header">
        <h1>Platform Settings ⚙️</h1>
        <p>Modify pricing and configuration at runtime. Changes take effect immediately.</p>
      </motion.div>

      {/* Settings Groups */}
      {settingGroups.map((group, groupIndex) => (
        <motion.div key={group.title} variants={itemVariants}>
          <Card>
            <Card.Header>
              <h2>
                <span className="setting-icon">{group.icon}</span>
                {group.title}
              </h2>
            </Card.Header>
            <Card.Body>
              <div className="settings-grid">
                {group.settings.map((setting) => (
                  <div key={setting.key} className="setting-item">
                    <Input
                      label={setting.label}
                      type={setting.type}
                      value={formData[setting.key] || ''}
                      onChange={(e) => handleInputChange(setting.key, e.target.value)}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleSave(setting.key)}
                      loading={savingKey === setting.key}
                      disabled={savingKey !== null}
                    >
                      Save
                    </Button>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Settings;