"use client";
import React, { useState } from "react";

const steps = [
  {
    id: 1,
    title: "Booked",
    description:
      "The farmer successfully books a delivery slot and receives a digital token confirming the appointment.",
    image: "/steps/step-booked.jpg",
    tagColor: "#d1e8c8",
    tagText: "#3a6b24",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: "Checked-In",
    description:
      "Upon arrival at the center, the farmer presents the token and is officially checked into the system.",
    image: "/steps/step-checkin.jpg",
    tagColor: "#fef3c7",
    tagText: "#78500a",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Waiting",
    description:
      "The farmer waits in the queue until their turn is called for processing.",
    image: "/steps/step-waiting.jpg",
    tagColor: "#fce8d3",
    tagText: "#7c3a0a",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Weighing",
    description:
      "The vehicle carrying the crop is weighed to determine the total quantity delivered.",
    image: "/steps/step-weighing.jpg",
    tagColor: "#e0edf8",
    tagText: "#1e4a7a",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
        <path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
      </svg>
    ),
  },
  {
    id: 5,
    title: "Quality Check",
    description:
      "The crop is inspected based on quality parameters such as grade, moisture, and damage.",
    image: "/steps/step-quality.jpg",
    tagColor: "#e8f4e8",
    tagText: "#2e6b2e",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
    ),
  },
  {
    id: 6,
    title: "Unloading",
    description:
      "After inspection, the crop is unloaded at the designated area within the center.",
    image: "/steps/step-unloading.jpg",
    tagColor: "#fdf0dc",
    tagText: "#7a4a00",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/>
        <path d="M17 15v6"/><path d="m14 18 3 3 3-3"/>
      </svg>
    ),
  },
  {
    id: 7,
    title: "Payment Pending",
    description:
      "The system calculates the payable amount, and the transaction is prepared for processing.",
    image: "/steps/step-payment.jpg",
    tagColor: "#fef9e0",
    tagText: "#7a6000",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>
      </svg>
    ),
  },
  {
    id: 8,
    title: "Completed",
    description:
      "The payment is finalized, a receipt is issued, and the procurement process is successfully completed.",
    image: "/steps/step-completed.jpg",
    tagColor: "#d4edda",
    tagText: "#1e5c2e",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#f7f4ef" }}>
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4"
            style={{ backgroundColor: "#d5e8c8", color: "#3a6b24" }}
          >
            How It Works
          </span>
          <h2
            className="text-4xl sm:text-5xl font-extrabold leading-tight"
            style={{ color: "#1d2f1a" }}
          >
            From Booking to{" "}
            <span style={{ color: "#4a8c2a" }}>Completion</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base" style={{ color: "#6b7a65" }}>
            AgriQueue digitizes the full procurement journey — so every farmer, every crop, and every payment is tracked seamlessly.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              onMouseEnter={() => setHovered(step.id)}
              onMouseLeave={() => setHovered(null)}
              className="relative rounded-2xl overflow-hidden bg-white cursor-default flex flex-col"
              style={{
                boxShadow:
                  hovered === step.id
                    ? "0 16px 40px rgba(60,80,40,0.18)"
                    : "0 2px 12px rgba(60,80,40,0.08)",
                transform: hovered === step.id ? "translateY(-5px)" : "translateY(0)",
                transition: "all 0.3s ease",
                border: "1px solid #e8e3da",
              }}
            >
              {/* Step number pill */}
              <div
                className="absolute top-3 left-3 z-10 h-7 w-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.92)", color: "#3a6b24", border: "1.5px solid #c8dbb8" }}
              >
                {step.id}
              </div>

              {/* Image or placeholder */}
              {step.image ? (
                <div className="w-full h-44 overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                    style={{ transform: hovered === step.id ? "scale(1.06)" : "scale(1)" }}
                  />
                </div>
              ) : (
                <div
                  className="w-full h-44 flex items-center justify-center"
                  style={{ backgroundColor: step.tagColor }}
                >
                  <div
                    className="p-5 rounded-2xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.6)", color: step.tagText }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      {step.id === 5 && <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>}
                      {step.id === 7 && <><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></>}
                      {step.id === 8 && <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}
                    </svg>
                  </div>
                </div>
              )}

              {/* Card content */}
              <div className="p-5 flex flex-col flex-1">
                {/* Tag */}
                <span
                  className="self-start rounded-full px-3 py-0.5 text-xs font-semibold mb-3 flex items-center gap-1.5"
                  style={{ backgroundColor: step.tagColor, color: step.tagText }}
                >
                  <span className="inline-flex" style={{ color: step.tagText }}>{step.icon}</span>
                  {step.title}
                </span>

                <p className="text-sm leading-relaxed" style={{ color: "#5a6655" }}>
                  {step.description}
                </p>

                {/* Bottom connector */}
                {step.id < 8 && (
                  <div className="mt-4 pt-3 border-t flex items-center gap-1" style={{ borderColor: "#ede8e0" }}>
                    <span className="text-xs font-medium" style={{ color: "#9aaa90" }}>
                      Next
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9aaa90" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                    <span className="text-xs font-semibold" style={{ color: "#4a8c2a" }}>
                      {steps[step.id]?.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="text-sm mb-4" style={{ color: "#6b7a65" }}>
            Ready to simplify your procurement process?
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5 shadow-md"
            style={{ backgroundColor: "#4a8c2a", color: "#fff" }}
          >
            Get Started with AgriQueue
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
