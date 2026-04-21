import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllTickets, getTicketAttachmentUrl, updateTicketStatus, addResolutionNotes } from '../../api/ticketApi.js'
import TicketStatusBadge from '../../components/tickets/TicketStatusBadge.jsx'

const parseDescriptionMetadata = (description) => {
  // Read extra ticket details that were stored inside the description text.
  const lines = String(description || '').split('\n')
  const map = {}

  lines.forEach((line) => {
    const [rawKey, ...rest] = line.split(':')
    if (!rawKey || rest.length === 0) {
      return
    }

    const key = rawKey.trim().toLowerCase()
    const value = rest.join(':').trim()
    if (value) {
      map[key] = value
    }
  })

  return {
    requestType: map['request / inquiry type'] || '',
    registrationNumber: map['registration number'] || '-',
    facultySchool: map['faculty / school'] || '-',
    department: map.department || '-',
    campusCenter: map['campus / center'] || '-',
    message: map.message || '',
  }
}

const getRequestTitle = (ticket) => {
  const metadata = parseDescriptionMetadata(ticket.description)
  const normalizedTitle = String(ticket.title || '').trim()
  const normalizedRequestType = String(metadata.requestType || '').trim().toUpperCase()

  if (ticket.category === 'OTHER') {
    if (normalizedTitle && normalizedTitle.toUpperCase() !== 'OTHER') {
      return normalizedTitle
    }
    return 'Subject not provided'
  }

  if (normalizedRequestType && normalizedRequestType !== 'OTHER') {
    return metadata.requestType
  }

  if (normalizedTitle && normalizedTitle.toUpperCase() !== 'OTHER') {
    return normalizedTitle
  }

  return ticket.category
}

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'AWAITING_FOR_REPLY', label: 'Awaiting for reply' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'REJECTED', label: 'Rejected' },
]

