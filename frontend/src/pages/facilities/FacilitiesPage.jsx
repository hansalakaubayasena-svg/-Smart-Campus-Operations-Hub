import React, { useEffect, useMemo, useState } from 'react';
import FacilityCard from '../../components/facilities/FacilityCard';
import CatalogueFilters from '../../components/facilities/CatalogueFilters';
import AdminFacilityForm from '../../components/facilities/AdminFacilityForm';
import {
  createFacility,
  deleteFacility,
  getFacilities,
  updateFacilityStatus,
} from '../../services/facilities/facilityService';
import { getFacilityTaxonomy } from '../../services/facilities/taxonomyService';
import '../../index.css';

const FacilitiesPage = ({ forcedRole }) => {
    const [role, setRole] = useState(forcedRole || 'ADMIN');
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
        const [taxonomy, setTaxonomy] = useState({ types: [] });
    const [filters, setFilters] = useState({
        resourceKind: '',
        type: '',
            category: '',
        minCapacity: '',
        maxCapacity: '',
        minQuantity: '',
        maxQuantity: '',
        location: '',
        q: '',
    });

    const isAdmin = useMemo(() => role === 'ADMIN', [role]);

    useEffect(() => {
        if (forcedRole && forcedRole !== role) {
            setRole(forcedRole);
        }
    }, [forcedRole, role]);

    const loadFacilities = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getFacilities({ role, ...filters });
            setFacilities(response.data);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load facilities.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFacilities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role]);

        useEffect(() => {
            let active = true;

            const loadTaxonomy = async () => {
                try {
                    const response = await getFacilityTaxonomy({ role });
                    if (active) {
                        setTaxonomy(response.data || { types: [] });
                    }
                } catch {
                    if (active) {
                        setTaxonomy({ types: [] });
                    }
                }
            };

            loadTaxonomy();

            return () => {
                active = false;
            };
        }, [role]);

    const handleCreate = async (payload) => {
        setError('');
        try {
            await createFacility(payload, role);
            await loadFacilities();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to create facility.');
        }
    };

    const handleDelete = async (resourceId) => {
        setError('');
        try {
            await deleteFacility(resourceId, role);
            await loadFacilities();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to delete facility.');
        }
    };

    const handleStatusToggle = async (facility) => {
        const nextStatus = facility.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE';
        setError('');
        try {
            await updateFacilityStatus(facility.resourceId, nextStatus, role);
            await loadFacilities();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to update status.');
        }
    };

    const resetFilters = () => {
        setFilters({
            resourceKind: '',
            type: '',
                category: '',
            minCapacity: '',
            maxCapacity: '',
            minQuantity: '',
            maxQuantity: '',
            location: '',
            q: '',
        });
    };

    return (
        <div className="facilities-page">
            <header className="facilities-header">
                <div>
                    <h1>Facilities and Assets Catalogue</h1>
                    <p>
                        {isAdmin
                            ? 'Manage lecture halls, labs, meeting rooms, and equipment.'
                            : 'Browse lecture halls, labs, meeting rooms, and equipment.'}
                    </p>
                </div>

                {!forcedRole && (
                    <div className="role-switch">
                        <label htmlFor="role">Role</label>
                        <select id="role" value={role} onChange={(event) => setRole(event.target.value)}>
                            <option value="USER">USER (read-only)</option>
                            <option value="ADMIN">ADMIN (full access)</option>
                        </select>
                    </div>
                )}
            </header>

            <CatalogueFilters
                filters={filters}
                setFilters={setFilters}
                    taxonomy={taxonomy}
                onApply={loadFacilities}
                onReset={() => {
                    resetFilters();
                    setTimeout(loadFacilities, 0);
                }}
            />

            {error && <div className="error-banner">{error}</div>}

            {isAdmin && (
                 <AdminFacilityForm onCreate={handleCreate} taxonomy={taxonomy} />
            )}

            {loading ? (
                <p className="loading-text">Loading facilities...</p>
            ) : (
                <div className="facility-grid">
                    {facilities.map((facility) => (
                        <div key={facility.resourceId} className="facility-grid-item">
                            <FacilityCard facility={facility} />
                            {isAdmin && (
                                <div className="facility-actions">
                                    <button
                                        className="btn secondary"
                                        onClick={() => handleStatusToggle(facility)}
                                    >
                                        Toggle Status
                                    </button>
                                    <button
                                        className="btn danger"
                                        onClick={() => handleDelete(facility.resourceId)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {facilities.length === 0 && <p>No facilities found for the selected filters.</p>}
                </div>
            )}
        </div>
    );
};

export default FacilitiesPage;
