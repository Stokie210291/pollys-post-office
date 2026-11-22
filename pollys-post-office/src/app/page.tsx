
"use client";

import { useState } from "react";
import { useBusiness } from "./context/BusinessContext";

const sections = [
  { name: "My Shop", emoji: "🛍️", colour: "bg-pink-200", description: "Sell lovely things!" },
  { name: "Post Office", emoji: "📮", colour: "bg-sky-200", description: "Letters and parcels!" },
  { name: "My Till", emoji: "🪙", colour: "bg-yellow-200", description: "Take some money!" },
  { name: "My Business", emoji: "⭐", colour: "bg-purple-200", description: "See how you're doing!" },
];

export default function Home() {
  const { balance } = useBusiness();
  const [stars, setStars] = useState(0);
  const [selected, setSelected] = useState("");

  return (
    <main className="min-h-screen bg-[#fff8f1] p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">

        <header className="mb-6 rounded-[2rem] bg-pink-200 p-6 text-center shadow-sm">
          <div className="text-5xl">📮</div>
          <h1 className="mt-2 text-4xl font-black text-pink-700">
            Polly's Post Office
          </h1>
          <p className="mt-2 text-lg text-pink-800">
            Your very own little business! 💕
          </p>
        </header>

        <section className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-green-100 p-4 text-center">
            <div className="text-3xl">💷</div>
            <p className="text-sm font-bold text-green-800">My Money</p>
            <p className="text-2xl font-black text-green-900">
              £{balance.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl bg-yellow-100 p-4 text-center">
            <div className="text-3xl">⭐</div>
            <p className="text-sm font-bold text-yellow-800">My Stars</p>
            <p className="text-2xl font-black text-yellow-900">{stars}</p>
          </div>
        </section>

        <h2 className="mb-3 text-2xl font-black text-gray-800">
          Where shall we go? 🌈
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {sections.map((section) => (
            <button
              key={section.name}
              onClick={() => {
  
if (section.name === "My Shop") {
  window.location.href = "/shop";
} else if (section.name === "Post Office") {
  window.location.href = "/post-office";
} else if (section.name === "My Till") {
  window.location.href = "/till";
} else if (section.name === "My Business") {
  window.location.href = "/business";
} else {
  setSelected(section.name);
}

}}
              className={`${section.colour} rounded-3xl p-5 text-center shadow-sm transition hover:scale-105 active:scale-95`}
            >
              <div className="text-5xl">{section.emoji}</div>
              <h3 className="mt-3 text-xl font-black text-gray-800">
                {section.name}
              </h3>
              <p className="mt-1 text-sm text-gray-700">
                {section.description}
              </p>
            </button>
          ))}
        </div>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="text-5xl">🐻</div>
            <div>
              <h3 className="text-lg font-black text-gray-800">
                Today's Customer
              </h3>
              <p className="text-gray-600">
                Hello Polly! Can you help me today?
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-3xl bg-purple-100 p-5">
          <h3 className="text-lg font-black text-purple-900">
            🌟 Today's Challenge
          </h3>
          <p className="mt-1 text-purple-800">
            Serve your first customer and earn a star!
          </p>
          <button
            onClick={() => setStars((s) => s + 1)}
            className="mt-3 rounded-full bg-purple-500 px-6 py-3 font-bold text-white shadow-sm"
          >
            I did it! ⭐
          </button>
        </section>

        {selected && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-5">
            <div className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-xl">
              <div className="text-5xl">🎀</div>
              <h2 className="mt-3 text-2xl font-black">{selected}</h2>
              <p className="mt-2 text-gray-600">
                This part of Polly's Post Office is coming soon!
              </p>
              <button
                onClick={() => setSelected("")}
                className="mt-5 rounded-full bg-pink-400 px-8 py-3 font-bold text-white"
              >
                Back to my shop
              </button>
            </div>
          </div>
        )}

        <footer className="mt-8 pb-4 text-center text-sm text-pink-500">
          Made with love for Polly 💗
        </footer>
      </div>
    </main>
  );
}
