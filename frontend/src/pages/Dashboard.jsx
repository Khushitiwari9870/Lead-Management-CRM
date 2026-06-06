import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import LeadCard from '../components/LeadCard';
import LeadForm from '../components/LeadForm';

const Dashboard = ({ onViewLeadDetails, addLeadTrigger }) => {
  // Leads data states
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ New: 0, Contacted: 0, Qualified: 0, Converted: 0, Lost: 0, Total: 0 });
  const [loading, setLoading] = useState(true);

  // Monitor header triggers to open add lead form
  useEffect(() => {
    if (addLeadTrigger > 0) {
      setEditingLead(null);
      setShowForm(true);
    }
  }, [addLeadTrigger]);

  // Search, filter, sorting, and pagination states
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [limit, setLimit] = useState(7);

  // Modal / Form states
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Trigger Toast helper
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page to 1 when search changes
    }, 450);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch leads function
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get('/', {
        params: {
          search: debouncedSearch,
          status: statusFilter,
          sort: sortField,
          order: sortOrder,
          page,
          limit,
        },
      });

      setLeads(response.data.leads || []);
      setTotalPages(response.data.pages || 1);
      setTotalLeads(response.data.total || 0);
      if (response.data.stats) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      triggerToast(
        error.response?.data?.message || 'Failed to fetch leads. Verify server connection.',
        'danger'
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, sortField, sortOrder, page, limit]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Handle lead form submit
  const handleFormSubmit = async (formData) => {
    try {
      if (editingLead) {
        // Edit lead
        await API.put(`/${editingLead._id}`, formData);
        triggerToast('Lead updated successfully!');
      } else {
        // Add lead
        await API.post('/', formData);
        triggerToast('New lead created successfully!');
      }
      setShowForm(false);
      setEditingLead(null);
      fetchLeads();
    } catch (error) {
      console.error('Form submission error:', error);
      triggerToast(error.response?.data?.message || 'Failed to save lead details.', 'danger');
    }
  };

  // Handle lead deletion
  const handleDeleteLead = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await API.delete(`/${leadId}`);
        triggerToast('Lead deleted successfully!', 'warning');
        fetchLeads();
      } catch (error) {
        console.error('Delete lead error:', error);
        triggerToast(error.response?.data?.message || 'Failed to delete lead.', 'danger');
      }
    }
  };

  // Quick status update from table row
  const handleQuickStatusUpdate = async (leadId, newStatus) => {
    try {
      await API.put(`/${leadId}`, { status: newStatus });
      triggerToast(`Lead status updated to ${newStatus}`);
      fetchLeads();
    } catch (error) {
      console.error('Status update error:', error);
      triggerToast(error.response?.data?.message || 'Failed to update status.', 'danger');
    }
  };

  // Handle Column Header Sorting click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  // Trigger form in create mode
  const openCreateModal = () => {
    setEditingLead(null);
    setShowForm(true);
  };

  // Trigger form in edit mode
  const openEditModal = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  return (
    <div className="container pb-5">
      {/* Dynamic Navbar Integration Trigger */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-white">Pipeline Dashboard</h2>
          <p className="text-secondary mb-0">Overview of active pipeline leads, statuses, and performance.</p>
        </div>
        <div>
          <button onClick={openCreateModal} className="btn btn-gradient d-flex align-items-center gap-2">
            <i className="bi bi-plus-lg"></i> Add New Lead
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="row g-4 mb-5 animate-fade-in">
        <div className="col-md-6 col-lg-3">
          <LeadCard 
            title="Total Pipeline" 
            value={stats.Total} 
            icon="bi-funnel-fill" 
            color="#3b82f6" 
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <LeadCard 
            title="Qualified Leads" 
            value={stats.Qualified} 
            icon="bi-check-circle-fill" 
            color="#f59e0b"
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <LeadCard 
            title="Deals Won" 
            value={stats.Converted} 
            icon="bi-emoji-smile-fill" 
            color="#10b981"
            gradient="linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)"
          />
        </div>
        <div className="col-md-6 col-lg-3">
          <LeadCard 
            title="Deals Lost" 
            value={stats.Lost} 
            icon="bi-x-circle-fill" 
            color="#ef4444"
          />
        </div>
      </div>

      {/* Leads Table Management Panel */}
      <div className="glass-card p-4 mb-4 animate-fade-in">
        <div className="row g-3 justify-content-between align-items-center mb-4">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <i className="bi bi-search text-secondary"></i>
              </span>
              <input
                type="text"
                className="form-control custom-input border-start-0 ps-0"
                placeholder="Search leads by name, email, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-7 d-flex gap-3 justify-content-md-end flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary small">Filter:</span>
              <select
                className="form-select custom-select py-1 px-3"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                style={{ width: '150px' }}
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary small">Show:</span>
              <select
                className="form-select custom-select py-1 px-3"
                value={limit}
                onChange={(e) => { setLimit(parseInt(e.target.value)); setPage(1); }}
                style={{ width: '80px' }}
              >
                <option value={5}>5</option>
                <option value={7}>7</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Data View */}
        <div className="table-responsive">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-secondary mt-3 mb-0">Loading pipeline leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-folder2-open display-4 text-secondary opacity-50 mb-3 d-block"></i>
              <p className="text-secondary fs-5 mb-1">No leads found</p>
              <p className="text-secondary small mb-3">Try adjusting your filters or search keywords.</p>
              <button onClick={openCreateModal} className="btn btn-outline-glass btn-sm">
                Create First Lead
              </button>
            </div>
          ) : (
            <table className="table custom-table align-middle">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Name {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                    Email {sortField === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('phone')} style={{ cursor: 'pointer' }}>
                    Phone
                  </th>
                  <th onClick={() => handleSort('company')} style={{ cursor: 'pointer' }}>
                    Company {sortField === 'company' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                    Status {sortField === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
                    Created Date {sortField === 'createdAt' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <a
                        href={`/lead/${lead._id}`}
                        onClick={(e) => { e.preventDefault(); onViewLeadDetails(lead._id); }}
                        className="fw-semibold text-white text-decoration-none hover-link"
                        style={{ transition: 'color 0.2s' }}
                      >
                        {lead.name}
                      </a>
                    </td>
                    <td><span className="text-secondary">{lead.email}</span></td>
                    <td><span className="text-secondary">{lead.phone || '—'}</span></td>
                    <td><span className="text-secondary">{lead.company || '—'}</span></td>
                    <td>
                      <select
                        className={`form-select bg-transparent border-0 p-0 fw-medium status-badge status-${lead.status.toLowerCase()}`}
                        value={lead.status}
                        onChange={(e) => handleQuickStatusUpdate(lead._id, e.target.value)}
                        style={{ cursor: 'pointer', width: 'auto', backgroundPosition: 'right center' }}
                      >
                        <option value="New" className="bg-dark text-white">New</option>
                        <option value="Contacted" className="bg-dark text-white">Contacted</option>
                        <option value="Qualified" className="bg-dark text-white">Qualified</option>
                        <option value="Converted" className="bg-dark text-white">Converted</option>
                        <option value="Lost" className="bg-dark text-white">Lost</option>
                      </select>
                    </td>
                    <td>
                      <span className="text-secondary font-monospace small">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button
                          onClick={() => onViewLeadDetails(lead._id)}
                          className="btn btn-sm btn-outline-glass text-info p-1 px-2"
                          title="View Details"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          onClick={() => openEditModal(lead)}
                          className="btn btn-sm btn-outline-glass text-warning p-1 px-2"
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead._id)}
                          className="btn btn-sm btn-outline-glass text-danger p-1 px-2"
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Section */}
        {leads.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
            <span className="text-secondary small">
              Showing <span className="text-white">{(page - 1) * limit + 1}</span> to{' '}
              <span className="text-white">{Math.min(page * limit, totalLeads)}</span> of{' '}
              <span className="text-white">{totalLeads}</span> leads
            </span>

            <nav aria-label="Lead table navigation">
              <ul className="pagination custom-pagination mb-0">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>&laquo;</button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>&raquo;</button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Lead Create/Edit Form Modal */}
      <LeadForm
        show={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        lead={editingLead}
      />

      {/* Floating Toast Notification Containers */}
      <div 
        className="toast-container position-fixed bottom-0 end-0 p-3" 
        style={{ zIndex: 1100 }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast show border-0 glass-card bg-${toast.type} bg-opacity-25 animate-fade-in`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex align-items-center justify-content-between p-3">
              <div className="d-flex align-items-center gap-2 text-white">
                <i className={`bi ${
                  toast.type === 'success' ? 'bi-check-circle-fill text-success' :
                  toast.type === 'warning' ? 'bi-exclamation-triangle-fill text-warning' :
                  'bi-x-circle-fill text-danger'
                }`}></i>
                <span className="small fw-medium">{toast.message}</span>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white ms-auto"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              ></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
