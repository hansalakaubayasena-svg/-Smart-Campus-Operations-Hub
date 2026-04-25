import { useEffect, useState } from "react";
import { AlertCircle, ImagePlus, Loader2, Send } from "lucide-react";

const initialForm = {
  resourceName: "",
  category: "Electrical",
  location: "",
  priority: "MEDIUM",
  description: "",
  preferredContactName: "",
  preferredContactEmail: "",
  preferredContactPhone: "",
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const TicketForm = ({ actorUser, onSubmit, submitting = false }) => {
  const [form, setForm] = useState({
    ...initialForm,
    preferredContactName: actorUser?.fullName ?? "",
    preferredContactEmail: actorUser?.email ?? "",
  });
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!actorUser) return;

    setForm((current) => ({
      ...current,
      preferredContactName:
        current.preferredContactName || actorUser.fullName || "",
      preferredContactEmail:
        current.preferredContactEmail || actorUser.email || "",
    }));
  }, [actorUser]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
  };

  const handleAttachmentChange = async (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    try {
      const nextAttachments = await Promise.all(
        selectedFiles.map(async (file) => {
          // Detect proper image MIME type
          let contentType = file.type;
          if (!contentType || !contentType.startsWith("image/")) {
            const fileName = file.name.toLowerCase();
            if (fileName.endsWith(".png")) contentType = "image/png";
            else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) contentType = "image/jpeg";
            else if (fileName.endsWith(".gif")) contentType = "image/gif";
            else if (fileName.endsWith(".webp")) contentType = "image/webp";
            else contentType = "image/png"; // Default to PNG
          }
          return {
            fileName: file.name,
            contentType,
            dataUrl: await readFileAsDataUrl(file),
          };
        }),
      );

      setAttachments((current) => [...current, ...nextAttachments].slice(0, 3));
      setError("");
    } catch {
      setError("Attachments could not be read. Please try another image.");
    } finally {
      event.target.value = "";
    }
  };

  const removeAttachment = (fileName) => {
    setAttachments((current) =>
      current.filter((attachment) => attachment.fileName !== fileName),
    );
  };

  const resetForm = () => {
    setForm({
      ...initialForm,
      preferredContactName: actorUser?.fullName ?? "",
      preferredContactEmail: actorUser?.email ?? "",
    });
    setAttachments([]);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.resourceName.trim() ||
      !form.location.trim() ||
      !form.description.trim() ||
      !form.preferredContactName.trim() ||
      !form.preferredContactEmail.trim() ||
      !form.preferredContactPhone.trim()
    ) {
      setError(
        "Problem title, location, description, and complete contact information are required."
      );
      return;
    }

    try {
      await onSubmit({
        ...form,
        resourceName: form.resourceName.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        preferredContactName: form.preferredContactName.trim(),
        preferredContactEmail: form.preferredContactEmail.trim(),
        preferredContactPhone: form.preferredContactPhone.trim(),
        attachments,
      });
      resetForm();
    } catch (submitError) {
      setError(
        submitError?.response?.data?.message ||
          "Ticket could not be raised right now. Please try again.",
      );
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            User Portal
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Raise A Maintenance Ticket
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Tell the support team what went wrong. After submission you can track
            progress, but only technicians can update the solution.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          View only after submit
        </span>
      </div>

      {error ? (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-left text-sm font-medium text-slate-700">
            Problem Title
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
              placeholder="Air conditioner not working"
              value={form.resourceName}
              onChange={(event) => updateField("resourceName", event.target.value)}
            />
          </label>

          <label className="text-left text-sm font-medium text-slate-700">
            Category
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
            >
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Network">Network</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Equipment">Equipment</option>
              <option value="Safety">Safety</option>
              <option value="General">General</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-left text-sm font-medium text-slate-700">
            Exact Location
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
              placeholder="Block B, Lab 02, Second Floor"
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
            />
          </label>

          <label className="text-left text-sm font-medium text-slate-700">
            Priority
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
              value={form.priority}
              onChange={(event) => updateField("priority", event.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </label>
        </div>

        <label className="block text-left text-sm font-medium text-slate-700">
          Describe The Problem
          <textarea
            rows={5}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
            placeholder="Explain the issue clearly so the technician can diagnose it faster."
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-left text-sm font-medium text-slate-700">
            Contact Name
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
              value={form.preferredContactName}
              onChange={(event) =>
                updateField("preferredContactName", event.target.value)
              }
            />
          </label>

          <label className="text-left text-sm font-medium text-slate-700">
            Contact Email
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
              value={form.preferredContactEmail}
              onChange={(event) =>
                updateField("preferredContactEmail", event.target.value)
              }
            />
          </label>

          <label className="text-left text-sm font-medium text-slate-700">
            Contact Phone
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
              placeholder="0771234567"
              value={form.preferredContactPhone}
              onChange={(event) =>
                updateField("preferredContactPhone", event.target.value)
              }
            />
          </label>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-left">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100">
            <ImagePlus className="h-4 w-4" />
            Add Evidence Images
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleAttachmentChange}
            />
          </label>
          <p className="mt-2 text-xs text-slate-500">
            Upload up to 3 screenshots or photos to help the technician.
          </p>
          {attachments.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {attachments.map((attachment) => (
                <button
                  key={attachment.fileName}
                  type="button"
                  onClick={() => removeAttachment(attachment.fileName)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 transition hover:border-red-200 hover:text-red-600"
                >
                  {attachment.fileName} x
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Raising Ticket...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Raise Ticket
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default TicketForm;
