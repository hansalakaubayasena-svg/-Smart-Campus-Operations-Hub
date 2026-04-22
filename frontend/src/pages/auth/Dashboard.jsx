import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../index.css';
import {
  Building2,
  CalendarCheck,
  AlertTriangle,
  Bell,
  Activity,
  Plus,
  ShieldCheck,
  Search,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { getUsers } from '../../services/auth/authService';
import { getTickets } from '../../services/incidents/ticketService';

const getStatusBadgeClass = (status) => {
  if (status === 'RESOLVED' || status === 'CLOSED') return 'success';
  if (status === 'IN_PROGRESS') return 'warning';
  if (status === 'REJECTED') return 'danger';
  return 'danger';
};

const getTicketSubtitle = (ticket) => {
  if (ticket.status === 'REJECTED') {
    return ticket.rejectionReason || 'Ticket was rejected by the admin team.';
  }
  return ticket.resolutionNotes || `Priority ${ticket.priority} • Waiting for technician update`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeUserId, setActiveUserId] = useState('');
  const [loading, setLoading] = useState(true);

  const activeUser = useMemo(
    () => users.find((user) => String(user.id) === String(activeUserId)),
    [users, activeUserId],
  );

  const visibleTickets = useMemo(() => {
    if (activeUser?.role === 'USER') {
      return tickets.filter((ticket) => ticket.createdByUserId === activeUser.id);
    }
    return tickets;
  }, [tickets, activeUser]);

  const openIncidentCount = visibleTickets.filter((ticket) => ['OPEN', 'IN_PROGRESS'].includes(ticket.status)).length;
  const resolvedIncidentCount = visibleTickets.filter((ticket) => ticket.status === 'RESOLVED').length;
  const incidentPreview = visibleTickets.slice(0, 3);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [userData, ticketData] = await Promise.all([getUsers(), getTickets()]);
      setUsers(userData);
      setTickets(ticketData);
      if (!activeUserId) {
        const defaultUser = userData.find((user) => user.role === 'USER') || userData[0];
        if (defaultUser) {
          setActiveUserId(String(defaultUser.id));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeUserId) {
      loadDashboardData();
    }
  }, [activeUserId]);

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="title-group">
          <h1>Smart Campus Operations Hub</h1>
          <p>
            {activeUser
              ? `Welcome back, ${activeUser.username} (${activeUser.role})`
              : 'Select a demo user to see dashboard updates'}
          </p>
        </div>
        <div className="control-strip">
          <label className="actor-select">
            Active Demo User
            <select value={activeUserId} onChange={(event) => setActiveUserId(event.target.value)}>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.role})
                </option>
              ))}
            </select>
          </label>
          <button className="ghost-btn" onClick={loadDashboardData}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <div className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <Search size={18} />
          </div>
          <button className="btn" onClick={() => navigate('/incidents')}>
            Ticket Centre
            <Plus size={18} style={{ marginLeft: '10px' }} />
          </button>
          <div className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.8rem' }}>
            <Bell size={18} />
          </div>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate('/facilities')}>
          <h3>Facilities Catalogue</h3>
          <div className="value">124</div>
          <div className="trend" style={{ color: 'var(--success)' }}>
            <Building2 size={16} /> Module A - Assets
          </div>
        </div>
        <div className="stat-card" onClick={() => navigate('/bookings')}>
          <h3>Active Bookings</h3>
          <div className="value">37</div>
          <div className="trend" style={{ color: 'var(--primary)' }}>
            <CalendarCheck size={16} /> Module B - Workflow
          </div>
        </div>
        <div className="stat-card" onClick={() => navigate('/incidents')}>
          <h3>{activeUser?.role === 'USER' ? 'My Open Tickets' : 'Open Incidents'}</h3>
          <div className="value">{loading ? '--' : openIncidentCount}</div>
          <div className="trend" style={{ color: 'var(--danger)' }}>
            <AlertTriangle size={16} /> Module C - Maintenance
          </div>
        </div>
        <div className="stat-card" onClick={() => navigate('/incidents')}>
          <h3>Resolved Updates</h3>
          <div className="value" style={{ fontSize: '1.8rem', marginTop: '1rem' }}>{loading ? '--' : resolvedIncidentCount}</div>
          <div className="trend" style={{ color: 'var(--success)' }}>
            <ShieldCheck size={16} /> Latest Technician Solutions
          </div>
        </div>
      </div>

      <div className="modules-section">
        <div className="module-card">
          <h2><Activity size={20} /> Latest Bookings (Module B)</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="info">
                <h4>Lecture Hall B-102</h4>
                <span>10:30 AM - Today • Webinar</span>
              </div>
              <span className="status-badge">Approved</span>
            </div>
            <div className="activity-item">
              <div className="info">
                <h4>Projector P-009</h4>
                <span>02:00 PM - Tomorrow • Presentation</span>
              </div>
              <span className="status-badge warning">Pending</span>
            </div>
            <div className="activity-item">
              <div className="info">
                <h4>Chemistry Lab 4</h4>
                <span>09:00 AM - April 10 • Experiment</span>
              </div>
              <span className="status-badge">Approved</span>
            </div>
          </div>
          <button className="btn" onClick={() => navigate('/bookings')} style={{ width: '100%', marginTop: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
            View All Bookings
          </button>
        </div>

        <div className="module-card">
          <h2><Settings size={20} /> {activeUser?.role === 'USER' ? 'My Ticket Updates (Module C)' : 'Incident Reports (Module C)'}</h2>
          <p className="subtle-text" style={{ marginBottom: '1rem' }}>
            {activeUser?.role === 'USER'
              ? 'Technician updates and solutions for your raised tickets appear here.'
              : 'Latest incident queue with technician updates and current ticket status.'}
          </p>
          <div className="activity-list">
            {!loading && incidentPreview.length === 0 ? (
              <div className="activity-item">
                <div className="info">
                  <h4>No incident tickets yet</h4>
                  <span>Create a ticket from Module C to see technician updates here.</span>
                </div>
                <span className="status-badge">Empty</span>
              </div>
            ) : null}
            {incidentPreview.map((ticket) => (
              <div
                key={ticket.id}
                className="activity-item"
                style={{
                  borderLeftColor:
                    ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                      ? 'var(--success)'
                      : ticket.status === 'IN_PROGRESS'
                        ? 'var(--warning)'
                        : 'var(--danger)',
                }}
              >
                <div className="info">
                  <h4>#{ticket.id} {ticket.category}</h4>
                  <span>{ticket.location}</span>
                  <span>{getTicketSubtitle(ticket)}</span>
                </div>
                <span className={`status-badge ${getStatusBadgeClass(ticket.status)}`}>{ticket.status}</span>
              </div>
            ))}
          </div>
          <button className="btn" onClick={() => navigate('/incidents')} style={{ width: '100%', marginTop: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
            Open Ticket Centre
          </button>
        </div>
      </div>

      <footer style={{ marginTop: '4rem', padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        &copy; 2026 Smart Campus Operations Hub | IT3030 Assignment | Team Group XX
      </footer>
    </div>
  );
};

export default Dashboard;
