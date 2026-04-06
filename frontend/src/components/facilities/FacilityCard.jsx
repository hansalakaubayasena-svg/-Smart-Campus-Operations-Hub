import React from 'react';

const FacilityCard = ({ facility }) => {
    return (
        <div className='card'>
            <h3>{facility?.name}</h3>
        </div>
    );
};

export default FacilityCard;
