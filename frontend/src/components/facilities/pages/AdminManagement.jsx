import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { StatusBadge } from '../ui/StatusBadge'
import { AddEditResourceModal } from '../ui/AddEditResourceModal'
import { DeleteConfirmDialog } from '../ui/DeleteConfirmDialog'
import { FacilityTaxonomyPanel } from '../ui/FacilityTaxonomyPanel'
import {
  createFacility,
  deleteFacility,
  getFacilities,
  uploadFacilityImage,
  updateFacility,
} from '../../../services/facilities/facilityService'
import { getFacilityTaxonomy } from '../../../services/facilities/taxonomyService'
import { buildCategoriesByType } from '../data/facilityTaxonomy'

const resolveResourceKind = (facility) =>
  facility.resourceKind || (facility.quantity != null ? 'ASSET' : 'FACILITY')

const getMetricLabel = (resourceKind) => (resourceKind === 'ASSET' ? 'Quantity' : 'Capacity')

const getMetricValue = (resource) =>
  resource.resourceKind === 'ASSET' ? resource.quantity : resource.capacity

const toOptionalInt = (value) => {
  if (value === '' || value == null) {
    return null
  }
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

const mapFacilityToUiResource = (facility) => ({
  id: facility.id || facility.resourceId,
  resourceId: facility.resourceId,
  name: facility.nameOrModel,
  resourceKind: resolveResourceKind(facility),
  type: facility.type,
  category: facility.category,
  location: facility.location,
  capacity: facility.capacity,
  quantity: facility.quantity,
  minLoanHours: facility.minLoanHours,
  maxLoanHours: facility.maxLoanHours,
  status: facility.status,
  imageUrl: facility.imageUrl || '',
  imageFile: null,
  description: facility.description || `${facility.nameOrModel} located at ${facility.location}.`,
  availabilityWindows: (facility.availabilityWindows || []).map((window) => {
    const match = /^(.+)\s(\d{2}:\d{2})-(\d{2}:\d{2})$/.exec(window)
    if (!match) {
      return { days: window, startTime: '08:00', endTime: '17:00' }
    }
    return { days: match[1], startTime: match[2], endTime: match[3] }
  }),
})

const uiToApiPayload = (resourceData) => ({
  resourceKind: resourceData.resourceKind,
  type: resourceData.type,
  category: resourceData.category,
  nameOrModel: resourceData.name,
  capacity: resourceData.resourceKind === 'FACILITY' ? Number(resourceData.capacity) : null,
  quantity: resourceData.resourceKind === 'ASSET' ? Number(resourceData.quantity) : null,
  minLoanHours: resourceData.resourceKind === 'ASSET' ? toOptionalInt(resourceData.minLoanHours) : null,
  maxLoanHours: resourceData.resourceKind === 'ASSET' ? toOptionalInt(resourceData.maxLoanHours) : null,
  location: resourceData.location,
  description: resourceData.description?.trim() || null,
  imageUrl: resourceData.imageUrl || null,
  availabilityWindows: (resourceData.availabilityWindows || []).map(
    (window) => `${window.days} ${window.startTime}-${window.endTime}`,
  ),
  status: resourceData.status,
})

export const AdminManagement = () => {
  const [resources, setResources] = useState([])
  const [taxonomy, setTaxonomy] = useState({ types: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [resourceToEdit, setResourceToEdit] = useState(null)
  const [resourceToDelete, setResourceToDelete] = useState(null)

  const loadFacilities = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getFacilities({ role: 'ADMIN' })
      setResources((response.data || []).map(mapFacilityToUiResource))
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load facilities.')
      setResources([])
    } finally {
      setLoading(false)
    }
  }, [])

  const loadTaxonomy = useCallback(async () => {
    try {
      const response = await getFacilityTaxonomy({ role: 'ADMIN' })
      setTaxonomy(response.data || { types: [] })
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load facility types.')
      setTaxonomy({ types: [] })
    }
  }, [])

  useEffect(() => {
    loadFacilities()
    loadTaxonomy()
  }, [loadFacilities, loadTaxonomy])

  const filteredResources = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) {
      return resources
    }

    return resources.filter((resource) =>
      [resource.name, resource.location, resource.type, resource.category, resource.resourceId, resource.resourceKind]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    )
  }, [resources, searchTerm])

  const handleAddClick = () => {
    setResourceToEdit(null)
    setIsAddEditModalOpen(true)
  }

  const handleEditClick = (resource) => {
    setResourceToEdit(resource)
    setIsAddEditModalOpen(true)
  }

  const handleDeleteClick = (resource) => {
    setResourceToDelete(resource)
    setIsDeleteModalOpen(true)
  }

  const handleSaveResource = (resourceData) => {
    const run = async () => {
      setError('')
      try {
        const resourceId = resourceToEdit?.resourceId || `RES-${Date.now().toString().slice(-6)}`
        const shouldUploadImage = Boolean(resourceData.imageFile)

        const payload = uiToApiPayload({
          ...resourceData,
          imageUrl: shouldUploadImage ? null : resourceData.imageUrl || '',
        })
        if (resourceToEdit) {
          await updateFacility(resourceId, payload, 'ADMIN')
        } else {
          await createFacility(
            {
              resourceId,
              ...payload,
            },
            'ADMIN',
          )
        }

        if (shouldUploadImage) {
          await uploadFacilityImage(resourceId, resourceData.imageFile, 'ADMIN')
        }

        await Promise.all([loadFacilities(), loadTaxonomy()])
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to save facility.')
      }
    }
    run()
  }

  const handleConfirmDelete = () => {
    const run = async () => {
      if (!resourceToDelete) return
      setError('')
      try {
        await deleteFacility(resourceToDelete.resourceId, 'ADMIN')
        await Promise.all([loadFacilities(), loadTaxonomy()])
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to delete facility.')
      }
    }
    run()
  }

  const categoriesByType = buildCategoriesByType(taxonomy.types || [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Resource Management</h1>
            <p className="text-slate-600">
              Add, edit, and manage all campus facilities and equipment.
            </p>
          </div>

          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-teal-800 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Add Resource
          </button>
        </div>

        <FacilityTaxonomyPanel
          taxonomy={taxonomy}
          onChanged={loadTaxonomy}
        />

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {error && (
            <div className="px-4 py-3 border-b border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="p-4 border-b border-border bg-slate-50/50 flex justify-between items-center gap-4">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, location, type, category, or resource ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm outline-none transition-colors"
              />
            </div>
            <div className="text-sm text-slate-500 font-medium hidden sm:block">
              Total: {filteredResources.length}
            </div>
          </div>

          <div className="overflow-x-hidden">
            <table className="w-full table-fixed divide-y divide-border">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    className="w-24 px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="w-40 px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="w-40 px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Type / Category
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="w-32 px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Capacity / Quantity
                  </th>
                  <th
                    scope="col"
                    className="w-28 px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="w-24 px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {!loading && filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <tr key={resource.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 align-top">
                        <div className="h-12 w-16 rounded-md border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                          {resource.imageUrl ? (
                            <img
                              src={resource.imageUrl}
                              alt={resource.name}
                              className="h-full w-full object-scale-down p-1"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400">
                              No image
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="text-sm font-bold text-text break-words">{resource.name}</div>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="text-sm text-text break-words">{resource.type}</div>
                        <div className="text-xs text-slate-500 break-words">{resource.category}</div>
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600 break-words">
                        {resource.location}
                      </td>
                      <td className="px-4 py-3 align-top text-sm text-slate-600">
                        {getMetricLabel(resource.resourceKind)}: {getMetricValue(resource) ?? '-'}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <StatusBadge status={resource.status} size="sm" />
                      </td>
                      <td className="px-4 py-3 align-top text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(resource)}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-teal-50 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(resource)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : !loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No resources found matching your search.
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      Loading facilities...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AddEditResourceModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveResource}
        resourceToEdit={resourceToEdit}
        taxonomy={{
          types: taxonomy.types || [],
          categoriesByType,
        }}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        resourceName={resourceToDelete?.name || ''}
      />
    </div>
  )
}
