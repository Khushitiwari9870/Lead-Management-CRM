import React, { useState, useEffect } from 'react';
import API from '../services/api';

const LeadDetails = ({ leadId, onBack }) => {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Note editing state
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch lead details
  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/${leadId}`);
        setLead(response.data);
        setNotes(response.data.notes || '');
      } catch (err) {
        console.error('Error fetching lead details:', err);
        setError(err.response?.data?.message || 'Failed to fetch lead details.');
      } finally {
        setLoading(false);
      }
    };

    if (leadId) {
      fetchLeadDetails();
    }
  }, [leadId]);

  // Handle saving notes
  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      const response = await API.put(`/${leadId}`, { notes });
      setLead(response.data);
      setToastMessage('Notes updated successfully!');
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      console.error('Error saving notes:', err);
      alert(err.response?.data?.message || 'Failed to save notes.');
    } finally {
      setSavingNotes(false);
    }
  };

  // Quick status update on details page
  const handleStatusChange = async (newStatus) => {
    try {
      const response = await API.put(`/${leadId}`, { status: newStatus });
      setLead(response.data);
      setToastMessage(`Status changed to ${newStatus}`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-secondary mt-3">Fetching profile details...</p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="container py-5">
        <div className="glass-card p-5 text-center">
          <i className="bi bi-exclamation-triangle-fill text-danger display-3 mb-3"></i>
          <h4 className="text-white">Profile Load Error</h4>
          <p className="text-secondary">{error || 'Lead profile not found.'}</p>
          <button onClick={onBack} className="btn btn-outline-glass mt-3">
            <i className="bi bi-arrow-left me-2"></i> Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container pb-5 animate-fade-in">
      {/* Toast Alert Header */}
      {toastMessage && (
        <div className="alert alert-success bg-success bg-opacity-25 border-0 text-white p-3 mb-4 rounded-3 d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill text-success"></i>
          <span className="small fw-medium">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-4">
        <button onClick={onBack} className="btn btn-outline-glass mb-3 d-flex align-items-center gap-2">
          <i className="bi bi-arrow-left"></i> Back to Dashboard
        </button>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h2 className="fw-bold mb-0 text-white">Lead Workspace</h2>
          <span className="text-secondary small font-monospace">Lead ID: {lead._id}</span>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Lead card Profile Details */}
        <div className="col-lg-4">
          <div className="glass-card p-4 h-100">
            <div className="text-center pb-4 border-bottom border-secondary border-opacity-10">
              <div 
                className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3 text-white" 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  fontSize: '2.5rem',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)'
                }}
              >
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <h4 className="fw-bold mb-1 text-white">{lead.name}</h4>
              <p className="text-secondary mb-0 small">
                <i className="bi bi-building me-1"></i> {lead.company || 'Independent Lead'}
              </p>
            </div>

            <div className="py-4 border-bottom border-secondary border-opacity-10">
              <h6 className="text-secondary small fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.05em' }}>
                Contact Info
              </h6>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded bg-secondary bg-opacity-10 text-secondary" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-envelope"></i>
                  </div>
                  <div>
                    <span className="text-secondary small d-block">Email</span>
                    <a href={`mailto:${lead.email}`} className="text-white text-decoration-none small hover-link">
                      {lead.email}
                    </a>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded bg-secondary bg-opacity-10 text-secondary" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-telephone"></i>
                  </div>
                  <div>
                    <span className="text-secondary small d-block">Phone</span>
                    <a href={`tel:${lead.phone}`} className="text-white text-decoration-none small hover-link">
                      {lead.phone || '—'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h6 className="text-secondary small fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.05em' }}>
                Pipeline Placement
              </h6>
              <div className="d-flex flex-column gap-3">
                <div>
                  <label className="text-secondary small mb-2 d-block">Lead Status</label>
                  <select
                    className={`form-select custom-select py-1 status-badge status-${lead.status.toLowerCase()}`}
                    value={lead.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    style={{ width: '100%', backgroundPosition: 'right 0.75rem center' }}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Converted">Converted</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div>
                  <span className="text-secondary small d-block mb-1">Created Date</span>
                  <span className="text-white small">
                    {new Date(lead.createdAt).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Notes / Interaction Timeline */}
        <div className="col-lg-8">
          <div className="glass-card p-4 h-100 d-flex flex-column">
            <h5 className="fw-bold mb-3 text-white">
              <i className="bi bi-journal-text me-2" style={{ color: '#a78bfa' }}></i> Notes & Interactivity log
            </h5>
            <p className="text-secondary small mb-4">
              Document meetings, calls, value predictions, and specific lead requests below.
            </p>

            <div className="flex-grow-1 mb-4 d-flex flex-column">
              <textarea
                className="form-control custom-textarea flex-grow-1 p-3"
                rows="8"
                style={{ resize: 'none', minHeight: '200px' }}
                placeholder="Log customer discussions, notes, requirements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            <div className="d-flex justify-content-end">
              <button 
                type="button" 
                onClick={handleSaveNotes} 
                disabled={savingNotes}
                className="btn btn-gradient d-flex align-items-center gap-2"
              >
                {savingNotes ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save"></i> Save Notes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
