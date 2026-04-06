import React from 'react';

const FacilityCard = ({ facility }) => {
    return (
        <div className='facility-card'>
            <div className='facility-top'>
                <h3>{facility?.nameOrModel}</h3>
                <span className={`facility-status ${facility?.status === 'ACTIVE' ? 'active' : 'out'}`}>
                    {facility?.status}
                </span>
            </div>
            <p><strong>Resource ID:</strong> {facility?.resourceId}</p>
            <p><strong>Type:</strong> {facility?.type}</p>
            <p><strong>Capacity:</strong> {facility?.capacity}</p>
            <p><strong>Location:</strong> {facility?.location}</p>
            <p><strong>Availability:</strong> {(facility?.availabilityWindows || []).join(', ')}</p>
        </div>
    );
};

export default FacilityCard;
