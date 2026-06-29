// File path: /client/src/components/domain/FileUpload.jsx
// Purpose: Reusable file upload component with preview and drag-and-drop support.
// Design: Uses the new Slate & Indigo styling system with smooth animations.

import React, { useRef, useState } from 'react';
import { uploadFile } from '../../services/upload.service';
import { useToast } from '../../context/ToastContext';

const FileUpload = ({ 
  label, 
  folder, 
  value, 
  onChange, 
  accept = "image/*,application/pdf",
  helpText 
}) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const { toast } = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadFile(file, folder);
      setPreview(result.url);
      onChange(result.url);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset input value so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
  };

  const isImage = preview && /\.(jpg|jpeg|png|webp)$/i.test(preview);
  const isPdf = preview && /\.pdf$/i.test(preview);

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        <span className="required">*</span>
      </label>

      <div 
        className={`card ${isUploading ? 'opacity-50' : ''}`}
        style={{ padding: '1.5rem', textAlign: 'center' }}
      >
        {preview ? (
          <div className="d-flex flex-col items-center gap-4">
            {isImage && (
              <img 
                src={preview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  borderRadius: 'var(--radius-lg)',
                  objectFit: 'cover'
                }} 
              />
            )}
            {isPdf && (
              <div className="d-flex items-center gap-2 text-muted">
                <span style={{ fontSize: '2rem' }}></span>
                <span>PDF Document</span>
              </div>
            )}
            
            <div className="d-flex gap-2">
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
              >
                Change File
              </button>
              <button 
                type="button" 
                className="btn btn-danger btn-sm"
                onClick={handleRemove}
                disabled={isUploading}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="d-flex flex-col items-center gap-3 cursor-pointer"
            onClick={() => fileInputRef.current.click()}
            style={{ padding: '2rem 0' }}
          >
            <div style={{ fontSize: '2.5rem', color: 'var(--color-slate-400)' }}>
              📁
            </div>
            <div>
              <p className="font-medium text-dark" style={{ marginBottom: '0.25rem' }}>
                Click to upload
              </p>
              <p className="text-sm text-muted" style={{ marginBottom: 0 }}>
                PNG, JPG, PDF up to 5MB
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={isUploading}
        />
      </div>

      {helpText && <span className="form-hint">{helpText}</span>}
      {isUploading && (
        <div className="d-flex items-center gap-2 mt-2 text-sm text-primary">
          <div className="skeleton" style={{ width: '16px', height: '16px', borderRadius: '50%' }}></div>
          Uploading...
        </div>
      )}
    </div>
  );
};

export default FileUpload;