const TicketManagementPage = () => {
  const [tickets, setTickets] = useState([])
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [status, setStatus] = useState('OPEN')
  const [rejectionReason, setRejectionReason] = useState('')
  const [resolutionNotesDraft, setResolutionNotesDraft] = useState('')
  const [isResolutionEditing, setIsResolutionEditing] = useState(false)
  const [followUpResolutionNotesDraft, setFollowUpResolutionNotesDraft] = useState('')
  const [isFollowUpResolutionEditing, setIsFollowUpResolutionEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTickets = async () => {
    try {
      const data = await getAllTickets()
      setTickets(data)
      setSelectedTicketId((current) => current || data[0]?.id || null)
    } catch (loadError) {
      setError(loadError.message || 'Unable to load tickets.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  const selectedTicket = useMemo(() => tickets.find((ticket) => ticket.id === selectedTicketId) || null, [tickets, selectedTicketId])
  const selectedMetadata = useMemo(
    () => parseDescriptionMetadata(selectedTicket?.description),
    [selectedTicket?.description],
  )

  const refreshTicketList = async () => {
    const data = await getAllTickets()
    setTickets(data)
  }

  const isAwaitingReply = status === 'AWAITING_FOR_REPLY'
  const isReplySubmitted = Boolean(selectedTicket?.requesterReply?.trim())
  const isResolutionLocked = isReplySubmitted
  const shouldShowFollowUpResolutionSection = selectedTicket?.status === 'AWAITING_FOR_REPLY' && isReplySubmitted

  useEffect(() => {
    // Sync the form state whenever a different ticket is selected.
    if (!selectedTicket) {
      return
    }

    setStatus(selectedTicket.status || 'OPEN')
    setRejectionReason(selectedTicket.rejectionReason || '')
    setResolutionNotesDraft(selectedTicket.resolutionNotes || '')
    setIsResolutionEditing(false)
    setFollowUpResolutionNotesDraft('')
    setIsFollowUpResolutionEditing(false)
  }, [selectedTicket])

  const handleStatusUpdate = async () => {
    if (isAwaitingReply && !resolutionNotesDraft.trim()) {
      setMessage('Resolution notes are required when status is Awaiting for reply.')
      return
    }

    try {
      await updateTicketStatus(selectedTicketId, {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      })

      setMessage('Status updated successfully.')
      await refreshTicketList()
    } catch (statusError) {
      setMessage(statusError.message || 'Unable to update status.')
    }
  }

  const handleResolutionNotes = async () => {
    if (isResolutionLocked) {
      setMessage('Resolution notes are locked after requester reply is submitted.')
      return
    }

    if (isAwaitingReply && !resolutionNotesDraft.trim()) {
      setMessage('Resolution notes are required when status is Awaiting for reply.')
      return
    }

    try {
      // Move the ticket into reply mode before saving notes that need requester action.
      if (isAwaitingReply && selectedTicket?.status !== 'AWAITING_FOR_REPLY') {
        await updateTicketStatus(selectedTicketId, {
          status: 'AWAITING_FOR_REPLY',
          rejectionReason: null,
        })
      }

      await addResolutionNotes(selectedTicketId, resolutionNotesDraft)
      setMessage(isAwaitingReply ? 'Sent successfully.' : 'Resolution notes saved.')
      setIsResolutionEditing(false)
      await refreshTicketList()
    } catch (notesError) {
      setMessage(notesError.message || 'Unable to save notes.')
    }
  }

  const handleEditResolutionNotes = () => {
    if (isResolutionLocked) {
      return
    }
    setResolutionNotesDraft(selectedTicket?.resolutionNotes || '')
    setIsResolutionEditing(true)
    setMessage('')
  }

  const handleCancelResolutionEdit = () => {
    setResolutionNotesDraft(selectedTicket?.resolutionNotes || '')
    setIsResolutionEditing(false)
    setMessage('Changes discarded.')
  }

  const handleSaveFollowUpResolutionNotes = async () => {
    const nextFollowUp = followUpResolutionNotesDraft.trim()
    if (!nextFollowUp) {
      setMessage('Follow-up resolution notes are required.')
      return
    }

    try {
      await addResolutionNotes(selectedTicketId, nextFollowUp)
      setMessage('Follow-up resolution notes saved.')
      setIsFollowUpResolutionEditing(false)
      setFollowUpResolutionNotesDraft('')
      await refreshTicketList()
    } catch (notesError) {
      setMessage(notesError.message || 'Unable to save follow-up notes.')
    }
  }

  const handleStartFollowUpResolutionEdit = () => {
    setFollowUpResolutionNotesDraft('')
    setIsFollowUpResolutionEditing(true)
    setMessage('')
  }

  const handleCancelFollowUpResolutionEdit = () => {
    setFollowUpResolutionNotesDraft('')
    setIsFollowUpResolutionEditing(false)
    setMessage('Changes discarded.')
  }

  if (isLoading) {
    return <div className="min-h-screen bg-[#f5efe8] p-8 text-center">Loading management console...</div>
  }

  if (error) {
    return <div className="min-h-screen bg-[#f5efe8] p-8 text-center text-rose-600">{error}</div>
  }

  return (
    <div className="min-h-screen bg-[#f5efe8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <nav className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm shadow-slate-300/40">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/dashboard?section=Tickets"
              className="rounded-2xl border border-[#153f62] bg-[#153f62] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1b537f]"
            >
              Admin Dashboard
            </Link>
            <Link
              to="/tickets/manage"
              className="rounded-2xl border border-[#153f62] bg-[#153f62] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1b537f]"
            >
              Manage
            </Link>
          </div>
          <p className="text-sm font-semibold text-slate-600">Ticket Management</p>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-300/40">
          <h1 className="text-2xl font-black text-slate-950">Ticket management</h1>
          <p className="mt-2 text-sm text-slate-600">Update workflow state and log resolution notes.</p>

          <div className="mt-6 space-y-3">
            {tickets.map((ticket) => (
              <button key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className={`w-full rounded-2xl border px-4 py-4 text-left transition ${selectedTicketId === ticket.id ? 'border-[#9fc9e3] bg-[#eaf5fc]' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                {(() => {
                  const metadata = parseDescriptionMetadata(ticket.description)
                  return (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <TicketStatusBadge status={ticket.status} />
                    <p className="mt-2 font-bold text-slate-950">#{ticket.id} {getRequestTitle(ticket)}</p>
                    <p className="text-sm text-slate-600">{ticket.resourceName || ticket.location}</p>
                    <p className="mt-1 text-xs text-slate-500">Reg No: {metadata.registrationNumber}</p>
                    <p className="text-xs text-slate-500">Email: {ticket.preferredContactEmail || '-'}</p>
                  </div>
                  <span className="text-xs text-slate-400">{ticket.priority}</span>
                </div>
                  )
                })()}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-300/40">
          {selectedTicket ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <TicketStatusBadge status={selectedTicket.status} />
                  <h2 className="mt-3 text-2xl font-black text-slate-950">Ticket #{selectedTicket.id}</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-700">Request / Inquiry type: {getRequestTitle(selectedTicket)}</p>
                  <p className="mt-1 text-sm text-slate-600">Registration Number: {selectedMetadata.registrationNumber}</p>
                  <p className="text-sm text-slate-600">Email: {selectedTicket.preferredContactEmail || '-'}</p>
                  <p className="mt-1 text-sm text-slate-600">Campus / Center: {selectedMetadata.campusCenter !== '-' ? selectedMetadata.campusCenter : (selectedTicket.location || '-')}</p>
                </div>
                <div className="text-right text-sm text-slate-500">Assigned: {selectedTicket.assignedTechnicianName || 'Unassigned'}</div>
              </div>

              {selectedMetadata.message ? (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">Center Message</p>
                  <p className="mt-2 whitespace-pre-line text-sm font-semibold text-amber-900">{selectedMetadata.message}</p>
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Update status
                  <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3">
                    {STATUS_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </label>
                {status === 'REJECTED' ? (
                  <label className="block text-sm font-semibold text-slate-700">
                    Rejection reason
                    <input value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
                  </label>
                ) : null}
                <button onClick={handleStatusUpdate} className="rounded-2xl bg-[#0b1739] px-4 py-3 text-sm font-bold text-white hover:bg-[#14224a]">Save status</button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">
                  Resolution notes
                  <textarea
                    value={resolutionNotesDraft}
                    onChange={(event) => setResolutionNotesDraft(event.target.value)}
                    rows="5"
                    readOnly={!isResolutionEditing || isResolutionLocked}
                    className={`mt-2 w-full rounded-2xl border px-4 py-3 ${(!isResolutionEditing ? 'border-slate-200 bg-slate-100 text-slate-700' : 'border-slate-200 bg-white text-slate-900')}`}
                    placeholder="Summarize the fix, parts replaced, testing result, and follow-up steps."
                  />
                </label>

                {isResolutionLocked ? (
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    Requester has already sent a reply. Add follow-up resolution notes in the section below.
                  </div>
                ) : isResolutionEditing ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={handleResolutionNotes} className="rounded-2xl border border-slate-950 px-4 py-3 text-sm font-bold text-slate-950">{isAwaitingReply ? 'Send' : 'Save notes'}</button>
                    <button onClick={handleCancelResolutionEdit} className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700">Cancel</button>
                  </div>
                ) : (
                  <button onClick={handleEditResolutionNotes} className="mt-3 rounded-2xl border border-[#b7d8ea] bg-[#eaf5fc] px-4 py-3 text-sm font-bold text-[#1f4968] hover:bg-[#dceef9]">Edit</button>
                )}
              </div>

              {selectedTicket.requesterReply ? (
                <div className="rounded-2xl border border-[#b7d8ea] bg-[#eaf5fc] p-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#1f4968]">Requester reply</h3>
                  <p className="mt-2 whitespace-pre-line text-sm text-[#153753]">{selectedTicket.requesterReply}</p>
                </div>
              ) : null}

              {selectedTicket.attachments?.length ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-600">Attached documents</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {selectedTicket.attachments.map((attachment) => (
                      <a key={attachment.id} href={getTicketAttachmentUrl(attachment.id)} target="_blank" rel="noreferrer" className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        {attachment.contentType?.startsWith('image/') ? (
                          <img src={getTicketAttachmentUrl(attachment.id)} alt={attachment.originalFileName} className="h-36 w-full object-cover" />
                        ) : (
                          <div className="flex h-36 items-center justify-center bg-slate-100 text-sm font-semibold text-slate-700">PDF Document</div>
                        )}
                        <div className="p-3 text-xs text-slate-600">{attachment.originalFileName}</div>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              {shouldShowFollowUpResolutionSection ? (
                <div className="rounded-2xl border border-[#b7d8ea] bg-[#eaf5fc] p-4">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#1f4968]">Follow-up Resolution Notes</h3>
                  <p className="mt-2 text-sm text-[#153753]">Add a new resolution update after reviewing the requester reply and attachments.</p>

                  {isFollowUpResolutionEditing ? (
                    <>
                      <textarea
                        value={followUpResolutionNotesDraft}
                        onChange={(event) => setFollowUpResolutionNotesDraft(event.target.value)}
                        rows="5"
                        className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900"
                        placeholder="Write the next resolution update for this ticket."
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button onClick={handleSaveFollowUpResolutionNotes} className="rounded-2xl border border-slate-950 px-4 py-3 text-sm font-bold text-slate-950">Send</button>
                        <button onClick={handleCancelFollowUpResolutionEdit} className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700">Cancel</button>
                      </div>
                    </>
                  ) : (
                    <button onClick={handleStartFollowUpResolutionEdit} className="mt-3 rounded-2xl border border-[#b7d8ea] bg-white px-4 py-3 text-sm font-bold text-[#1f4968] hover:bg-[#f3f9fd]">Add follow-up notes</button>
                  )}
                </div>
              ) : null}

              {message ? <div className="rounded-2xl border border-[#b7d8ea] bg-[#eaf5fc] px-4 py-3 text-sm text-[#1f4968]">{message}</div> : null}
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-slate-500">Select a ticket to manage it.</div>
          )}
        </section>
        </div>
      </div>
    </div>
  )
}

export default TicketManagementPage
