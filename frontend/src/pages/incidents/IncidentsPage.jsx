import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Shield, UserCog, Wrench } from 'lucide-react';
import TicketForm from '../../components/incidents/TicketForm';
import { getUsers } from '../../services/auth/authService';
import {
  assignTicket,
  createTicket,
  getTickets,
  updateTicketStatus,
} from '../../services/incidents/ticketService';

const statusMessages = {
  OPEN: 'Your ticket has been received and is waiting for staff attention.',
  IN_PROGRESS: 'A technician is actively checking the issue and working on a solution.',
  RESOLVED: 'The technician has marked this issue as solved and shared the solution below.',
  CLOSED: 'This issue is completed and closed.',
  REJECTED: 'This ticket was rejected by the admin team.',
};

const nextStepMessages = {
  OPEN: 'Our support team will review your request and assign it to a technician.',
  IN_PROGRESS: 'Please wait while the technician continues the work and sends the next update.',
  RESOLVED: 'Review the solution from the technician. If everything is fine, the ticket can be closed.',
  CLOSED: 'This support request is complete.',
  REJECTED: 'Please review the rejection reason and raise a new ticket if needed.',
};

const getTechnicianResponse = (ticket) => {
  if (ticket.status === 'REJECTED') {
    return ticket.rejectionReason || 'No rejection reason was provided.';
  }
  return ticket.resolutionNotes || 'No response from technician yet.';
};

const IncidentsPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [activeUserId, setActiveUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [statusForm, setStatusForm] = useState({ status: 'IN_PROGRESS', solutionText: '', rejectionReason: '' });

  const activeUser = useMemo(
    () => users.find((user) => String(user.id) === String(activeUserId)),
    [users, activeUserId],
  );

  const canCreateTickets = activeUser?.role === 'USER';
  const canManageWorkflow = activeUser?.role === 'TECHNICIAN' || activeUser?.role === 'ADMIN';
  const canAssignTickets = activeUser?.role === 'ADMIN';
  const visibleTickets = useMemo(() => {
    if (activeUser?.role === 'USER') {
      return tickets.filter((ticket) => ticket.createdByUserId === activeUser.id);
    }
    return tickets;
  }, [tickets, activeUser]);

  const selectedTicket = useMemo(
    () => visibleTickets.find((ticket) => ticket.id === selectedTicketId) || visibleTickets[0] || null,
    [visibleTickets, selectedTicketId],
  );

  const allowedStatusOptions = useMemo(() => {
    if (!selectedTicket) return [];

    if (selectedTicket.status === 'OPEN') {
      return activeUser?.role === 'ADMIN' ? ['IN_PROGRESS', 'REJECTED'] : ['IN_PROGRESS'];
    }
    if (selectedTicket.status === 'IN_PROGRESS') {
      return activeUser?.role === 'ADMIN' ? ['RESOLVED', 'REJECTED'] : ['RESOLVED'];
    }
    if (selectedTicket.status === 'RESOLVED') {
      return activeUser?.role === 'ADMIN' ? ['CLOSED', 'REJECTED'] : ['CLOSED'];
    }
    return [];
  }, [selectedTicket, activeUser]);

  const technicianUpdateLabel =
    statusForm.status === 'RESOLVED'
      ? 'Final Solution For User'
      : statusForm.status === 'REJECTED'
        ? 'Admin Decision Update'
        : 'Technician Progress Update';
  const technicianUpdatePlaceholder =
    statusForm.status === 'RESOLVED'
      ? 'Explain clearly what was fixed and the final solution given to the user.'
      : statusForm.status === 'REJECTED'
        ? 'Explain clearly why this ticket cannot be processed.'
        : 'Explain what the technician checked, what is happening now, and what the user should know.';

  const staffUsers = useMemo(
    () => users.filter((user) => ['TECHNICIAN', 'ADMIN'].includes(user.role)),
    [users],
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [userData, ticketData] = await Promise.all([getUsers(), getTickets()]);
      setUsers(userData);
      setTickets(ticketData);
      if (!activeUserId && userData.length > 0) {
        setActiveUserId(String(userData[0].id));
      }
      if (ticketData.length > 0) {
        setSelectedTicketId((current) => current || ticketData[0].id);
      }
      setFeedback('');
    } catch (error) {
      setFeedback('Backend connection failed. Start Spring Boot on port 8080 and refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      setStatusForm({
        status:
          selectedTicket.status === 'OPEN'
            ? 'IN_PROGRESS'
            : selectedTicket.status === 'IN_PROGRESS'
              ? 'RESOLVED'
              : selectedTicket.status === 'RESOLVED'
                ? 'CLOSED'
                : selectedTicket.status,
        solutionText: selectedTicket.resolutionNotes || '',
        rejectionReason: selectedTicket.rejectionReason || '',
      });
      setShowSolutionForm(false);
    }
  }, [selectedTicket]);

  useEffect(() => {
    if (allowedStatusOptions.length > 0 && !allowedStatusOptions.includes(statusForm.status)) {
      setStatusForm((current) => ({
        ...current,
        status: allowedStatusOptions[0],
      }));
    }
  }, [allowedStatusOptions, statusForm.status]);

  useEffect(() => {
    if (!visibleTickets.some((ticket) => ticket.id === selectedTicketId)) {
      setSelectedTicketId(visibleTickets[0]?.id ?? null);
    }
  }, [visibleTickets, selectedTicketId]);

  useEffect(() => {
    if (activeUserId) {
      loadData();
    }
  }, [activeUserId]);

  const handleCreateTicket = async (payload) => {
    setSubmitting(true);
    try {
      await createTicket(payload);
      await loadData();
      setFeedback('Incident ticket created successfully.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssign = async (assigneeUserId) => {
    if (!selectedTicket || !activeUserId) return;
    const updatedTicket = await assignTicket(selectedTicket.id, {
      adminUserId: Number(activeUserId),
      assigneeUserId: Number(assigneeUserId),
    });
    setTickets((current) => current.map((ticket) => (ticket.id === updatedTicket.id ? updatedTicket : ticket)));
    setFeedback('Technician assignment updated.');
    await loadData();
  };

  const handleStatusUpdate = async () => {
    if (!selectedTicket || !activeUserId) return;
    setSubmitting(true);
    try {
      const updatedTicket = await updateTicketStatus(selectedTicket.id, {
        actorUserId: Number(activeUserId),
        status: statusForm.status,
        resolutionNotes: statusForm.solutionText,
        rejectionReason: statusForm.status === 'REJECTED' ? statusForm.rejectionReason : '',
      });
      setTickets((current) => current.map((ticket) => (ticket.id === updatedTicket.id ? updatedTicket : ticket)));
      setSelectedTicketId(updatedTicket.id);
      setFeedback('Technician update saved and shown to the user.');
      await loadData();
    } catch (error) {
      setFeedback(error?.response?.data?.message || 'Workflow update failed. Follow the allowed ticket flow.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="incidents-page">
      <header className="incidents-topbar">
        <div>
          <button className="ghost-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            Dashboard
          </button>
          <p className="eyebrow">Assignment Demo Flow</p>
          <h1>Maintenance & Incident Ticketing</h1>
          <p className="subtle-text">
            {canCreateTickets
              ? 'User view: raise incident tickets, track your own requests, and follow updates.'
              : canManageWorkflow
                ? 'Staff view: inspect reported incidents, update progress, and resolve assigned issues.'
                : 'Select a demo user to continue.'}
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
          <button className="ghost-btn" onClick={loadData}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </header>

      {feedback ? <div className="feedback-banner">{feedback}</div> : null}

      <div className="incidents-layout">
        <div className="left-column">
          {canCreateTickets ? (
            <TicketForm actorUserId={Number(activeUserId)} onSubmit={handleCreateTicket} submitting={submitting} />
          ) : (
            <section className="glass-panel role-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Signed In As</p>
                  <h2>{activeUser?.role || 'Guest'} Access</h2>
                </div>
                <span className={`status-chip ${canManageWorkflow ? 'in_progress' : 'closed'}`}>
                  {activeUser?.role || 'NONE'}
                </span>
              </div>
              <p className="subtle-text">
                {activeUser?.role === 'TECHNICIAN' && 'Technician accounts can inspect tickets, add internal updates, and move tickets through the workflow.'}
                {activeUser?.role === 'ADMIN' && 'Admin accounts can do technician actions and also assign tickets to available staff members.'}
                {!activeUser && 'Choose a user from the selector to unlock the correct incident experience.'}
              </p>
            </section>
          )}

          <section className="glass-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Current Queue</p>
                <h2>{canCreateTickets ? 'My Reported Tickets' : 'Reported Tickets'}</h2>
              </div>
              <span className="summary-pill">{visibleTickets.length} visible</span>
            </div>

            <div className="ticket-list">
              {loading ? <p className="subtle-text">Loading incident tickets...</p> : null}
              {!loading && visibleTickets.length === 0 ? (
                <p className="subtle-text">
                  {canCreateTickets ? 'You have not raised any tickets yet. Submit one using the form.' : 'No tickets are available right now.'}
                </p>
              ) : null}
              {visibleTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  className={`ticket-card ${selectedTicket?.id === ticket.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTicketId(ticket.id)}
                >
                  <div className="ticket-card-header">
                    <strong>#{ticket.id} {ticket.category}</strong>
                    <span className={`status-chip ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
                  </div>
                  <p>{ticket.location}</p>
                  <div className="ticket-meta">
                    <span>{ticket.priority}</span>
                    <span>{ticket.imageAttachments.length} attachments</span>
                    <span>{ticket.status}</span>
                  </div>
                  {canCreateTickets ? (
                    <div className="ticket-response-preview">
                      <span className="detail-label">Technician Response</span>
                      <p>{getTechnicianResponse(ticket)}</p>
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="right-column">
          <section className="glass-panel detail-panel">
            {!selectedTicket ? (
              <p className="subtle-text">Select a ticket to inspect workflow actions.</p>
            ) : (
              <>
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Ticket Detail</p>
                    <h2>{selectedTicket.category}</h2>
                  </div>
                  <span className={`status-chip ${selectedTicket.status.toLowerCase()}`}>{selectedTicket.status}</span>
                </div>

                <div className="detail-grid">
                  <div>
                    <span className="detail-label">Location</span>
                    <p>{selectedTicket.location}</p>
                  </div>
                  <div>
                    <span className="detail-label">Priority</span>
                    <p>{selectedTicket.priority}</p>
                  </div>
                  <div>
                    <span className="detail-label">Reported By</span>
                    <p>User #{selectedTicket.createdByUserId}</p>
                  </div>
                  <div>
                    <span className="detail-label">Assigned Staff</span>
                    <p>{selectedTicket.assignedStaffUserId ? `User #${selectedTicket.assignedStaffUserId}` : 'Unassigned'}</p>
                  </div>
                </div>

                <div className="stack-block">
                  <span className="detail-label">Description</span>
                  <p>{selectedTicket.description}</p>
                </div>

                <div className="stack-block">
                  <span className="detail-label">Preferred Contact</span>
                  <p>{selectedTicket.preferredContactName} • {selectedTicket.preferredContactEmail} • {selectedTicket.preferredContactPhone}</p>
                </div>

                {canCreateTickets ? (
                  <div className="user-ticket-portal">
                    <div className="support-response-panel">
                      <div className="resolved-notice-badge">Support Response</div>
                      <h3>Technician Response For Your Ticket</h3>
                      <p className="support-response-copy">
                        {getTechnicianResponse(selectedTicket)}
                      </p>
                    </div>

                    <div className="user-status-grid">
                      <div className="user-status-card">
                        <span className="detail-label">Ticket Status</span>
                        <strong>{selectedTicket.status}</strong>
                        <p>{statusMessages[selectedTicket.status]}</p>
                      </div>
                      <div className="user-status-card">
                        <span className="detail-label">Assigned Technician</span>
                        <strong>{selectedTicket.assignedStaffUserId ? `User #${selectedTicket.assignedStaffUserId}` : 'Pending Assignment'}</strong>
                        <p>The assigned support member handling this ticket.</p>
                      </div>
                      <div className="user-status-card">
                        <span className="detail-label">Next Step</span>
                        <strong>What happens next</strong>
                        <p>{nextStepMessages[selectedTicket.status]}</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="stack-block">
                  <span className="detail-label">Evidence Attachments</span>
                  <div className="attachment-pills">
                    {selectedTicket.imageAttachments.length === 0 ? <span className="summary-pill">No attachments</span> : null}
                    {selectedTicket.imageAttachments.map((attachment) => (
                      <a key={attachment} className="summary-pill" href={attachment} target="_blank" rel="noreferrer">
                        Open Evidence
                      </a>
                    ))}
                  </div>
                </div>

                {canAssignTickets ? (
                  <div className="action-panel">
                    <div className="action-title">
                      <UserCog size={18} />
                      <h3>Assignment</h3>
                    </div>
                    <p className="subtle-text">Admin accounts can assign a technician or staff member.</p>
                    <div className="inline-actions">
                      {staffUsers.map((user) => (
                        <button key={user.id} className="ghost-btn" onClick={() => handleAssign(user.id)}>
                          {user.username}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {canManageWorkflow ? (
                  <div className="action-panel">
                    <div className="action-title">
                      <Wrench size={18} />
                      <h3>Give Solution</h3>
                    </div>
                    <p className="subtle-text">
                      Open this section, write the solution, and set the current stage so the user can see it.
                    </p>
                    <div className="status-summary-grid">
                      <div className="status-summary-card">
                        <span className="detail-label">Current Stage</span>
                        <strong>{selectedTicket.status}</strong>
                        <p className="subtle-text">Current ticket condition.</p>
                      </div>
                      <div className="status-summary-card">
                        <span className="detail-label">Current Solution</span>
                        <strong>{selectedTicket.resolutionNotes ? 'Added' : 'Not Added'}</strong>
                        <p className="subtle-text">
                          {selectedTicket.resolutionNotes || 'No technician solution added yet.'}
                        </p>
                      </div>
                    </div>
                    <div className="inline-actions">
                      <button
                        className="btn"
                        onClick={() => setShowSolutionForm((current) => !current)}
                        disabled={allowedStatusOptions.length === 0}
                      >
                        {showSolutionForm ? 'Close Solution Form' : 'Give Solution'}
                      </button>
                    </div>
                    {showSolutionForm ? (
                      <>
                        <div className="form-grid compact">
                          <label>
                            Current Stage
                            <select
                              value={statusForm.status}
                              onChange={(event) => setStatusForm((current) => ({ ...current, status: event.target.value }))}
                            >
                              {allowedStatusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <p className="subtle-text">
                          Current ticket stage is <strong>{selectedTicket.status}</strong>. Next available stage:
                          {' '}
                          {allowedStatusOptions.length > 0 ? allowedStatusOptions.join(' or ') : 'No further updates allowed'}
                        </p>
                        <label>
                          {technicianUpdateLabel}
                          <textarea
                            rows={4}
                            value={statusForm.solutionText}
                            onChange={(event) => setStatusForm((current) => ({ ...current, solutionText: event.target.value }))}
                            placeholder={technicianUpdatePlaceholder}
                          />
                        </label>
                        {statusForm.status === 'REJECTED' ? (
                          <label>
                            Rejection Reason
                            <textarea
                              rows={2}
                              value={statusForm.rejectionReason}
                              onChange={(event) => setStatusForm((current) => ({ ...current, rejectionReason: event.target.value }))}
                              placeholder="Admin only when rejecting a ticket"
                            />
                          </label>
                        ) : null}
                        <p className="subtle-text">
                          The user will see this solution together with the updated stage.
                        </p>
                        <button className="btn" onClick={handleStatusUpdate} disabled={submitting || allowedStatusOptions.length === 0}>
                          {submitting ? 'Saving Solution...' : 'Save Solution'}
                        </button>
                      </>
                    ) : null}
                  </div>
                ) : (
                  <div className="action-panel">
                    <div className="action-title">
                      <Shield size={18} />
                      <h3>Workflow Visibility</h3>
                    </div>
                    <p className="subtle-text">
                      User accounts can monitor ticket progress, but only technicians and staff can manage or resolve issues.
                    </p>
                  </div>
                )}

                <div className="rubric-strip">
                  <div className="rubric-item"><Shield size={16} /> User sees raise and tracking only</div>
                  <div className="rubric-item"><Shield size={16} /> Technician sees management actions</div>
                  <div className="rubric-item"><Shield size={16} /> Resolved state is clearly shown to users</div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default IncidentsPage;
