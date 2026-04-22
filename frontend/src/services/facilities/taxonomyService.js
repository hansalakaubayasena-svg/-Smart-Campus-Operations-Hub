import api from '../api'

const roleHeaders = (role) => ({
  headers: {
    'X-ROLE': role,
  },
})

export const getFacilityTaxonomy = ({ role = 'USER' } = {}) =>
  api.get('/api/facilities/taxonomy', roleHeaders(role))

export const createFacilityType = (payload, role = 'ADMIN') =>
  api.post('/api/facilities/taxonomy/types', payload, roleHeaders(role))

export const createFacilityCategory = (typeId, payload, role = 'ADMIN') =>
  api.post(`/api/facilities/taxonomy/types/${typeId}/categories`, payload, roleHeaders(role))

export const deleteFacilityType = (typeId, role = 'ADMIN') =>
  api.delete(`/api/facilities/taxonomy/types/${typeId}`, roleHeaders(role))

export const deleteFacilityCategory = (typeId, categoryId, role = 'ADMIN') =>
  api.delete(`/api/facilities/taxonomy/types/${typeId}/categories/${categoryId}`, roleHeaders(role))
