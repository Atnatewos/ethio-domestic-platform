// File path: /client/src/pages/admin/Settings.jsx
// Purpose: Admin platform settings page - allows runtime configuration changes.
// Architecture: Config-driven UI that renders input fields based on the config structure.

import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { getSettings, updateSetting } from '../../services/settings.service';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Local state for editable fields
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await getSettings();
      if (response.success) {
        setSettings(response.data);
        // Initialize form data with current values
        setFormData({
          workerRegFee: response.data.pricing.registration.worker.amount,
          employerRegFee: response.data.pricing.registration.employer.amount,
          workerCommission: response.data.pricing.commission.worker.percent,
          employerCommission: response.data.pricing.commission.employer.percent,
          urgentHireFee: response.data.pricing.urgentHire.amount,
          officeServiceFee: response.data.pricing.officeService.amount,
          collateralAmount: response.data.pricing.collateral.amount
        });
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (configKey, value, fieldName) => {
    setSaving(true);
    try {
      const response = await updateSetting(configKey, value);
      if (response.success) {
        toast.success(`${fieldName} updated successfully!`);
      }
    } catch (error) {
      toast.error(`Failed to update ${fieldName}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="app-main">
        <div className="skeleton-card" style={{ height: '400px' }}></div>
      </div>
    );
  }

  return (
    <div className="app-main">
      <div className="page-header">
        <h1>Platform Settings</h1>
        <p>Modify pricing and configuration at runtime. Changes take effect immediately.</p>
      </div>

      <div className="d-grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        
        {/* Registration Fees */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 className="text-lg font-semibold mb-4">Registration Fees (ETB)</h3>
          
          <div className="form-group">
            <label className="form-label">Worker Registration Fee</label>
            <div className="d-flex gap-2">
              <input 
                type="number" 
                className="form-input"
                value={formData.workerRegFee}
                onChange={(e) => handleInputChange('workerRegFee', parseInt(e.target.value))}
              />
              <button 
                className="btn btn-primary"
                onClick={() => handleSave('pricing.registration.worker.amount', formData.workerRegFee, 'Worker Fee')}
                disabled={saving}
              >
                Save
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Employer Registration Fee</label>
            <div className="d-flex gap-2">
              <input 
                type="number" 
                className="form-input"
                value={formData.employerRegFee}
                onChange={(e) => handleInputChange('employerRegFee', parseInt(e.target.value))}
              />
              <button 
                className="btn btn-primary"
                onClick={() => handleSave('pricing.registration.employer.amount', formData.employerRegFee, 'Employer Fee')}
                disabled={saving}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Commission Rates */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 className="text-lg font-semibold mb-4">Commission Rates (%)</h3>
          
          <div className="form-group">
            <label className="form-label">Worker Commission %</label>
            <div className="d-flex gap-2">
              <input 
                type="number" 
                className="form-input"
                value={formData.workerCommission}
                onChange={(e) => handleInputChange('workerCommission', parseInt(e.target.value))}
              />
              <button 
                className="btn btn-primary"
                onClick={() => handleSave('pricing.commission.worker.percent', formData.workerCommission, 'Worker Commission')}
                disabled={saving}
              >
                Save
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Employer Commission %</label>
            <div className="d-flex gap-2">
              <input 
                type="number" 
                className="form-input"
                value={formData.employerCommission}
                onChange={(e) => handleInputChange('employerCommission', parseInt(e.target.value))}
              />
              <button 
                className="btn btn-primary"
                onClick={() => handleSave('pricing.commission.employer.percent', formData.employerCommission, 'Employer Commission')}
                disabled={saving}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 className="text-lg font-semibold mb-4">Premium Features (ETB)</h3>
          
          <div className="form-group">
            <label className="form-label">Urgent Hire Badge Fee</label>
            <div className="d-flex gap-2">
              <input 
                type="number" 
                className="form-input"
                value={formData.urgentHireFee}
                onChange={(e) => handleInputChange('urgentHireFee', parseInt(e.target.value))}
              />
              <button 
                className="btn btn-primary"
                onClick={() => handleSave('pricing.urgentHire.amount', formData.urgentHireFee, 'Urgent Fee')}
                disabled={saving}
              >
                Save
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Office Service Fee</label>
            <div className="d-flex gap-2">
              <input 
                type="number" 
                className="form-input"
                value={formData.officeServiceFee}
                onChange={(e) => handleInputChange('officeServiceFee', parseInt(e.target.value))}
              />
              <button 
                className="btn btn-primary"
                onClick={() => handleSave('pricing.officeService.amount', formData.officeServiceFee, 'Office Fee')}
                disabled={saving}
              >
                Save
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Worker Collateral Amount</label>
            <div className="d-flex gap-2">
              <input 
                type="number" 
                className="form-input"
                value={formData.collateralAmount}
                onChange={(e) => handleInputChange('collateralAmount', parseInt(e.target.value))}
              />
              <button 
                className="btn btn-primary"
                onClick={() => handleSave('pricing.collateral.amount', formData.collateralAmount, 'Collateral')}
                disabled={saving}
              >
                Save
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;