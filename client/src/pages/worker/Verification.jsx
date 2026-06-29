// File path: /client/src/pages/worker/Verification.jsx
// Purpose: Worker verification page - upload required documents for verification.
// Architecture: File upload with progress tracking and validation.

import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import FileUpload from '../../components/domain/FileUpload';
import api from '../../services/api';

const WorkerVerification = ({ onNavigate }) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
  const [documents, setDocuments] = useState({
    policeClearance: null,
    healthCertificate: null,
    healthCertificateExpiry: '',
    idDocument: null,
    idDocumentType: '',
    idDocumentNumber: ''
  });

  const handleDocumentChange = (field, value) => {
    setDocuments(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!documents.policeClearance || !documents.healthCertificate || !documents.idDocument) {
        throw new Error('Please upload all required documents');
      }

      if (!documents.healthCertificateExpiry) {
        throw new Error('Please enter health certificate expiry date');
      }

      if (!documents.idDocumentType || !documents.idDocumentNumber) {
        throw new Error('Please enter ID document details');
      }

      const response = await api.patch('/api/workers/verification', {
        policeClearanceUrl: documents.policeClearance,
        healthCertificateUrl: documents.healthCertificate,
        healthCertificateExpiry: documents.healthCertificateExpiry,
        idDocumentUrl: documents.idDocument,
        idDocumentType: documents.idDocumentType,
        idDocumentNumber: documents.idDocumentNumber
      });

      if (response.success) {
        toast.success('Documents submitted successfully! Admin will review them shortly.');
        if (onNavigate) {
          onNavigate('worker-dashboard');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to submit documents');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-main">
      <div className="page-header">
        <h1>Verification Documents</h1>
        <p>Upload your documents to get verified and increase your Trust Score.</p>
      </div>

      <form onSubmit={handleSubmit} className="dynamic-form">
        <div className="form-section">
          <h3>Required Documents</h3>
          <p className="section-description">All documents must be clear and legible. PDF or Image formats accepted.</p>
          
          <div className="form-grid form-grid-2">
            <FileUpload
              label="Police Clearance Certificate"
              folder="police-clearance"
              value={documents.policeClearance}
              onChange={(val) => handleDocumentChange('policeClearance', val)}
              helpText="Official document from local police station"
            />

            <FileUpload
              label="Health Certificate"
              folder="health-cert"
              value={documents.healthCertificate}
              onChange={(val) => handleDocumentChange('healthCertificate', val)}
              helpText="Recent medical checkup certificate"
            />

            <FileUpload
              label="ID Document"
              folder="id-document"
              value={documents.idDocument}
              onChange={(val) => handleDocumentChange('idDocument', val)}
              helpText="Passport, Kebele ID, or Driver's License"
            />

            <div className="form-group">
              <label className="form-label">ID Document Type</label>
              <select 
                className="form-select"
                value={documents.idDocumentType}
                onChange={(e) => handleDocumentChange('idDocumentType', e.target.value)}
                required
              >
                <option value="">Select ID Type</option>
                <option value="passport">Passport</option>
                <option value="kebele_id">Kebele ID</option>
                <option value="drivers_license">Driver's License</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ID Document Number</label>
              <input 
                type="text" 
                className="form-input"
                value={documents.idDocumentNumber}
                onChange={(e) => handleDocumentChange('idDocumentNumber', e.target.value)}
                placeholder="Enter ID number"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Health Certificate Expiry Date</label>
              <input 
                type="date" 
                className="form-input"
                value={documents.healthCertificateExpiry}
                onChange={(e) => handleDocumentChange('healthCertificateExpiry', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate && onNavigate('worker-dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Documents'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkerVerification;