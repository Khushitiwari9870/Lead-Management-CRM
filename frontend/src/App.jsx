import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LeadDetails from './pages/LeadDetails';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [addLeadTrigger, setAddLeadTrigger] = useState(0);

  const handleViewDetails = (leadId) => {
    setSelectedLeadId(leadId);
    setCurrentPage('details');
  };

  const handleBackToDashboard = () => {
    setSelectedLeadId(null);
    setCurrentPage('dashboard');
  };

  const handleAddLeadClick = () => {
    if (currentPage !== 'dashboard') {
      setCurrentPage('dashboard');
    }
    setAddLeadTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar onAddLeadClick={handleAddLeadClick} />
      
      <main className="flex-grow-1">
        {currentPage === 'dashboard' ? (
          <Dashboard 
            onViewLeadDetails={handleViewDetails} 
            addLeadTrigger={addLeadTrigger}
          />
        ) : (
          <LeadDetails 
            leadId={selectedLeadId} 
            onBack={handleBackToDashboard} 
          />
        )}
      </main>
      
      <footer className="py-4 text-center mt-auto" style={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.05)', 
        backgroundColor: 'rgba(11, 15, 25, 0.4)' 
      }}>
        <p className="text-secondary small mb-0">
          © {new Date().getFullYear()} LeadFlow CRM. All rights reserved. Built with the MERN Stack.
        </p>
      </footer>
    </div>
  );
}

export default App;
