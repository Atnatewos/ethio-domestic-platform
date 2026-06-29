// File path: /client/src/components/dynamic/FormRenderer.jsx
// Purpose:  THE MAGIC FORM RENDERER 
// Reads form config and automatically renders complete forms with validation
// Supports: text, tel, number, email, select, multiselect, checkbox, textarea, file, date, repeatable

import React, { useState } from 'react';
import { useConfig } from '../../hooks/useConfig';

export default function FormRenderer({ formId, initialData = {}, onSubmit, onCancel }) {
  const { getForm, config } = useConfig();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Get form config
  const formConfig = getForm(formId);
  
  if (!formConfig) {
    return <div className="error-message">Form configuration not found: {formId}</div>;
  }

  // Handle field change
  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    
    formConfig.sections.forEach(section => {
      section.fields.forEach(field => {
        const value = formData[field.name];
        
        // Required field check
        if (field.required && (!value || value === '')) {
          newErrors[field.name] = `${field.label} is required`;
          return;
        }
        
        // Validation rules
        if (field.validation) {
          if (field.validation.minLength && value.length < field.validation.minLength) {
            newErrors[field.name] = `${field.label} must be at least ${field.validation.minLength} characters`;
          }
          if (field.validation.maxLength && value.length > field.validation.maxLength) {
            newErrors[field.name] = `${field.label} must be at most ${field.validation.maxLength} characters`;
          }
          if (field.validation.pattern) {
            const regex = new RegExp(field.validation.pattern);
            if (!regex.test(value)) {
              newErrors[field.name] = `${field.label} format is invalid`;
            }
          }
        }
        
        // Min/max for numbers
        if (field.type === 'number') {
          if (field.min !== undefined && value < field.min) {
            newErrors[field.name] = `${field.label} must be at least ${field.min}`;
          }
          if (field.max !== undefined && value > field.max) {
            newErrors[field.name] = `${field.label} must be at most ${field.max}`;
          }
        }
      });
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Render individual field
  const renderField = (field) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    
    const fieldProps = {
      name: field.name,
      value: value,
      onChange: (e) => handleChange(field.name, e.target.value),
      placeholder: field.placeholder || '',
      required: field.required,
      disabled: submitting,
      className: `form-input ${error ? 'form-input-error' : ''}`
    };

    switch (field.type) {
      case 'text':
      case 'tel':
      case 'email':
      case 'date':
        return <input type={field.type} {...fieldProps} />;
      
      case 'number':
        return (
          <input 
            type="number" 
            min={field.min}
            max={field.max}
            {...fieldProps} 
          />
        );
      
      case 'select':
        return (
          <select {...fieldProps}>
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'multiselect':
        return (
          <div className="multiselect-container">
            {field.options?.map(option => (
              <label key={option.value} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={value.includes?.(option.value) || false}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...(value || []), option.value]
                      : value.filter(v => v !== option.value);
                    handleChange(field.name, newValue);
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleChange(field.name, e.target.checked)}
            />
            <span>{field.label}</span>
          </label>
        );
      
      case 'textarea':
        return (
          <textarea 
            rows={field.rows || 3}
            {...fieldProps}
          />
        );
      
      case 'file':
        return (
          <input
            type="file"
            accept={field.accept}
            onChange={(e) => handleChange(field.name, e.target.files[0])}
            className={fieldProps.className}
            required={field.required}
            disabled={submitting}
          />
        );
      
      case 'repeatable':
        return renderRepeatableField(field);
      
      default:
        return <div>Unknown field type: {field.type}</div>;
    }
  };

  // Render repeatable field (e.g., previous employers)
  const renderRepeatableField = (field) => {
    const items = formData[field.name] || [{}];
    
    return (
      <div className="repeatable-field">
        {items.map((item, index) => (
          <div key={index} className="repeatable-item">
            <div className="repeatable-header">
              <h4>{field.label} #{index + 1}</h4>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const newItems = items.filter((_, i) => i !== index);
                    handleChange(field.name, newItems);
                  }}
                  className="btn-remove"
                >
                  Remove
                </button>
              )}
            </div>
            
            {field.fields?.map(subField => (
              <div key={subField.name} className="form-group">
                <label>{subField.label}</label>
                <input
                  type={subField.type}
                  value={item[subField.name] || ''}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, [subField.name]: e.target.value };
                    handleChange(field.name, newItems);
                  }}
                  placeholder={subField.placeholder}
                  required={subField.required}
                  className="form-input"
                />
              </div>
            ))}
          </div>
        ))}
        
        {items.length < (field.maxItems || 10) && (
          <button
            type="button"
            onClick={() => handleChange(field.name, [...items, {}])}
            className="btn-add"
          >
            + Add {field.label}
          </button>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="dynamic-form">
      <div className="form-header">
        <h2>{formConfig.title}</h2>
        {formConfig.description && <p>{formConfig.description}</p>}
      </div>
      
      {formConfig.sections.map(section => (
        <div key={section.id} className="form-section">
          <h3>{section.title}</h3>
          {section.description && <p className="section-description">{section.description}</p>}
          
          {section.fields.map(field => (
            <div key={field.name} className="form-group">
              {field.type !== 'checkbox' && (
                <label className="form-label">
                  {field.label}
                  {field.required && <span className="required">*</span>}
                </label>
              )}
              
              {renderField(field)}
              
              {field.helpText && <p className="help-text">{field.helpText}</p>}
              {errors[field.name] && <p className="error-text">{errors[field.name]}</p>}
            </div>
          ))}
        </div>
      ))}
      
      {formConfig.payment && formConfig.payment.required && (
        <div className="form-section payment-section">
          <h3>Payment Required</h3>
          <p className="payment-amount">
            Amount: <strong>{formConfig.payment.amount} {formConfig.payment.currency}</strong>
          </p>
          <p>{formConfig.payment.description}</p>
        </div>
      )}
      
      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={submitting}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Submitting...' : formConfig.submit?.label || 'Submit'}
        </button>
      </div>
    </form>
  );
}