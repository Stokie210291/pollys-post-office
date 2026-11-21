
"use client";

import { useState } from "react";
import Link from "next/link";
import { useBusiness } from "../context/BusinessContext";

export default function Till() {
  const { balance, sales, addSale } = useBusiness();

  const [amountOwed, setAmountOwed] = useState("1.00");
  const [cashReceived, setCashReceived] = useState("2.00");
  const [paymentMessage, setPaymentMessage] = useState("");

  const owed = Number(amountOwed) || 0;
  const received = Number(cashReceived) || 0;
  const change = received - owed;

  function takePayment() {
  if (owed <= 0) {
    setPaymentMessage("Please enter an amount to pay.");
    return;
  }

  if (received < owed) {
    setPaymentMessage("Not enough cash! Please try again.");
    return;
  }

  addSale("Till sale", owed);

  setPaymentMessage(
    `Payment accepted! 🎉 You gave the customer ${money(change)} change.`
  );

  setAmountOwed("1.00");
  setCashReceived("2.00");
}

  const money = (value: number) => `£${value.toFixed(2)}`;

  return (
    <main className="min-h-screen bg-pink-50 p-5">
      <div className="max-w-xl mx-auto space-y-5">

        <Link href="/" className="text-pink-600 font-bold">
          ← Back to Polly's Post Office
        </Link>

        <header className="text-center space-y-2">
          <div className="text-5xl">💰</div>
          <h1 className="text-3xl font-black text-pink-600">
            Polly's Till
          </h1>
          <p className="text-gray-600">
            Welcome to the checkout!
          </p>
        </header>

        <section className="bg-white rounded-3xl p-5 shadow space-y-3">
          <h2 className="text-xl font-bold text-gray-800">
            🧾 Customer's bill
          </h2>

          <label className="block font-semibold text-gray-700">
            Amount owed (£)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amountOwed}
            onChange={(e) => setAmountOwed(e.target.value)}
            className="w-full rounded-xl border-2 border-pink-200 p-3 text-xl"
          />

          <label className="block font-semibold text-gray-700">
            Cash received (£)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            className="w-full rounded-xl border-2 border-pink-200 p-3 text-xl"
          />

          <div className="bg-pink-100 rounded-2xl p-4 text-center space-y-2">
            <p className="text-gray-700 font-semibold">
              Customer's change
            </p>
            <p className="text-4xl font-black text-pink-600">
              {change >= 0 ? money(change) : "Not enough cash"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[1, 2, 5, 10, 20].map((amount) => (
              <button
                key={amount}
                onClick={() => setCashReceived(amount.toFixed(2))}
                className="flex-1 rounded-xl bg-yellow-100 p-3 font-bold text-gray-800"
              >
                £{amount}
              </button>
            ))}
          </div>
          {paymentMessage && (
  <div className="rounded-xl bg-green-100 p-3 text-center font-bold text-green-700">
    {paymentMessage}
  </div>
)}

<button
  onClick={takePayment}
  className="w-full rounded-2xl bg-green-500 p-4 text-xl font-black text-white shadow-lg"
>
  💷 Take Payment
</button>
        </section>

        <section className="bg-white rounded-3xl p-5 shadow space-y-2">
          <h2 className="text-xl font-bold text-gray-800">
            🏦 Business balance
          </h2>
          <p className="text-4xl font-black text-green-600">
            {money(balance)}
          </p>
          <p className="text-sm text-gray-500">
            Total money currently recorded
          </p>
        </section>

        <section className="bg-white rounded-3xl p-5 shadow space-y-3">
          <h2 className="text-xl font-bold text-gray-800">
            📚 Recent sales
          </h2>

          {sales.length === 0 ? (
            <p className="text-gray-500">
              No sales recorded yet.
            </p>
          ) : (
            sales.slice(0, 10).map((sale) => (
              <div
                key={sale.id}
                className="flex justify-between border-b border-pink-100 py-2"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {sale.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {sale.date}
                  </p>
                </div>
                <p className="font-bold text-green-600">
                  +{money(sale.amount)}
                </p>
              </div>
            ))
          )}
        </section>

        <p className="text-center text-sm text-gray-500">
          🌸 You're doing a fantastic job, Polly! 🌸
        </p>

      </div>
    </main>
  );
}
