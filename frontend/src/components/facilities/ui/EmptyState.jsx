import React from 'react'
import { SearchX } from 'lucide-react'

export const EmptyState = ({ onClearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card rounded-xl border border-border border-dashed h-full min-h-[400px]">
      <div className="bg-slate-50 p-4 rounded-full mb-4">
        <SearchX className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-text mb-2">No resources found</h3>
      <p className="text-slate-500 max-w-md mb-6">
        We couldn't find any facilities matching your current search and filter
        criteria. Try adjusting your filters or search term.
      </p>
      <button
        onClick={onClearFilters}
        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Clear all filters
      </button>
    </div>
  )
}
