
"use client";

import { useState } from "react";

type ItemType = "Letter" | "Parcel";
type Service = "Second Class" | "First Class";
type ParcelSize = "Small" | "Medium" | "Large";

export default function PostOffice() {
  const [itemType, setItemType] = useState<ItemType>("Letter");
  const [service, setService] = useState<Service>("Second Class");
  const [size, setSize] = useState<ParcelSize>("Small");
  const [weight, setWeight] = useState("100g");
  const [posted, setPosted] = useState(false);

  const postage = (() => {
    if (itemType === "Letter") {
      const weights: Record<string, number> = {
        "100g": 0.85,
        "250g": 1.20,
        "500g": 1.60,
      };
      return weights[weight] + (service === "First Class" ? 0.40 : 0);
    }

    const prices: Record<ParcelSize, number> = {
      Small: 2.50,
      Medium: 4.00,
      Large: 6.00,
    };

    const weightExtra = weight === "2kg" ? 1.50 : weight === "1kg" ? 0.75 : 0;

    return prices[size] + weightExtra + (service === "First Class" ? 1.00 : 0);
  })();

  function reset() {
    setPosted(false);
    setItemType("Letter");
    setService("Second Class");
    setSize("Small");
    setWeight("100g");
  }

  return (
    <main className="min-h-screen bg-[#fff8f1] p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="font-bold text-pink-600">
          ← Back home
        </a>

        <header className="my-5 rounded-3xl bg-sky-200 p-6 text-center">
          <div className="text-5xl">📮</div>
          <h1 className="mt-2 text-3xl font-black text-sky-900">
            Polly's Post Office
          </h1>
          <p className="mt-2 text-sky-900">
            Welcome! What would you like to send?
          </p>
        </header>

        {!posted ? (
          <>
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-xl font-black">1. Choose what to send</h2>

              <div className="grid grid-cols-2 gap-3">
                {(["Letter", "Parcel"] as ItemType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setItemType(type);
                      setWeight(type === "Letter" ? "100g" : "1kg");
                    }}
                    className={`rounded-2xl p-4 text-center text-lg font-bold ${
                      itemType === type
                        ? "bg-sky-300 ring-2 ring-sky-600"
                        : "bg-sky-50"
                    }`}
                  >
                    <div className="text-4xl">
                      {type === "Letter" ? "✉️" : "📦"}
                    </div>
                    {type}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-xl font-black">2. Choose postage</h2>

              <div className="grid grid-cols-2 gap-3">
                {(["Second Class", "First Class"] as Service[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => setService(option)}
                    className={`rounded-2xl p-4 font-bold ${
                      service === option
                        ? "bg-purple-200 ring-2 ring-purple-500"
                        : "bg-purple-50"
                    }`}
                  >
                    {option === "First Class" ? "🚀" : "🐢"} 
                    <br />
                    {option}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-xl font-black">3. Details</h2>

              {itemType === "Letter" ? (
                <>
                  <p className="mb-2 font-bold">How heavy is the letter?</p>
                  <div className="flex flex-wrap gap-2">
                    {["100g", "250g", "500g"].map((w) => (
                      <button
                        key={w}
                        onClick={() => setWeight(w)}
                        className={`rounded-full px-5 py-3 font-bold ${
                          weight === w ? "bg-yellow-300" : "bg-yellow-50"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-2 font-bold">Choose parcel size</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Small", "Medium", "Large"] as ParcelSize[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`rounded-2xl p-3 font-bold ${
                          size === s ? "bg-pink-200 ring-2 ring-pink-500" : "bg-pink-50"
                        }`}
                      >
                        📦
                        <br />
                        {s}
                      </button>
                    ))}
                  </div>

                  <p className="mb-2 mt-5 font-bold">How heavy is it?</p>
                  <div className="flex gap-2">
                    {["1kg", "2kg"].map((w) => (
                      <button
                        key={w}
                        onClick={() => setWeight(w)}
                        className={`rounded-full px-6 py-3 font-bold ${
                          weight === w ? "bg-yellow-300" : "bg-yellow-50"
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </section>

            <section className="mt-4 rounded-3xl bg-green-100 p-6 text-center">
              <div className="text-4xl">💷</div>
              <p className="mt-2 font-bold text-green-900">Postage to pay</p>
              <p className="text-4xl font-black text-green-900">
                £{postage.toFixed(2)}
              </p>

              <button
                onClick={() => setPosted(true)}
                className="mt-5 w-full rounded-full bg-green-600 py-4 text-lg font-black text-white shadow-sm active:scale-95"
              >
                Accept Payment & Post! 📮
              </button>
            </section>
          </>
        ) : (
          <section className="rounded-3xl bg-green-100 p-8 text-center">
            <div className="animate-bounce text-7xl">🎉📮</div>
            <h2 className="mt-4 text-3xl font-black text-green-900">
              Well done, Polly!
            </h2>
            <p className="mt-3 text-lg text-green-900">
              Your {itemType.toLowerCase()} has been posted!
            </p>
            <p className="mt-2 font-bold text-green-900">
              Postage received: £{postage.toFixed(2)}
            </p>
            <button
              onClick={reset}
              className="mt-6 w-full rounded-full bg-green-600 py-4 font-black text-white"
            >
              Serve Another Customer
            </button>
          </section>
        )}

        <p className="mt-6 text-center text-sm text-sky-700">
          Thank you for visiting Polly's Post Office! 💗
        </p>
      </div>
    </main>
  );
}
