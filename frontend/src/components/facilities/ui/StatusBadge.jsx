import React from 'react'

export const StatusBadge = ({ status, size = 'md' }) => {
  const isActive = status === 'ACTIVE'
  const sizeClasses =
    size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
  const dotSize = size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses} ${
        isActive
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-slate-100 text-slate-600 border border-slate-200'
      }`}
    >
      <span
        className={`${dotSize} rounded-full ${
          isActive ? 'bg-green-500' : 'bg-slate-400'
        }`}
      />
      {isActive ? 'Active' : 'Out of Service'}
    </span>
  )
}
