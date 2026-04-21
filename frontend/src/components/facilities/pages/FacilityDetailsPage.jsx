import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Users, Tag, Clock, Calendar } from 'lucide-react'
import { StatusBadge } from '../ui/StatusBadge'
import { getFacilityByResourceId } from '../../../services/facilities/facilityService'

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

const mapFacilityToUiResource = (facility) => ({
    id: facility.id || facility.resourceId,
    resourceId: facility.resourceId,
    name: facility.nameOrModel,
    type: facility.type,
    category: facility.category,
    location: facility.location,
    capacity: facility.capacity,
    status: facility.status,
    imageUrl: facility.imageUrl || '',
    description: facility.description || `${facility.nameOrModel} located at ${facility.location}.`,
    availabilityWindows: toAvailabilityObjects(facility.availabilityWindows),
  })

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
    <div className="min-h-screen bg-background py-8 md:py-10">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/facilities')}
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Facilities
        </button>

        {loading ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center text-slate-500">
            Loading facility details...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
            {error}
          </div>
        ) : !resource ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center text-slate-500">
            Facility not found.
          </div>
        ) : (
          <section className="space-y-6">
            <header className="rounded-xl border border-border bg-gradient-to-r from-white via-white to-teal-50/50 p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-text tracking-tight">{resource.name}</h1>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-8 space-y-6">
                <div className="w-full aspect-[16/9] max-h-[520px] rounded-xl overflow-hidden border border-border bg-slate-100 flex items-center justify-center">
                  {resource.imageUrl ? (
                    <img
                      src={resource.imageUrl}
                      alt={resource.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
                      No image available
                    </div>
                  )}
                </div>

                <section className="bg-card border border-border rounded-xl p-5 md:p-6">
                  <h2 className="text-lg font-semibold text-text mb-4">Description</h2>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200 min-h-24">
                    {resource.description}
                  </p>
                </section>

                <section className="bg-card border border-border rounded-xl overflow-hidden">
                  <h2 className="text-lg font-semibold text-text px-5 md:px-6 pt-5 md:pt-6 mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-slate-400" />
                    Availability Windows
                  </h2>
                  <div className="px-5 md:px-6 pb-5 md:pb-6">
                    <div className="bg-white border border-border rounded-lg overflow-hidden">
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
                </section>
              </div>

              <aside className="xl:col-span-4">
                <section className="bg-card border border-border rounded-xl p-5 md:p-6 xl:sticky xl:top-6">
                  <h2 className="text-lg font-semibold text-text mb-5">Facility Information</h2>

                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary">
                      {resource.type}
                    </span>
                    <StatusBadge status={resource.status} />
                    {isBookMode && (
                      <span className="inline-flex items-center rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 border border-teal-200">
                        Booking Preview
                      </span>
                    )}
                  </div>

                  <div className="space-y-5">
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
                          {resource.capacity} units
                        </p>
                      </div>
                    </div>

                  </div>
                </section>
              </aside>
            </div>

            <div className="border border-border rounded-xl bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-end gap-3">
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
          </section>
        )}
      </main>
    </div>
  )
}
