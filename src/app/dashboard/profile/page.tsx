"use client";

import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "@/lib/api";

export default function ProfilePage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        if (data) setForm({ name: data.name ?? "", email: data.email ?? "" });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateUserProfile(form);
      const stored = JSON.parse(localStorage.getItem("user") ?? "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, ...form }));
      window.dispatchEvent(new Event("auth-change"));
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (err: unknown) {
      const text = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Update failed.";
      setMessage({ type: "error", text });
    } finally {
      setSaving(false);
    }
  };

  const initials = form.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-secondary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-md max-w-lg">
      <div className="flex items-center gap-md">
        <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center text-xl font-bold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-primary font-semibold truncate">{form.name}</p>
          <p className="text-on-surface-variant text-sm truncate">{form.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg space-y-md">
        <div>
          <label className="block text-xs text-on-surface-variant uppercase tracking-wide mb-2">Full Name</label>
          <input
            type="text"
            value={form.name}
            required
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full h-[48px] px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-sm text-primary transition"
          />
        </div>

        <div>
          <label className="block text-xs text-on-surface-variant uppercase tracking-wide mb-2">Email Address</label>
          <input
            type="email"
            value={form.email}
            required
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className="w-full h-[48px] px-md rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 text-sm text-primary transition"
          />
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 border border-green-200 text-green-800" : "bg-error-container border border-error/30 text-error"}`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-primary-container text-white py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined text-lg">save</span>}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}