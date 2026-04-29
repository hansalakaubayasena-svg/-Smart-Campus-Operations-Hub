import api from '../api';

const roleHeaders = (role) => ({
	headers: {
		'X-ROLE': role,
	},
});

export const getFacilities = ({ role = 'USER', ...filters } = {}) =>
	api.get('/api/facilities', {
		...roleHeaders(role),
		params: {
			resourceKind: filters.resourceKind || undefined,
			type: filters.type || undefined,
			category: filters.category || undefined,
			minCapacity: filters.minCapacity || undefined,
			maxCapacity: filters.maxCapacity || undefined,
			minQuantity: filters.minQuantity || undefined,
			maxQuantity: filters.maxQuantity || undefined,
			location: filters.location || undefined,
			q: filters.q || undefined,
		},
	});

export const getFacilityByResourceId = (resourceId, role = 'USER') =>
	api.get(`/api/facilities/${resourceId}`, roleHeaders(role));

export const createFacility = (payload, role = 'ADMIN') =>
	api.post('/api/facilities', payload, roleHeaders(role));

export const updateFacility = (resourceId, payload, role = 'ADMIN') =>
	api.put(`/api/facilities/${resourceId}`, payload, roleHeaders(role));

export const updateFacilityStatus = (resourceId, status, role = 'ADMIN') =>
	api.patch(`/api/facilities/${resourceId}/status`, { status }, roleHeaders(role));

export const deleteFacility = (resourceId, role = 'ADMIN') =>
	api.delete(`/api/facilities/${resourceId}`, roleHeaders(role));

export const uploadFacilityImage = (resourceId, file, role = 'ADMIN') => {
	const formData = new FormData();
	formData.append('file', file);
	return api.put(`/api/facilities/${resourceId}/image`, formData, {
		headers: {
			'X-ROLE': role,
			'Content-Type': 'multipart/form-data',
		},
	});
};
