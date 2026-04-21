import React, { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  createFacilityCategory,
  createFacilityType,
  deleteFacilityCategory,
  deleteFacilityType,
} from '../../../services/facilities/taxonomyService'

export const FacilityTaxonomyPanel = ({ taxonomy, onChanged }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeForm, setActiveForm] = useState(null)
  const [typeName, setTypeName] = useState('')
  const [selectedTypeId, setSelectedTypeId] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [deletingId, setDeletingId] = useState('')

  const types = taxonomy?.types || []
  const totalCategories = useMemo(
    () => types.reduce((count, type) => count + (type.categories?.length || 0), 0),
    [types],
  )

  const resetError = () => setError('')

  const handleAddType = async (event) => {
    event.preventDefault()
    const trimmed = typeName.trim()
    if (!trimmed) {
      setError('Type name is required.')
      return
    }

    setBusy(true)
    setError('')
    try {
      await createFacilityType({ name: trimmed }, 'ADMIN')
      setTypeName('')
      setActiveForm(null)
      await onChanged?.()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add type.')
    } finally {
      setBusy(false)
    }
  }

  const handleAddCategory = async (event) => {
    event.preventDefault()
    const trimmed = categoryName.trim()
    if (!selectedTypeId) {
      setError('Select a type first.')
      return
    }
    if (!trimmed) {
      setError('Category name is required.')
      return
    }

    setBusy(true)
    setError('')
    try {
      await createFacilityCategory(selectedTypeId, { name: trimmed }, 'ADMIN')
      setCategoryName('')
      setActiveForm(null)
      await onChanged?.()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add category.')
    } finally {
      setBusy(false)
    }
  }

  const handleDeleteType = async (typeId) => {
    setDeletingId(typeId)
    setError('')
    try {
      await deleteFacilityType(typeId, 'ADMIN')
      if (selectedTypeId === typeId) {
        setSelectedTypeId('')
      }
      await onChanged?.()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete type.')
    } finally {
      setDeletingId('')
    }
  }

  const handleDeleteCategory = async (typeId, categoryId) => {
    setDeletingId(categoryId)
    setError('')
    try {
      await deleteFacilityCategory(typeId, categoryId, 'ADMIN')
      await onChanged?.()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete category.')
    } finally {
      setDeletingId('')
    }
  }

  return (
    <section className="mb-8 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full border-b border-border px-5 py-4 bg-slate-50/70 text-left flex items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-lg font-bold text-text">Facility Types and Categories</h2>
          <p className="text-sm text-slate-600">
            Manage the labels used when creating campus resources.
          </p>
        </div>
        <span className="text-sm font-medium text-primary whitespace-nowrap">
          {isOpen ? 'Hide' : 'Show'}
        </span>
      </button>

      {!isOpen && (
        <div className="px-5 py-4 text-sm text-slate-500">
          {types.length} type(s), {totalCategories} categor{totalCategories === 1 ? 'y' : 'ies'} stored
        </div>
      )}

      {isOpen && error && (
        <div className="px-5 py-3 border-b border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {isOpen && (
        <div className="p-5 space-y-6">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveForm('type')}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
            >
              <Plus className="h-4 w-4" /> Add Type
            </button>
            <button
              type="button"
              onClick={() => setActiveForm('category')}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text hover:bg-slate-50"
            >
              <Plus className="h-4 w-4" /> Add Category
            </button>
          </div>

          {activeForm === 'type' && (
            <form onSubmit={handleAddType} className="rounded-xl border border-border bg-white p-4 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-text">Add Type</h3>
                <p className="text-sm text-slate-500">Create a new type label from the database.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type name</label>
                <input
                  type="text"
                  value={typeName}
                  onChange={(event) => {
                    setTypeName(event.target.value)
                    if (error) resetError()
                  }}
                  placeholder="e.g. Auditorium"
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:ring-primary outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
              >
                <Plus className="h-4 w-4" /> Add Type
              </button>
            </form>
          )}

          {activeForm === 'category' && (
            <form onSubmit={handleAddCategory} className="rounded-xl border border-border bg-white p-4 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-text">Add Category</h3>
                <p className="text-sm text-slate-500">Pick a type, then add a new category label under it.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={selectedTypeId}
                  onChange={(event) => {
                    setSelectedTypeId(event.target.value)
                    if (error) resetError()
                  }}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-primary focus:ring-primary outline-none"
                >
                  <option value="">Select a type</option>
                  {types.map((type) => (
                    <option key={type.id || type.name} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category name</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(event) => {
                    setCategoryName(event.target.value)
                    if (error) resetError()
                  }}
                  placeholder="e.g. Seminar Hall"
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:ring-primary outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
              >
                <Plus className="h-4 w-4" /> Add Category
              </button>
            </form>
          )}

          {!activeForm && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
              Choose <span className="font-medium text-text">Add Type</span> or <span className="font-medium text-text">Add Category</span> to show the input fields.
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="border-t border-border bg-slate-50/60 p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {types.map((type) => (
              <div key={type.id || type.name} className="rounded-xl border border-border bg-white p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-text">{type.name}</h3>
                    <p className="text-xs text-slate-500 break-all">ID: {type.id}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteType(type.id)}
                    disabled={busy || deletingId === type.id}
                    className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(type.categories || []).map((category) => (
                    <span
                      key={category.id || category.name}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {category.name}
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(type.id, category.id)}
                        disabled={busy || deletingId === category.id}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Delete ${category.name}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {(type.categories || []).length === 0 && (
                    <span className="text-sm text-slate-500">No categories yet</span>
                  )}
                </div>
              </div>
            ))}
            {!types.length && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500 md:col-span-2 xl:col-span-3">
                No types have been created yet.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
