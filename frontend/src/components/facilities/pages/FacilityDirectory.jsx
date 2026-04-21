import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter } from 'lucide-react'
import { FilterSidebar } from '../ui/FilterSidebar'
import { ResourceCard } from '../ui/ResourceCard'
import { SkeletonCard } from '../ui/SkeletonCard'
import { EmptyState } from '../ui/EmptyState'
import { getFacilities } from '../../../services/facilities/facilityService'

const typeToUi = (type) => {
  if (type === 'EQUIPMENT') return { type: 'Equipment', category: 'Equipment' }
  if (type === 'LAB') return { type: 'Room', category: 'Lab' }
  if (type === 'LECTURE_HALL') return { type: 'Room', category: 'Lecture Hall' }
  if (type === 'MEETING_ROOM') return { type: 'Room', category: 'Conference Room' }
  return { type: 'Room', category: type === 'ROOM' ? 'Room' : 'Other' }
}

const toAvailabilityObjects = (windows = []) =>
  windows.map((window) => {
    const match = /^(.+)\s(\d{2}:\d{2})-(\d{2}:\d{2})$/.exec(window)
    if (!match) {
      return { days: window, startTime: '--:--', endTime: '--:--' }
    }
    return {
      days: match[1],
      startTime: match[2],
      endTime: match[3],
    }
  })

const mapFacilityToUiResource = (facility) => {
  const uiType = typeToUi(facility.type)
  return {
    id: facility.id || facility.resourceId,
    resourceId: facility.resourceId,
    name: facility.nameOrModel,
    type: uiType.type,
    category: uiType.category,
    location: facility.location,
    capacity: facility.capacity,
    status: facility.status,
    imageUrl: facility.imageUrl || '',
    description: facility.description || `${facility.nameOrModel} located at ${facility.location}.`,
    availabilityWindows: toAvailabilityObjects(facility.availabilityWindows),
  }
}

export const FacilityDirectory = () => {
  const navigate = useNavigate()
  const [resources, setResources] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const initialFilters = {
    search: '',
    type: 'All',
    category: 'All',
    location: '',
    capacity: '',
  }

  const [filters, setFilters] = useState(initialFilters)
  const [filterErrors, setFilterErrors] = useState({})

  const uiTypeToApiType = {
    Room: 'ROOM',
    Lab: 'LAB',
    'Lecture Hall': 'LECTURE_HALL',
    'Meeting Room': 'MEETING_ROOM',
    Equipment: 'EQUIPMENT',
  }

  const loadFacilities = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setIsLoading(true)
    }
    setError('')
    try {
      const response = await getFacilities({
        role: 'USER',
      })
      const mapped = (response.data || []).map(mapFacilityToUiResource)
      setResources(mapped)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load facilities.')
    } finally {
      if (showLoader) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    loadFacilities(true)
  }, [loadFacilities])

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadFacilities(false)
    }, 10000)

    return () => clearInterval(intervalId)
  }, [loadFacilities])

  const categoryOptions = ['All', 'Room', 'Lab', 'Lecture Hall', 'Conference Room', 'Workshop', 'Equipment', 'Other']

  const validateFilters = useCallback((nextFilters) => {
    const nextErrors = {}
    if (nextFilters.capacity !== '') {
      const capacityValue = Number(nextFilters.capacity)
      if (!Number.isInteger(capacityValue) || capacityValue < 0) {
        nextErrors.capacity = 'Capacity must be a whole number of 0 or greater.'
      }
    }
    return nextErrors
  }, [])

  const filteredResources = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase()
    const locationTerm = filters.location.trim().toLowerCase()
    const capacityValue = filters.capacity === '' ? '' : Number(filters.capacity)

    return resources.filter((resource) => {
      const matchesSearch =
        !searchTerm ||
        [resource.name, resource.resourceId, resource.location, resource.type, resource.category]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(searchTerm))

      const matchesType = filters.type === 'All' || resource.type === filters.type
      const matchesCategory = filters.category === 'All' || resource.category === filters.category
      const matchesLocation = !locationTerm || resource.location.toLowerCase().includes(locationTerm)
      const matchesCapacity =
        capacityValue === '' || Number(resource.capacity) === Number(capacityValue)

      return matchesSearch && matchesType && matchesCategory && matchesLocation && matchesCapacity
    })
  }, [filters, resources])

  const handleClearFilters = () => {
    setFilters(initialFilters)
    setFilterErrors({})
  }

  const handleFiltersChange = (updater) => {
    setFilters((prev) => {
      const nextFilters = typeof updater === 'function' ? updater(prev) : updater
      setFilterErrors(validateFilters(nextFilters))
      return nextFilters
    })
  }

  const handleViewDetails = (resource) => {
    navigate(`/facilities/${resource.resourceId}`)
  }

  const handleBookResource = (resource) => {
    navigate(`/facilities/${resource.resourceId}?mode=book`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Facility Directory</h1>
            <p className="text-slate-600">
              Browse and discover campus resources, rooms, and equipment.
            </p>
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 shadow-sm"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            filters={filters}
            setFilters={handleFiltersChange}
            onClear={handleClearFilters}
            filterErrors={filterErrors}
            isMobileOpen={isMobileFilterOpen}
            setIsMobileOpen={setIsMobileFilterOpen}
          />

          <div className="flex-1">
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}
            <div className="mb-4 text-sm text-slate-500 font-medium">
              {!isLoading && `Showing ${filteredResources.length} results`}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onViewDetails={handleViewDetails}
                    onBook={handleBookResource}
                  />
                ))}
              </div>
            ) : (
              <EmptyState onClearFilters={handleClearFilters} />
            )}
          </div>
        </div>
      </main>

    </div>
  )
}
