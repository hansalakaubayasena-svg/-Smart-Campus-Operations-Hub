import React from 'react'
import { MapPin, Users, LayoutGrid } from 'lucide-react'
import { StatusBadge } from './StatusBadge'

export const ResourceCard = ({ resource, onViewDetails, onBook }) => {
  const isOutOfService = resource.status === 'OUT_OF_SERVICE'

  const getCategoryColor = (category) => {
    const variants = [
      'bg-slate-100 text-slate-800 border-slate-200',
      'bg-cyan-100 text-cyan-800 border-cyan-200',
      'bg-teal-100 text-teal-800 border-teal-200',
      'bg-emerald-100 text-emerald-800 border-emerald-200',
      'bg-amber-100 text-amber-800 border-amber-200',
      'bg-rose-100 text-rose-800 border-rose-200',
    ]

    const hash = (category || '')
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)

    return variants[hash % variants.length]
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card hover:shadow-md transition-shadow duration-200 flex flex-col h-full overflow-hidden group">
      <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
        {resource.imageUrl ? (
          <img
            src={resource.imageUrl}
            alt={resource.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
            No image
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge status={resource.status} size="sm" />
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className="text-lg font-bold text-text leading-tight group-hover:text-primary transition-colors">
            {resource.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(resource.category)}`}
          >
            {resource.category}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
            <LayoutGrid className="h-3 w-3" />
            {resource.type}
          </span>
        </div>

        <div className="space-y-2 mt-auto">
          <div className="flex items-center text-sm text-slate-600">
            <Users className="h-4 w-4 mr-2 text-slate-400 shrink-0" />
            <span>
              Capacity: <span className="font-medium text-text">{resource.capacity}</span>
            </span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <MapPin className="h-4 w-4 mr-2 text-slate-400 shrink-0" />
            <span className="truncate" title={resource.location}>
              {resource.location}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-slate-50 flex gap-3">
        <button
          onClick={() => onViewDetails(resource)}
          className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary hover:border-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          View Details
        </button>

        <div className="flex-1 relative group/btn">
          <button
            disabled={isOutOfService}
            onClick={() => !isOutOfService && onBook(resource)}
            className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              isOutOfService
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-teal-800 shadow-sm hover:shadow'
            }`}
          >
            Book
          </button>

          {isOutOfService && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              Out of service
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
