import React from 'react';

const LeadCard = ({ title, value, icon, color, gradient }) => {
  return (
    <div className="glass-card h-100 p-4 d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-between w-100">
        <div>
          <span className="text-secondary small fw-medium uppercase mb-1 d-block" style={{ letterSpacing: '0.05em' }}>
            {title}
          </span>
          <h2 className="fw-bold mb-0 text-white" style={{ fontSize: '2rem' }}>
            {value}
          </h2>
        </div>
        <div 
          className="stat-icon-wrapper" 
          style={{ 
            background: gradient || 'rgba(255, 255, 255, 0.05)',
            boxShadow: gradient ? `0 8px 20px ${color}33` : 'none',
            color: color || '#fff'
          }}
        >
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
