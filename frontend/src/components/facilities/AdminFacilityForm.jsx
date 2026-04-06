import React, { useMemo, useState } from 'react';

const initialForm = {
  resourceId: '',
  type: 'ROOM',
  nameOrModel: '',
  capacity: 0,
  location: '',
  availabilityWindows: 'Mon-Fri 08:00-17:00',
  status: 'ACTIVE',
};

const AdminFacilityForm = ({ onCreate }) => {
  const [form, setForm] = useState(initialForm);

  const payload = useMemo(() => ({
    ...form,
    capacity: Number(form.capacity),
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
        value={form.type}
        onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
      >
        <option value="ROOM">Room</option>
        <option value="EQUIPMENT">Equipment</option>
        <option value="LAB">Lab</option>
        <option value="MEETING_ROOM">Meeting Room</option>
        <option value="LECTURE_HALL">Lecture Hall</option>
      </select>
      <input
        type="number"
        min="0"
        required
        placeholder="Capacity"
        value={form.capacity}
        onChange={(event) => setForm((prev) => ({ ...prev, capacity: event.target.value }))}
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
