import React, { useMemo, useState } from 'react';

const initialForm = {
  resourceId: '',
  resourceKind: 'FACILITY',
  type: '',
  category: '',
  nameOrModel: '',
  capacity: 0,
  quantity: 0,
  location: '',
  availabilityWindows: 'Mon-Fri 08:00-17:00',
  status: 'ACTIVE',
};

const AdminFacilityForm = ({ onCreate, taxonomy }) => {
  const [form, setForm] = useState(initialForm);
  const typeOptions = taxonomy?.types || [];
  const categoriesByType = useMemo(
    () => (taxonomy?.types || []).reduce((acc, type) => {
      acc[type.name] = (type.categories || []).map((category) => category.name);
      return acc;
    }, {}),
    [taxonomy],
  );
  const categoryOptions = categoriesByType[form.type] || [];

  const payload = useMemo(() => ({
    ...form,
    capacity: form.resourceKind === 'FACILITY' ? Number(form.capacity) : null,
    quantity: form.resourceKind === 'ASSET' ? Number(form.quantity) : null,
    availabilityWindows: form.availabilityWindows
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  }), [form]);

  const submit = (event) => {
    event.preventDefault();
    onCreate(payload);
    setForm(initialForm);
  };

  return (
    <form className="facility-admin-form" onSubmit={submit}>
      <h3>Add New Resource</h3>
      <input
        required
        placeholder="Resource ID"
        value={form.resourceId}
        onChange={(event) => setForm((prev) => ({ ...prev, resourceId: event.target.value }))}
      />
      <input
        required
        placeholder="Name / Model"
        value={form.nameOrModel}
        onChange={(event) => setForm((prev) => ({ ...prev, nameOrModel: event.target.value }))}
      />
      <select
        value={form.resourceKind}
        onChange={(event) =>
          setForm((prev) => ({
            ...prev,
            resourceKind: event.target.value,
          }))
        }
      >
        <option value="FACILITY">Facility</option>
        <option value="ASSET">Asset</option>
      </select>
      <select
        value={form.type}
        onChange={(event) =>
          setForm((prev) => ({
            ...prev,
            type: event.target.value,
            category: (categoriesByType[event.target.value] || []).includes(prev.category)
              ? prev.category
              : '',
          }))
        }
      >
        <option value="">Select type</option>
        {typeOptions.map((type) => (
          <option key={type.id || type.name} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>
      <input
        required
        list="admin-facility-category-options"
        placeholder="Category"
        value={form.category}
        onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
      />
      <datalist id="admin-facility-category-options">
        {categoryOptions.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
      <input
        type="number"
        min="0"
        required
        placeholder={form.resourceKind === 'ASSET' ? 'Quantity' : 'Capacity'}
        value={form.resourceKind === 'ASSET' ? form.quantity : form.capacity}
        onChange={(event) =>
          setForm((prev) => ({
            ...prev,
            [form.resourceKind === 'ASSET' ? 'quantity' : 'capacity']: event.target.value,
          }))
        }
      />
      <input
        required
        placeholder="Location"
        value={form.location}
        onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
      />
      <input
        required
        placeholder="Availability windows (comma separated)"
        value={form.availabilityWindows}
        onChange={(event) => setForm((prev) => ({ ...prev, availabilityWindows: event.target.value }))}
      />
      <select
        value={form.status}
        onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
      >
        <option value="ACTIVE">ACTIVE</option>
        <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
      </select>
      <button className="btn" type="submit">Create</button>
    </form>
  );
};

export default AdminFacilityForm;
