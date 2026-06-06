import React, { useState, useEffect } from 'react';

const LeadForm = ({ show, onClose, onSubmit, lead }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status || 'New',
        notes: lead.notes || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'New',
        notes: '',
      });
    }
    setErrors({});
  }, [lead, show]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-backdrop-custom" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(5, 7, 12, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      padding: '1rem'
    }}>
      <div className="glass-card p-4 animate-fade-in w-100" style={{ 
        maxWidth: '550px',
        backgroundColor: '#161c2d',
        borderColor: 'rgba(255, 255, 255, 0.12)'
      }} onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0 text-white">
            <i className={`bi ${lead ? 'bi-pencil-square' : 'bi-person-plus-fill'} me-2`} style={{ color: '#a78bfa' }}></i>
            {lead ? 'Edit Lead Details' : 'Add New Lead'}
          </h4>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-close btn-close-white" 
            aria-label="Close"
          ></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label text-secondary small fw-medium">Name <span className="text-danger">*</span></label>
              <input
                type="text"
                name="name"
                className={`form-control custom-input ${errors.name ? 'is-invalid' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
              {errors.name && <div className="invalid-feedback text-danger mt-1 small">{errors.name}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label text-secondary small fw-medium">Email Address <span className="text-danger">*</span></label>
              <input
                type="email"
                name="email"
                className={`form-control custom-input ${errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
              {errors.email && <div className="invalid-feedback text-danger mt-1 small">{errors.email}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label text-secondary small fw-medium">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-control custom-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 019-2834"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-secondary small fw-medium">Company Name</label>
              <input
                type="text"
                name="company"
                className="form-control custom-input"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Corp"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label text-secondary small fw-medium">Lead Status</label>
              <select
                name="status"
                className="form-select custom-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label text-secondary small fw-medium">Notes</label>
              <textarea
                name="notes"
                className="form-control custom-textarea"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter any relevant background, discussions, or comments..."
              ></textarea>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-3 mt-4 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-outline-glass"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-gradient">
              {lead ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
