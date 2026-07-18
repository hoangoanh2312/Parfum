"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const reasons = [
  {
    id: 1,
    index: "01",
    tag: "Savoir-faire",
    title: "Artisanal\nCraftsmanship",
    description:
      "Every vessel is a masterpiece. Hand-poured bottles and traditional distillation methods passed down through generations of master perfumers — each drop a testimony to living craft.",
    detail: "Est. 1978 · Paris",
  },
  {
    id: 2,
    index: "02",
    tag: "Matières premières",
    title: "Rare\nIngredients",
    description:
      "We scour the globe for the impossible — uniting the finest natural absolutes with groundbreaking synthetics to create olfactory silhouettes that endure long after the moment passes.",
    detail: "40+ Origins worldwide",
  },
  {
    id: 3,
    index: "03",
    tag: "Récit olfactif",
    title: "Curated\nExperience",
    description:
      "Beyond a scent, we offer a narrative. Our editorial approach ensures a deeply personal journey in finding the fragrance that resonates with your unique identity.",
    detail: "Personal consultations",
  },
  {
    id: 4,
    index: "04",
    tag: "Éthique",
    title: "Conscious\nLuxury",
    description:
      "Luxury with a conscience. Cruelty-free practices and ethically sourced materials — preserving the botanicals we cherish for every generation that follows.",
    detail: "Carbon-neutral since 2021",
  },
];

/* ─────────────────────────────────────────────
   Sub-row item (right column)
───────────────────────────────────────────── */
function SubItem({
  reason,
  active,
  onClick,
}: {
  reason: (typeof reasons)[0];
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        paddingBottom: 28,
        borderBottom: "0.5px solid rgba(115,92,0,0.15)",
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: "36px 1fr",
        gap: "0 20px",
        alignItems: "start",
      }}
    >
      {/* Index */}
      <span
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: 9,
          letterSpacing: "0.18em",
          color: active ? "#735C00" : "rgba(115,92,0,0.4)",
          fontWeight: 500,
          paddingTop: 3,
          transition: "color 0.3s ease",
        }}
      >
        {reason.index}
      </span>

      <div>
        {/* Tag */}
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: 9,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: active ? "#735C00" : "#B0A898",
            fontWeight: 500,
            marginBottom: 6,
            transition: "color 0.3s ease",
          }}
        >
          {reason.tag}
        </p>

        {/* Title */}
        <h3
          style={{
            fontFamily: "'Spectral', Georgia, serif",
            fontSize: 17,
            fontWeight: 300,
            color: active ? "#1D1C19" : "#5A554F",
            lineHeight: 1.25,
            transition: "color 0.3s ease",
            whiteSpace: "pre-line",
          }}
        >
          {reason.title}
        </h3>

        {/* Expand line */}
        <div
          style={{
            height: "0.5px",
            background: "#735C00",
            marginTop: 14,
            transformOrigin: "left",
            transform: active || hovered ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function WhyChooseUs() {
  const [active, setActive] = useState(0);
  const featured = reasons[active];

  return (
    <section
      style={{
        background: "#FCF9F4",
        padding: "88px 32px 96px",
        fontFamily: "'Manrope', 'Helvetica Neue', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 64,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "#735C00",
                fontWeight: 500,
                marginBottom: 14,
              }}
            >
              The editorial standard
            </p>
            <h2
              style={{
                fontFamily: "'Spectral', Georgia, serif",
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 300,
                color: "#1D1C19",
                lineHeight: 1.1,
              }}
            >
              Why <em style={{ fontStyle: "italic" }}>Choose</em> Us
            </h2>
          </div>

          {/* Counter */}
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "#B0A898",
              fontWeight: 500,
            }}
          >
            {String(active + 1).padStart(2, "0")} — {String(reasons.length).padStart(2, "0")}
          </p>
        </div>

        {/* ── Body: asymmetric layout ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: "0 80px",
            alignItems: "start",
          }}
        >

          {/* LEFT — Featured panel */}
          <div
            style={{
              borderTop: "0.5px solid rgba(115,92,0,0.25)",
              paddingTop: 40,
            }}
          >
            {/* Tag */}
            <p
              key={`tag-${active}`}
              style={{
                fontSize: 9.5,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#735C00",
                fontWeight: 500,
                marginBottom: 24,
                animation: "fadeUp 0.6s ease both",
              }}
            >
              {featured.tag}
            </p>

            {/* Title */}
            <h3
              key={`title-${active}`}
              style={{
                fontFamily: "'Spectral', Georgia, serif",
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 300,
                color: "#1D1C19",
                lineHeight: 1.1,
                marginBottom: 36,
                whiteSpace: "pre-line",
                animation: "fadeUp 0.65s ease 0.05s both",
              }}
            >
              {featured.title}
            </h3>

            {/* Description */}
            <p
              key={`desc-${active}`}
              style={{
                fontSize: 14,
                lineHeight: 1.85,
                color: "#7D7870",
                maxWidth: 520,
                marginBottom: 40,
                animation: "fadeUp 0.7s ease 0.1s both",
              }}
            >
              {featured.description}
            </p>

            {/* Detail pill */}
            <div
              key={`detail-${active}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                animation: "fadeUp 0.75s ease 0.15s both",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 24,
                  height: "0.5px",
                  background: "#735C00",
                }}
              />
              <span
                style={{
                  fontSize: 9.5,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#735C00",
                  fontWeight: 500,
                }}
              >
                {featured.detail}
              </span>
            </div>
          </div>

          {/* RIGHT — Sub-list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {reasons.map((r, i) => (
              <SubItem
                key={r.id}
                reason={r}
                active={i === active}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Keyframe */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}