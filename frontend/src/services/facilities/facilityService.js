import api from '../api';

const roleHeaders = (role) => ({
	headers: {
		'X-ROLE': role,
	},
});

export const getFacilities = ({ role = 'USER', ...filters } = {}) =>
	api.get('/facilities', {
		...roleHeaders(role),
		params: {
			type: filters.type || undefined,
			minCapacity: filters.minCapacity || undefined,
			maxCapacity: filters.maxCapacity || undefined,
			location: filters.location || undefined,
			q: filters.q || undefined,
		},
	});

export const getFacilityByResourceId = (resourceId, role = 'USER') =>
	api.get(`/facilities/${resourceId}`, roleHeaders(role));

export const createFacility = (payload, role = 'ADMIN') =>
	api.post('/facilities', payload, roleHeaders(role));

export const updateFacility = (resourceId, payload, role = 'ADMIN') =>
	api.put(`/facilities/${resourceId}`, payload, roleHeaders(role));

export const updateFacilityStatus = (resourceId, status, role = 'ADMIN') =>
	api.patch(`/facilities/${resourceId}/status`, { status }, roleHeaders(role));

export const deleteFacility = (resourceId, role = 'ADMIN') =>
	api.delete(`/facilities/${resourceId}`, roleHeaders(role));

export const uploadFacilityImage = (file, role = 'ADMIN') => {
	const formData = new FormData();
	formData.append('file', file);
	return api.post('/facilities/upload-image', formData, roleHeaders(role));
};
