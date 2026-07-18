"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const SUBJECTS = [
  "Private consultation",
  "Product enquiry",
  "Order support",
  "Press and editorial",
  "Other",
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSend = () => {
    if (!form.firstName || !form.email || !form.message) {
      setToast({ text: "Fill in your name, email, and message to continue.", type: "error" });
      return;
    }
    setToast({ text: "Message sent — we'll be in touch shortly.", type: "success" });
    setForm(EMPTY);
  };

  const handleClear = () => {
    setForm(EMPTY);
    setToast(null);
  };

  return (
    <main
      className="min-h-screen"
      style={{ background: "#FDF9F4", color: "#1a1a18", fontFamily: "'Manrope', 'Helvetica Neue', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* ── Hero strip ── */}
        <div
          className="grid"
          style={{ gridTemplateColumns: "1fr 1fr", borderBottom: "0.5px solid rgba(26,26,24,0.14)" }}
        >
          {/* Left */}
          <div
            className="flex flex-col justify-end"
            style={{ padding: "64px 48px 52px" }}
          >
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#735C00",
                fontWeight: 500,
                marginBottom: 12,
              }}
            >
              Contact the atelier
            </p>
            <h1
              style={{
                fontFamily: "'Spectral', Georgia, serif",
                fontSize: 52,
                fontWeight: 300,
                lineHeight: 1.1,
                marginBottom: 18,
              }}
            >
              Begin a<br />
              <em style={{ fontStyle: "italic" }}>Dialogue</em>
            </h1>
            <p style={{ fontSize: 13, color: "#6b6b65", lineHeight: 1.8, maxWidth: 280 }}>
              Whether it's a question about provenance, a private consultation,
              or simply a note — we read every letter.
            </p>
          </div>

          {/* Right — dark quote panel */}
          <div
            className="flex flex-col justify-end"
            style={{ background: "#1a1a18", padding: "32px 36px", minHeight: 260 }}
          >
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                marginBottom: 8,
              }}
            >
              The editorial voice
            </p>
            <blockquote
              style={{
                fontFamily: "'Spectral', Georgia, serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.75,
                borderLeft: "1.5px solid #A8893A",
                paddingLeft: 14,
              }}
            >
              "A fragrance is not chosen — it reveals itself through conversation."
            </blockquote>
          </div>
        </div>

        {/* ── Body: info + form ── */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "1fr 1.4fr",
            borderBottom: "0.5px solid rgba(26,26,24,0.14)",
          }}
        >
          {/* Info column */}
          <div
            style={{
              padding: "48px 40px",
              borderRight: "0.5px solid rgba(26,26,24,0.14)",
            }}
          >
            {[
              {
                icon: <MapPin size={16} color="#735C00" style={{ marginTop: 2, flexShrink: 0 }} />,
                label: "Atelier",
                content: (
                  <p style={{ fontSize: 13, lineHeight: 1.7 }}>
                    12 Rue du Faubourg<br />
                    Saint-Honoré, Paris<br />
                    75008, France
                  </p>
                ),
              },
              {
                icon: <Phone size={16} color="#735C00" style={{ marginTop: 2, flexShrink: 0 }} />,
                label: "Phone",
                content: (
                  <a
                    href="tel:+84123456789"
                    style={{
                      fontSize: 13,
                      color: "#1a1a18",
                      textDecoration: "none",
                      borderBottom: "0.5px solid rgba(26,26,24,0.2)",
                    }}
                  >
                    (+84) 123 456 789
                  </a>
                ),
              },
              {
                icon: <Mail size={16} color="#735C00" style={{ marginTop: 2, flexShrink: 0 }} />,
                label: "Correspondence",
                content: (
                  <a
                    href="mailto:atelier@lessencenoire.com"
                    style={{
                      fontSize: 13,
                      color: "#1a1a18",
                      textDecoration: "none",
                      borderBottom: "0.5px solid rgba(26,26,24,0.2)",
                    }}
                  >
                    atelier@lessencenoire.com
                  </a>
                ),
              },
              {
                icon: <Clock size={16} color="#735C00" style={{ marginTop: 2, flexShrink: 0 }} />,
                label: "Hours",
                content: (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "3px 16px",
                    }}
                  >
                    {[
                      ["Mon – Fri", "10:00 – 19:00"],
                      ["Saturday", "11:00 – 18:00"],
                      ["Sunday", "By appointment"],
                    ].map(([day, time]) => (
                      <>
                        <span style={{ fontSize: 12, color: "#1a1a18" }}>{day}</span>
                        <span style={{ fontSize: 12, color: "#6b6b65" }}>{time}</span>
                      </>
                    ))}
                  </div>
                ),
              },
            ].map(({ icon, label, content }, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                  padding: "20px 0",
                  borderBottom: i < 3 ? "0.5px solid rgba(26,26,24,0.1)" : undefined,
                }}
              >
                {icon}
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      color: "#6b6b65",
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </p>
                  {content}
                </div>
              </div>
            ))}
          </div>

          {/* Form column */}
          <div style={{ padding: "48px 48px" }}>
            <h2
              style={{
                fontFamily: "'Spectral', Georgia, serif",
                fontSize: 26,
                fontWeight: 300,
                marginBottom: 6,
              }}
            >
              Send a message
            </h2>
            <p style={{ fontSize: 12.5, color: "#6b6b65", marginBottom: 32, lineHeight: 1.7 }}>
              We respond within one business day. For urgent enquiries, reach us by phone.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field label="First name">
                <input
                  type="text"
                  value={form.firstName}
                  onChange={set("firstName")}
                  placeholder="Jean"
                />
              </Field>
              <Field label="Last name">
                <input
                  type="text"
                  value={form.lastName}
                  onChange={set("lastName")}
                  placeholder="Valmont"
                />
              </Field>
            </div>

            <Field label="Email">
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="you@example.com"
              />
            </Field>

            <Field label="Subject">
              <select value={form.subject} onChange={set("subject")}>
                <option value="" disabled>Select a topic</option>
                {SUBJECTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Message">
              <textarea
                rows={5}
                value={form.message}
                onChange={set("message")}
                placeholder="Tell us what's on your mind…"
              />
            </Field>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 28 }}>
              <button
                onClick={handleSend}
                style={{
                  background: "#1a1a18",
                  color: "#fff",
                  border: "none",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  padding: "13px 28px",
                  cursor: "pointer",
                }}
              >
                Send message
              </button>
              <button
                onClick={handleClear}
                style={{
                  background: "transparent",
                  border: "0.5px solid rgba(26,26,24,0.2)",
                  color: "#6b6b65",
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                  padding: "13px 20px",
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            </div>

            {toast && (
              <p
                style={{
                  marginTop: 16,
                  fontSize: 12,
                  color: toast.type === "success" ? "#735C00" : "#993C1D",
                  borderLeft: `2px solid ${toast.type === "success" ? "#735C00" : "#993C1D"}`,
                  paddingLeft: 10,
                  letterSpacing: "0.03em",
                }}
              >
                {toast.text}
              </p>
            )}
          </div>
        </div>

        {/* ── Location strip ── */}
        <div
          style={{
            background: "#2a2520",
            height: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <p
            style={{
              fontSize: 9,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Location
          </p>
          <span
            style={{
              fontFamily: "'Spectral', Georgia, serif",
              fontStyle: "italic",
              fontSize: 14,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            Paris · Ho Chi Minh City · New York
          </span>
        </div>
      </div>
    </main>
  );
}

/* ── Field wrapper ── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label
        style={{
          display: "block",
          fontSize: 10,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: 500,
          color: "#6b6b65",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <style>{`
        .lne-field input,
        .lne-field select,
        .lne-field textarea {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 0.5px solid rgba(26,26,24,0.18);
          outline: none;
          font-family: 'Manrope', 'Helvetica Neue', sans-serif;
          font-size: 13px;
          color: #1a1a18;
          padding: 8px 0;
          transition: border-color 0.2s;
          appearance: none;
        }
        .lne-field input:focus,
        .lne-field select:focus,
        .lne-field textarea:focus {
          border-bottom-color: #735C00;
        }
        .lne-field input::placeholder,
        .lne-field textarea::placeholder {
          color: rgba(107,107,101,0.45);
          font-size: 12px;
        }
        .lne-field textarea { resize: none; line-height: 1.7; }
      `}</style>
      <div className="lne-field">{children}</div>
    </div>
  );
}