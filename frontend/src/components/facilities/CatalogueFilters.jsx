import React from 'react';

const CatalogueFilters = ({ filters, setFilters, onApply, onReset }) => {
  return (
    <form
      className="facility-filters"
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
    >
      <input
        placeholder="Search by name, id, type"
        value={filters.q}
        onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
      />
      <select
        value={filters.type}
        onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
      >
        <option value="">All types</option>
        <option value="ROOM">Room</option>
        <option value="EQUIPMENT">Equipment</option>
        <option value="LAB">Lab</option>
        <option value="MEETING_ROOM">Meeting Room</option>
        <option value="LECTURE_HALL">Lecture Hall</option>
      </select>
      <input
        type="number"
        min="0"
        placeholder="Min capacity"
        value={filters.minCapacity}
        onChange={(event) => setFilters((prev) => ({ ...prev, minCapacity: event.target.value }))}
      />
      <input
        type="number"
        min="0"
        placeholder="Max capacity"
        value={filters.maxCapacity}
        onChange={(event) => setFilters((prev) => ({ ...prev, maxCapacity: event.target.value }))}
      />
      <input
        placeholder="Location"
        value={filters.location}
        onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value }))}
      />
      <button type="submit" className="btn">Apply</button>
      <button type="button" className="btn secondary" onClick={onReset}>Reset</button>
    </form>
  );
};

export default CatalogueFilters;
