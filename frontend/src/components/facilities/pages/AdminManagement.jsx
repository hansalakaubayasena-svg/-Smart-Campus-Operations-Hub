import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { StatusBadge } from '../ui/StatusBadge'
import { AddEditResourceModal } from '../ui/AddEditResourceModal'
import { DeleteConfirmDialog } from '../ui/DeleteConfirmDialog'
import {
  createFacility,
  deleteFacility,
  getFacilities,
  uploadFacilityImage,
  updateFacility,
} from '../../../services/facilities/facilityService'

const typeToUi = (type) => {
  if (type === 'EQUIPMENT') return { type: 'Equipment', category: 'Equipment' }
  if (type === 'LAB') return { type: 'Room', category: 'Lab' }
  if (type === 'LECTURE_HALL') return { type: 'Room', category: 'Lecture Hall' }
  if (type === 'MEETING_ROOM') return { type: 'Room', category: 'Conference Room' }
  return { type: 'Room', category: type === 'ROOM' ? 'Room' : 'Other' }
}

const categoryAndTypeToApiType = (type, category) => {
  if (type === 'Equipment') return 'EQUIPMENT'
  if (category === 'Lab') return 'LAB'
  if (category === 'Lecture Hall') return 'LECTURE_HALL'
  if (category === 'Conference Room') return 'MEETING_ROOM'
  return 'ROOM'
}

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
    imageFile: null,
    description: facility.description || `${facility.nameOrModel} located at ${facility.location}.`,
    availabilityWindows: (facility.availabilityWindows || []).map((window) => {
      const match = /^(.+)\s(\d{2}:\d{2})-(\d{2}:\d{2})$/.exec(window)
      if (!match) {
        return { days: window, startTime: '08:00', endTime: '17:00' }
      }
      return { days: match[1], startTime: match[2], endTime: match[3] }
    }),
  }
}

const uiToApiPayload = (resourceData) => ({
  type: categoryAndTypeToApiType(resourceData.type, resourceData.category),
  nameOrModel: resourceData.name,
  capacity: Number(resourceData.capacity),
  location: resourceData.location,
  description: resourceData.description?.trim() || null,
  imageUrl: resourceData.imageUrl || null,
  availabilityWindows: (resourceData.availabilityWindows || []).map(
    (window) => `${window.days} ${window.startTime}-${window.endTime}`,
  ),
  status: resourceData.status,
})

export const AdminManagement = () => {
  const [resources, setResources] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [searchTerm, setSearchTerm] = useState('')
    const loadFacilities = React.useCallback(async () => {
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

    React.useEffect(() => {
      loadFacilities()
    }, [loadFacilities])

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [resourceToEdit, setResourceToEdit] = useState(null)
  const [resourceToDelete, setResourceToDelete] = useState(null)

  const filteredResources = resources.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        let uploadedImageUrl = resourceData.imageUrl || ''
        if (resourceData.imageFile) {
          const uploadResponse = await uploadFacilityImage(resourceData.imageFile, 'ADMIN')
          uploadedImageUrl = uploadResponse?.data?.imageUrl || uploadedImageUrl
        }

        const payload = uiToApiPayload({
          ...resourceData,
          imageUrl: uploadedImageUrl,
        })
        if (resourceToEdit) {
          await updateFacility(resourceToEdit.resourceId, payload, 'ADMIN')
        } else {
          await createFacility(
            {
              resourceId: `RES-${Date.now().toString().slice(-6)}`,
              ...payload,
            },
            'ADMIN',
          )
        }
        await loadFacilities()
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
        await loadFacilities()
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to delete facility.')
      }
    }
    run()
  }

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

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {error && (
            <div className="px-4 py-3 border-b border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="p-4 border-b border-border bg-slate-50/50 flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Name or Location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary sm:text-sm outline-none transition-colors"
              />
            </div>
            <div className="text-sm text-slate-500 font-medium hidden sm:block">
              Total: {filteredResources.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Type / Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Capacity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {!loading && filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <tr
                      key={resource.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-14 w-20 rounded-md border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-text">
                          {resource.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text">{resource.type}</div>
                        <div className="text-xs text-slate-500">
                          {resource.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {resource.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {resource.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={resource.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
