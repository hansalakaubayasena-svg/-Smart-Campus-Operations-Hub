import React from 'react';
import '../../index.css';
import { 
  Building2, 
  CalendarCheck, 
  AlertTriangle, 
  Bell, 
  Activity, 
  Plus, 
  LayoutDashboard,
  ShieldCheck,
  Search,
  Settings
} from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="header">
                <div className="title-group">
                    <h1>Smart Campus Operations Hub</h1>
                    <p>Welcome back, Administrator</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                        <Search size={18} />
                    </div>
                    <button className="btn">
                        Add Resource
                        <Plus size={18} style={{ marginLeft: '10px' }} />
                    </button>
                    <div className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '0.8rem' }}>
                        <Bell size={18} />
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Facilities Catalogue</h3>
                    <div className="value">124</div>
                    <div className="trend" style={{ color: 'var(--success)' }}>
                        <Building2 size={16} /> Module A - Assets
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Active Bookings</h3>
                    <div className="value">37</div>
                    <div className="trend" style={{ color: 'var(--primary)' }}>
                        <CalendarCheck size={16} /> Module B - Workflow
                    </div>
                </div>
                <div className="stat-card">
                    <h3>Open Incidents</h3>
                    <div className="value">08</div>
                    <div className="trend" style={{ color: 'var(--danger)' }}>
                        <AlertTriangle size={16} /> Module C - Maintenance
                    </div>
                </div>
                <div className="stat-card">
                    <h3>System Status</h3>
                    <div className="value" style={{ fontSize: '1.5rem', marginTop: '1rem' }}>SAFE</div>
                    <div className="trend" style={{ color: 'var(--success)' }}>
                        <ShieldCheck size={16} /> Module D - Auth Ready
                    </div>
                </div>
            </div>

            {/* Modules and Activity Section */}
            <div className="modules-section">
                {/* Recent Bookings Module */}
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
                    <button className="btn" style={{ width: '100%', marginTop: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                        View All Bookings
                    </button>
                </div>

                {/* Maintenance Tickets Module */}
                <div className="module-card">
                    <h2><Settings size={20} /> Incident Reports (Module C)</h2>
                    <div className="activity-list">
                        <div className="activity-item" style={{ borderLeftColor: 'var(--danger)' }}>
                            <div className="info">
                                <h4>AC Leakage - Room 204</h4>
                                <span>Urgent • Reported 2h ago</span>
                            </div>
                            <span className="status-badge danger">Open</span>
                        </div>
                        <div className="activity-item" style={{ borderLeftColor: 'var(--warning)' }}>
                            <div className="info">
                                <h4>Broken Projector - Hall A</h4>
                                <span>Medium • Assigned to Technician</span>
                            </div>
                            <span className="status-badge warning">In Progress</span>
                        </div>
                        <div className="activity-item" style={{ borderLeftColor: 'var(--success)' }}>
                            <div className="info">
                                <h4>Network Issue Fixed</h4>
                                <span>Resolved • Lab 02</span>
                            </div>
                            <span className="status-badge success">Resolved</span>
                        </div>
                    </div>
                    <button className="btn" style={{ width: '100%', marginTop: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>
                        Manage Tickets
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
