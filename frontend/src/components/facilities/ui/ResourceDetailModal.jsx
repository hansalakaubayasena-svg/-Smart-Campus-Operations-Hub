import React from 'react'
import { X, MapPin, Users, Tag, Clock, Info, Calendar, Boxes } from 'lucide-react'
import { StatusBadge } from './StatusBadge'

export const ResourceDetailModal = ({ resource, isOpen, onClose, mode = 'view' }) => {
  if (!isOpen || !resource) return null
  const isOutOfService = resource.status === 'OUT_OF_SERVICE'
  const isBookMode = mode === 'book'
  const resourceKind = resource.resourceKind || (resource.quantity != null ? 'ASSET' : 'FACILITY')
  const metricLabel = resourceKind === 'ASSET' ? 'Quantity' : 'Capacity'
  const metricValue = resourceKind === 'ASSET' ? resource.quantity : resource.capacity
  const loanDurationSummary = resourceKind === 'ASSET'
    ? `${resource.minLoanHours ? `${resource.minLoanHours}h min / ` : ''}${resource.maxLoanHours ? `${resource.maxLoanHours}h max` : 'Not configured'}${resource.defaultLoanHours ? ` (default ${resource.defaultLoanHours}h)` : ''}`
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary">
                {resource.type}
              </span>
              <StatusBadge status={resource.status} />
            </div>
            <h2 className="text-2xl font-bold text-text">{resource.name}</h2>
            {isBookMode && (
              <p className="text-sm text-primary mt-1 font-medium">Booking Preview</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="h-105 rounded-xl overflow-hidden border border-border bg-slate-100 flex items-center justify-center">
            {resource.imageUrl ? (
              <img
                src={resource.imageUrl}
                alt={resource.name}
                className="h-full w-full object-contain p-3"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
                No image available
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Category</p>
                <p className="text-base font-semibold text-text">{resource.category}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Location</p>
                <p className="text-base font-semibold text-text">{resource.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                {resourceKind === 'ASSET' ? (
                  <Boxes className="h-5 w-5" />
                ) : (
                  <Users className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{metricLabel}</p>
                <p className="text-base font-semibold text-text">
                  {metricValue ?? '-'} units
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Resource ID</p>
                <p className="text-base font-semibold text-text font-mono">{resource.id}</p>
              </div>
            </div>

            {resourceKind === 'ASSET' && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Loan Duration</p>
                  <p className="text-base font-semibold text-text">{loanDurationSummary}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
              Description
            </h3>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-24">
              {resource.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-400" />
              Availability Windows
            </h3>
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-slate-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Days
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                    >
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                  {resource.availabilityWindows.map((window, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {window.days}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {window.startTime} - {window.endTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Close
          </button>

          <div className="relative group">
            <button
              disabled={isOutOfService}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                isOutOfService
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-teal-800 shadow-sm hover:shadow'
              }`}
            >
              {isBookMode ? 'Proceed to Booking' : 'Request Booking'}
            </button>

            {isOutOfService && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Resource is currently out of service
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
