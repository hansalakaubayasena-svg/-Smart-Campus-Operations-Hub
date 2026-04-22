import React, { useEffect, useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { buildCategoriesByType } from '../data/facilityTaxonomy'

const defaultAvailability = {
  days: 'Mon-Fri',
  startTime: '08:00',
  endTime: '17:00',
}

export const AddEditResourceModal = ({
  isOpen,
  onClose,
  onSave,
  resourceToEdit,
  taxonomy,
}) => {
  const typeOptions = taxonomy?.types || []
  const categoriesByType = taxonomy?.categoriesByType || buildCategoriesByType(typeOptions)
  const getDefaultCategory = (type) => categoriesByType[type]?.[0] || ''

  const [formData, setFormData] = useState({
    name: '',
    resourceKind: 'FACILITY',
    type: '',
    category: '',
    location: '',
    capacity: 0,
    quantity: 0,
    minLoanHours: '',
    maxLoanHours: '',
    defaultLoanHours: '',
    status: 'ACTIVE',
    imageUrl: '',
    imageFile: null,
    description: '',
    availabilityWindows: [{ ...defaultAvailability }],
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (resourceToEdit) {
      const { id, ...rest } = resourceToEdit
      setFormData({
        ...rest,
        resourceKind: rest.resourceKind || (rest.quantity != null ? 'ASSET' : 'FACILITY'),
        capacity: rest.capacity ?? 0,
        quantity: rest.quantity ?? 0,
        minLoanHours: rest.minLoanHours ?? '',
        maxLoanHours: rest.maxLoanHours ?? '',
        defaultLoanHours: rest.defaultLoanHours ?? '',
      })
    } else {
      setFormData({
        name: '',
        resourceKind: 'FACILITY',
        type: '',
        category: '',
        location: '',
        capacity: 0,
        quantity: 0,
        minLoanHours: '',
        maxLoanHours: '',
        defaultLoanHours: '',
        status: 'ACTIVE',
        imageUrl: '',
        imageFile: null,
        description: '',
        availabilityWindows: [{ ...defaultAvailability }],
      })
    }
    setErrors({})
  }, [resourceToEdit, isOpen])

  if (!isOpen) return null

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.type.trim()) newErrors.type = 'Type is required'
    if (!formData.category) newErrors.category = 'Category is required'

    const metricField = formData.resourceKind === 'ASSET' ? 'quantity' : 'capacity'
    const metricLabel = formData.resourceKind === 'ASSET' ? 'Quantity' : 'Capacity'
    const metricValue = Number(formData[metricField])
    const isValidMetric =
      formData.resourceKind === 'ASSET'
        ? Number.isInteger(metricValue) && metricValue >= 0
        : Number.isInteger(metricValue) && metricValue > 0
    if (!isValidMetric) {
      newErrors[metricField] =
        formData.resourceKind === 'ASSET'
          ? `${metricLabel} must be a whole number of 0 or greater`
          : `${metricLabel} must be greater than 0`
    }

    if (formData.resourceKind === 'ASSET') {
      const minLoan = formData.minLoanHours === '' ? null : Number(formData.minLoanHours)
      const maxLoan = formData.maxLoanHours === '' ? null : Number(formData.maxLoanHours)
      const defaultLoan = formData.defaultLoanHours === '' ? null : Number(formData.defaultLoanHours)

      if (!Number.isInteger(maxLoan) || maxLoan <= 0) {
        newErrors.maxLoanHours = 'Max loan duration is required and must be greater than 0'
      }

      if (minLoan !== null && (!Number.isInteger(minLoan) || minLoan <= 0)) {
        newErrors.minLoanHours = 'Min loan duration must be greater than 0'
      }

      if (defaultLoan !== null && (!Number.isInteger(defaultLoan) || defaultLoan <= 0)) {
        newErrors.defaultLoanHours = 'Default loan duration must be greater than 0'
      }

      if (Number.isInteger(minLoan) && Number.isInteger(maxLoan) && minLoan > maxLoan) {
        newErrors.minLoanHours = 'Min loan duration cannot be greater than max loan duration'
      }

      if (Number.isInteger(defaultLoan) && Number.isInteger(maxLoan) && defaultLoan > maxLoan) {
        newErrors.defaultLoanHours = 'Default loan duration cannot exceed max loan duration'
      }

      if (Number.isInteger(defaultLoan) && Number.isInteger(minLoan) && defaultLoan < minLoan) {
        newErrors.defaultLoanHours = 'Default loan duration cannot be less than min loan duration'
      }
    }

    const invalidWindow = formData.availabilityWindows.find(
      (window) =>
        !window.days.trim() ||
        !window.startTime ||
        !window.endTime ||
        window.startTime >= window.endTime,
    )
    if (invalidWindow) {
      newErrors.availability =
        'Each availability window needs a day range and an end time after the start time'
    }

    if (formData.availabilityWindows.length === 0) {
      newErrors.availability = 'At least one availability window is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSave(formData)
      onClose()
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: ['capacity', 'quantity'].includes(name) ? parseInt(value) || 0 : value,
      }

      if (name === 'resourceKind') {
        if (value === 'ASSET') {
          next.capacity = 0
        } else {
          next.quantity = 0
          next.minLoanHours = ''
          next.maxLoanHours = ''
          next.defaultLoanHours = ''
        }
      }

      if (name === 'type') {
        const allowedCategories = categoriesByType[value] || []
        if (!allowedCategories.includes(next.category)) {
          next.category = allowedCategories[0] || ''
        }
      }

      return next
    })

    if (
      errors[name]
      || (name === 'type' && (errors.capacity || errors.quantity || errors.category))
      || (name === 'resourceKind' && (errors.minLoanHours || errors.maxLoanHours || errors.defaultLoanHours))
    ) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
        ...(name === 'type' ? { capacity: '', quantity: '', category: '' } : {}),
        ...(name === 'resourceKind'
          ? { minLoanHours: '', maxLoanHours: '', defaultLoanHours: '' }
          : {}),
      }))
    }

    if (name === 'resourceKind') {
      setErrors((prev) => ({
        ...prev,
        capacity: '',
        quantity: '',
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null
    if (!file) {
      setFormData((prev) => ({ ...prev, imageFile: null }))
      return
    }

    const localPreview = URL.createObjectURL(file)
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imageUrl: localPreview,
    }))
  }

  const handleAvailabilityChange = (index, field, value) => {
    const newWindows = [...formData.availabilityWindows]
    newWindows[index] = {
      ...newWindows[index],
      [field]: value,
    }
    setFormData((prev) => ({
      ...prev,
      availabilityWindows: newWindows,
    }))
  }

  const addAvailabilityWindow = () => {
    setFormData((prev) => ({
      ...prev,
      availabilityWindows: [...prev.availabilityWindows, { ...defaultAvailability }],
    }))
  }

  const removeAvailabilityWindow = (index) => {
    setFormData((prev) => ({
      ...prev,
      availabilityWindows: prev.availabilityWindows.filter((_, i) => i !== index),
    }))
  }

  const categories = categoriesByType[formData.type] || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-text">
            {resourceToEdit ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="resource-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Resource Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${
                    errors.name ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="e.g. Advanced Robotics Lab"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resource Kind</label>
                <select
                  name="resourceKind"
                  value={formData.resourceKind}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors bg-white"
                >
                  <option value="FACILITY">Facility</option>
                  <option value="ASSET">Asset</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={!typeOptions.length}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors bg-white"
                >
                  <option value="">Select a type</option>
                  {typeOptions.map((typeOption) => (
                    <option key={typeOption.id || typeOption.name} value={typeOption.name}>
                      {typeOption.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={!formData.type || !categories.length}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors bg-white ${
                    errors.category ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">
                    {!formData.type
                      ? 'Select a type first'
                      : categories.length
                        ? 'Select a category'
                        : 'No categories available'}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${
                    errors.location ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="e.g. Engineering Block"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {formData.resourceKind === 'ASSET' ? 'Quantity' : 'Capacity'}
                </label>
                <input
                  type="number"
                  name={formData.resourceKind === 'ASSET' ? 'quantity' : 'capacity'}
                  value={formData.resourceKind === 'ASSET' ? formData.quantity : formData.capacity}
                  onChange={handleChange}
                  min={formData.resourceKind === 'ASSET' ? '0' : '1'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${
                    (formData.resourceKind === 'ASSET' ? errors.quantity : errors.capacity)
                      ? 'border-red-500'
                      : 'border-slate-300'
                  }`}
                />
                {(formData.resourceKind === 'ASSET' ? errors.quantity : errors.capacity) && (
                  <p className="mt-1 text-sm text-red-500">
                    {formData.resourceKind === 'ASSET' ? errors.quantity : errors.capacity}
                  </p>
                )}
              </div>

              {formData.resourceKind === 'ASSET' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Loan Hours</label>
                    <input
                      type="number"
                      name="minLoanHours"
                      value={formData.minLoanHours}
                      onChange={handleChange}
                      min="1"
                      placeholder="Optional"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${
                        errors.minLoanHours ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.minLoanHours && (
                      <p className="mt-1 text-sm text-red-500">{errors.minLoanHours}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Loan Hours *</label>
                    <input
                      type="number"
                      name="maxLoanHours"
                      value={formData.maxLoanHours}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${
                        errors.maxLoanHours ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.maxLoanHours && (
                      <p className="mt-1 text-sm text-red-500">{errors.maxLoanHours}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Default Loan Hours</label>
                    <input
                      type="number"
                      name="defaultLoanHours"
                      value={formData.defaultLoanHours}
                      onChange={handleChange}
                      min="1"
                      placeholder="Optional"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors ${
                        errors.defaultLoanHours ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.defaultLoanHours && (
                      <p className="mt-1 text-sm text-red-500">{errors.defaultLoanHours}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <div className="flex items-center space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="ACTIVE"
                      checked={formData.status === 'ACTIVE'}
                      onChange={handleChange}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-slate-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="OUT_OF_SERVICE"
                      checked={formData.status === 'OUT_OF_SERVICE'}
                      onChange={handleChange}
                      className="text-red-500 focus:ring-red-500 h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-slate-700">Out of Service</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-none"
                placeholder="Brief description of the resource and its capabilities..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Facility Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {formData.imageUrl && (
                <div className="mt-3 h-52 w-full rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                  <img
                    src={formData.imageUrl}
                    alt="Facility preview"
                    className="h-full w-full object-scale-down p-2"
                  />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">Availability Windows</label>
                <button
                  type="button"
                  onClick={addAvailabilityWindow}
                  className="text-xs flex items-center gap-1 text-primary hover:text-teal-800 font-medium"
                >
                  <Plus className="h-3 w-3" /> Add Window
                </button>
              </div>

              <div className="space-y-3">
                {formData.availabilityWindows.map((window, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={window.days}
                        onChange={(e) =>
                          handleAvailabilityChange(index, 'days', e.target.value)
                        }
                        placeholder="e.g. Mon-Fri"
                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                    <div className="w-32 sm:w-36">
                      <input
                        type="time"
                        value={window.startTime}
                        onChange={(e) =>
                          handleAvailabilityChange(index, 'startTime', e.target.value)
                        }
                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                    <span className="text-slate-400">-</span>
                    <div className="w-32 sm:w-36">
                      <input
                        type="time"
                        value={window.endTime}
                        onChange={(e) =>
                          handleAvailabilityChange(index, 'endTime', e.target.value)
                        }
                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAvailabilityWindow(index)}
                      disabled={formData.availabilityWindows.length === 1}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {errors.availability && (
                  <p className="text-sm text-red-500">{errors.availability}</p>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-border bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="resource-form"
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-teal-800 shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {resourceToEdit ? 'Save Changes' : 'Create Resource'}
          </button>
        </div>
      </div>
    </div>
  )
}
