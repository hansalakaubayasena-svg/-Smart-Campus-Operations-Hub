import React from 'react'
import { Search, Filter, X } from 'lucide-react'

export const FilterSidebar = ({
  filters,
  setFilters,
  onClear,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text flex items-center gap-2">
          <Filter className="h-5 w-5" /> Filters
        </h2>
        <button
          onClick={onClear}
          className="text-sm text-primary hover:text-teal-800 font-medium"
        >
          Clear all
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
            placeholder="Search name or location..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm outline-none transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Type
        </label>
        <select
          value={filters.type}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              type: e.target.value,
            }))
          }
          className="block w-full pl-3 pr-10 py-2 text-base border border-slate-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-white"
        >
          <option value="All">All Types</option>
          <option value="Room">Room</option>
          <option value="Equipment">Equipment</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Location
        </label>
        <input
          type="text"
          value={filters.location}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              location: e.target.value,
            }))
          }
          placeholder="e.g. Engineering Block"
          className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Min Capacity
          </label>
          <input
            type="number"
            min="0"
            value={filters.minCapacity}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                minCapacity: e.target.value === '' ? '' : parseInt(e.target.value, 10),
              }))
            }
            className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Max Capacity
          </label>
          <input
            type="number"
            min="0"
            value={filters.maxCapacity}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                maxCapacity: e.target.value === '' ? '' : parseInt(e.target.value, 10),
              }))
            }
            className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="bg-card border border-border rounded-xl p-5 sticky top-24 shadow-sm">
          {sidebarContent}
        </div>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card shadow-xl animate-in slide-in-from-left duration-300">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto px-4">
              {sidebarContent}
            </div>
            <div className="p-4 border-t border-border">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
