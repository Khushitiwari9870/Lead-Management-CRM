import React from 'react';

const Navbar = ({ onAddLeadClick }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark py-3 mb-4 sticky-top" style={{
      background: 'rgba(11, 15, 25, 0.75)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      zIndex: 1020
    }}>
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="/" onClick={(e) => e.preventDefault()}>
          <div className="p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ 
            width: '40px', 
            height: '40px', 
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}>
            <i className="bi bi-funnel-fill text-white fs-5"></i>
          </div>
          <span className="fw-bold text-white fs-4" style={{ letterSpacing: '-0.02em' }}>
            LeadFlow <span style={{ color: '#a78bfa' }}>CRM</span>
          </span>
        </a>
        
        <div>
          <button 
            onClick={onAddLeadClick}
            className="btn btn-gradient d-flex align-items-center gap-2"
          >
            <i className="bi bi-plus-lg"></i> 
            <span className="d-none d-sm-inline">Add New Lead</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
