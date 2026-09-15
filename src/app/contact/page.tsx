"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { sendContactMessage } from "@/lib/api";

const SUBJECTS = ["Booking Modification", "Payment Issue", "General Inquiry", "Feedback"];

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: SUBJECTS[0], message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName.trim() || !form.email.trim()) {
      setStatus("error");
      setStatusMessage("Please fill in your name and email.");
      return;
    }
    if (form.message.trim().length < 10) {
      setStatus("error");
      setStatusMessage("Your message must be at least 10 characters.");
      return;
    }

    setSubmitting(true);
    setStatus("idle");

    const fullName = `${form.firstName} ${form.lastName}`.trim();

    // Backend has no dedicated "subject" field, so it's folded into the
    // message body — ContactController::send() only accepts name/email/phone/message.
    const result = await sendContactMessage({
      name: fullName,
      email: form.email,
      phone: "",
      message: `Subject: ${form.subject}\n\n${form.message}`,
    });

    setSubmitting(false);
    setStatusMessage(result.message);

    if (result.ok) {
      setStatus("success");
      setForm({ firstName: "", lastName: "", email: "", subject: SUBJECTS[0], message: "" });
    } else {
      setStatus("error");
    }
  };

  const handleLiveChat = () => toast("Live chat is coming soon — please use the form or call us 24/7.");

  return (
    <>
      <Header />
      <main className="flex-grow pt-20 pb-24 md:pb-xl px-container-margin max-w-7xl mx-auto w-full">
        <section className="text-center mb-xl">
          <h1 className="font-display-lg text-display-lg text-primary mb-sm">Contact Support</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Need help now? We&apos;re online 24/7 to assist you.</p>
          <div className="mt-lg">
            <button
              onClick={handleLiveChat}
              className="bg-[#F5A623] text-[#0B1D3A] font-label-bold text-label-bold px-lg py-sm rounded-full flex items-center justify-center mx-auto gap-xs active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">chat</span>
              Live Chat Now
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
          {/* Direct contact info */}
          <div className="md:col-span-5 bg-surface-container-lowest rounded-xl p-lg shadow-sm border border-outline-variant flex flex-col gap-md">
            <div className="flex items-center gap-md mb-md">
              <div className="w-16 h-16 rounded flex items-center justify-center bg-surface-container-low text-2xl">✈️</div>
              <h2 className="font-headline-md text-headline-md text-primary">Direct Contact</h2>
            </div>

            <ContactRow icon="call" label="24/7 Phone (DXB Local)" value="+971 50 247 7593" large />
            <ContactRow icon="mail" label="Email Support" value="support@airporthoteldubai.com" />
            <ContactRow
              icon="location_on"
              label="Office Address"
              value={
                <>
                 HDS Towers
                  <br />
                JLT cluster F               <br />
                  Dubai, UAE
                </>
              }
            />
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-surface-container-lowest rounded-xl p-lg" style={{ boxShadow: "0px 4px 12px rgba(26,43,66,0.08)" }}>
            <h2 className="font-headline-md text-headline-md text-primary mb-xs">Send an Inquiry</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
              For non-urgent inquiries, please use the form below. We typically respond within 2-4 hours.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-label-sm text-on-surface">First Name</label>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    className="h-[48px] rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 px-sm font-body-md text-body-md transition-all"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-label-sm text-on-surface">Last Name</label>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    className="h-[48px] rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 px-sm font-body-md text-body-md transition-all"
                    type="text"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-label-sm text-on-surface">Email Address</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="h-[48px] rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 px-sm font-body-md text-body-md transition-all"
                  type="email"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-label-sm text-on-surface">Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="h-[48px] rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 px-sm font-body-md text-body-md transition-all"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-label-sm text-on-surface">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  rows={4}
                  className="rounded-lg border border-outline-variant bg-surface focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 px-sm py-sm font-body-md text-body-md transition-all resize-none"
                />
              </div>

              {status === "success" && <p className="text-green-700 text-sm">{statusMessage}</p>}
              {status === "error" && <p className="text-error text-sm">{statusMessage}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="mt-sm bg-[#0B1D3A] text-white font-label-bold text-label-bold h-[48px] rounded-lg flex items-center justify-center active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}

function ContactRow({ icon, label, value, large }: { icon: string; label: string; value: React.ReactNode; large?: boolean }) {
  return (
    <div className="flex items-start gap-md">
      <div className="bg-surface-container-low p-sm rounded-full text-primary-container">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{label}</p>
        <p className={large ? "font-body-lg text-body-lg text-primary" : "font-body-md text-body-md text-primary"}>{value}</p>
      </div>
    </div>
  );
}