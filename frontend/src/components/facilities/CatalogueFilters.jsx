import React from 'react';
import { buildCategoriesByType, buildSearchSuggestions } from './data/facilityTaxonomy';

const CatalogueFilters = ({ filters, setFilters, taxonomy, onApply, onReset }) => {
  const typeOptions = taxonomy?.types || [];
  const categoriesByType = buildCategoriesByType(typeOptions);
  const categoryOptions = Array.from(new Set(Object.values(categoriesByType).flat().filter(Boolean)));
  const searchSuggestions = buildSearchSuggestions(typeOptions);

  return (
    <form
      className="facility-filters"
      onSubmit={(event) => {
        event.preventDefault();
        onApply();
      }}
    >
      <input
        placeholder="Search by name, id, type, or category"
        list="facility-search-suggestions"
        value={filters.q}
        onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
      />
      <datalist id="facility-search-suggestions">
        {searchSuggestions.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <select
        value={filters.resourceKind || ''}
        onChange={(event) => setFilters((prev) => ({ ...prev, resourceKind: event.target.value }))}
      >
        <option value="">All kinds</option>
        <option value="FACILITY">Facilities</option>
        <option value="ASSET">Assets</option>
      </select>
      <select
        value={filters.type}
        onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
      >
        <option value="">All types</option>
        {typeOptions.map((type) => (
          <option key={type.id || type.name} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>
      <select
        value={filters.category || ''}
        onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
      >
        <option value="">All categories</option>
        {categoryOptions.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
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
        type="number"
        min="0"
        placeholder="Min quantity"
        value={filters.minQuantity}
        onChange={(event) => setFilters((prev) => ({ ...prev, minQuantity: event.target.value }))}
      />
      <input
        type="number"
        min="0"
        placeholder="Max quantity"
        value={filters.maxQuantity}
        onChange={(event) => setFilters((prev) => ({ ...prev, maxQuantity: event.target.value }))}
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
