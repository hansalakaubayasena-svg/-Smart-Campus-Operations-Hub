import React from 'react'

export const SkeletonCard = () => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-5 animate-pulse flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        <div className="h-6 bg-slate-200 rounded-full w-16"></div>
      </div>

      <div className="space-y-3 mb-6 flex-grow">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-border flex gap-3">
        <div className="h-10 bg-slate-200 rounded flex-1"></div>
        <div className="h-10 bg-slate-200 rounded flex-1"></div>
      </div>
    </div>
  )
}
