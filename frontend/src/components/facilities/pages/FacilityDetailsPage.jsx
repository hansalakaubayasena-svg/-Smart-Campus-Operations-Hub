import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, Tag, Clock, Info, Calendar } from 'lucide-react'
import { StatusBadge } from '../ui/StatusBadge'
import { getFacilityByResourceId } from '../../../services/facilities/facilityService'

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
    description: `${facility.nameOrModel} located at ${facility.location}.`,
    availabilityWindows: toAvailabilityObjects(facility.availabilityWindows),
  }
}

export const FacilityDetailsPage = () => {
  const navigate = useNavigate()
  const { resourceId } = useParams()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'view'
  const isBookMode = mode === 'book'

  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getFacilityByResourceId(resourceId, 'USER')
        setResource(mapFacilityToUiResource(response.data))
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load facility details.')
      } finally {
        setLoading(false)
      }
    }

    if (resourceId) {
      load()
    }
  }, [resourceId])

  const isOutOfService = useMemo(
    () => resource?.status === 'OUT_OF_SERVICE',
    [resource],
  )

  return (
    <div className="min-h-screen bg-background py-8">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/facilities')}
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Facilities
        </button>

        {loading ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center text-slate-500">
            Loading facility details...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
            {error}
          </div>
        ) : !resource ? (
          <div className="bg-card border border-border rounded-2xl p-10 text-center text-slate-500">
            Facility not found.
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary">
                  {resource.type}
                </span>
                <StatusBadge status={resource.status} />
              </div>
              <h1 className="text-3xl font-bold text-text">{resource.name}</h1>
              {isBookMode && (
                <p className="text-sm text-primary mt-1 font-medium">Booking Preview</p>
              )}
            </div>

            <div className="p-6 space-y-6">
              <div className="h-[460px] rounded-xl overflow-hidden border border-border bg-slate-100 flex items-center justify-center">
                {resource.imageUrl ? (
                  <img
                    src={resource.imageUrl}
                    alt={resource.name}
                    className="h-full w-full object-scale-down p-3"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
                    No image available
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Capacity</p>
                    <p className="text-base font-semibold text-text">
                      {resource.capacity} {resource.type === 'Room' ? 'people' : 'unit'}
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
              </div>

              <div>
                <h2 className="text-lg font-semibold text-text mb-3">Description</h2>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-24">
                  {resource.description}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-400" />
                  Availability Windows
                </h2>
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Days
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
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
                onClick={() => navigate('/facilities')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                disabled={isOutOfService}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  isOutOfService
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-teal-800 shadow-sm hover:shadow'
                }`}
              >
                {isBookMode ? 'Proceed to Booking' : 'Request Booking'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
