
"use client";

import { useState } from "react";
import { useBusiness } from "../context/BusinessContext";

export default function Shop() {
  const { products, stock, addSale, removeStock } = useBusiness();

  const [basket, setBasket] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");

  const total = products.reduce(
    (sum, product) => sum + product.price * (basket[product.id] || 0),
    0
  );

  const basketCount = Object.values(basket).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  function addProduct(productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const currentInBasket = basket[productId] || 0;
    const available = stock[productId] || 0;

    if (currentInBasket >= available) {
      setMessage(`Not enough ${product.name} in stock!`);
      return;
    }

    setBasket((current) => ({
      ...current,
      [productId]: (current[productId] || 0) + 1,
    }));

    setMessage("");
  }

  function removeProduct(productId: string) {
    setBasket((current) => {
      const quantity = current[productId] || 0;

      if (quantity <= 1) {
        const updated = { ...current };
        delete updated[productId];
        return updated;
      }

      return {
        ...current,
        [productId]: quantity - 1,
      };
    });

    setMessage("");
  }

  function checkout() {
    if (basketCount === 0) return;

    // Check stock before completing the sale
    for (const product of products) {
      const quantity = basket[product.id] || 0;

      if (quantity > (stock[product.id] || 0)) {
        setMessage(`Not enough ${product.name} in stock!`);
        return;
      }
    }

    // Deduct the stock sold
    for (const product of products) {
      const quantity = basket[product.id] || 0;

      if (quantity > 0) {
        const success = removeStock(product.id, quantity);

        if (!success) {
          setMessage("Stock error! Please try again.");
          return;
        }
      }
    }

    // Record the sale
    const description = products
      .filter((product) => basket[product.id])
      .map((product) => `${product.name} x${basket[product.id]}`)
      .join(", ");

    addSale(`Shop sale: ${description}`, total);

    setMessage(`Payment received! £${total.toFixed(2)} earned! 🎉`);
    setBasket({});
  }

  return (
    <main className="min-h-screen bg-[#fff8f1] p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">

        <a href="/" className="font-bold text-pink-600">
          ← Back home
        </a>

        <header className="my-5 rounded-3xl bg-pink-200 p-6 text-center">
          <div className="text-5xl">🛍️</div>
          <h1 className="text-3xl font-black text-pink-800">
            Polly's Shop
          </h1>
          <p className="text-pink-800">
            Welcome! What would you like to buy?
          </p>
        </header>

        <div className="mb-4 rounded-2xl bg-white p-4 text-center shadow">
          <div className="text-lg font-bold">🧺 Basket items</div>
          <div className="text-3xl font-black text-pink-600">
            {basketCount}
          </div>
        </div>

        <h2 className="mb-3 text-xl font-black">Choose your products</h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {products.map((product) => {
            const available = stock[product.id] || 0;
            const inBasket = basket[product.id] || 0;
            const soldOut = available <= 0;

            return (
              <div
                key={product.id}
                className="rounded-2xl bg-white p-4 text-center shadow-md"
              >
                <div className="text-4xl">{product.emoji}</div>

                <div className="mt-2 font-bold text-gray-800">
                  {product.name}
                </div>

                <div className="font-black text-pink-600">
                  £{product.price.toFixed(2)}
                </div>

                <div className="mt-3 rounded-xl bg-green-100 p-2 font-bold text-green-800">
                  {soldOut ? "OUT OF STOCK" : `Stock: ${available}`}
                </div>

                {inBasket > 0 && (
                  <div className="mt-2 rounded-lg bg-purple-100 p-2 font-bold text-purple-800">
                    In basket: {inBasket}
                  </div>
                )}

                <button
                  type="button"
                  disabled={soldOut}
                  onClick={() => addProduct(product.id)}
                  style={{
                    backgroundColor: soldOut ? "#bdbdbd" : "#ec4899",
                    color: "#ffffff",
                    opacity: 1,
                    visibility: "visible",
                    display: "block",
                  }}
                  className="mt-4 w-full min-h-[60px] rounded-2xl px-2 text-base font-black shadow-md active:scale-95 disabled:cursor-not-allowed"
                >
                  {soldOut ? "❌ SOLD OUT" : "🛒 ADD TO BASKET"}
                </button>
              </div>
            );
          })}
        </div>

        <section className="mt-6 rounded-3xl bg-yellow-100 p-5">
          <h2 className="text-xl font-black">🧺 Shopping Basket</h2>

          {basketCount === 0 ? (
            <p className="mt-3 text-gray-600">
              Your basket is empty. Let's go shopping!
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {products.map((product) => {
                const quantity = basket[product.id] || 0;

                if (quantity === 0) return null;

                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-white p-3"
                  >
                    <div className="font-bold">
                      {product.emoji} {product.name} x{quantity}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="font-bold">
                        £{(product.price * quantity).toFixed(2)}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        style={{
                          backgroundColor: "#fecaca",
                          color: "#991b1b",
                        }}
                        className="min-h-[44px] min-w-[44px] rounded-full text-xl font-black active:scale-95"
                      >
                        −
                      </button>

                      <button
                        type="button"
                        onClick={() => addProduct(product.id)}
                        disabled={quantity >= (stock[product.id] || 0)}
                        style={{
                          backgroundColor:
                            quantity >= (stock[product.id] || 0)
                              ? "#bdbdbd"
                              : "#86efac",
                          color: "#166534",
                        }}
                        className="min-h-[44px] min-w-[44px] rounded-full text-xl font-black active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-5 flex justify-between border-t border-yellow-300 pt-4 text-2xl font-black">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>

          <button
            type="button"
            onClick={checkout}
            disabled={basketCount === 0}
            style={{
              backgroundColor: basketCount === 0 ? "#bdbdbd" : "#22c55e",
              color: "#ffffff",
              opacity: 1,
              visibility: "visible",
              display: "block",
            }}
            className="mt-5 w-full min-h-[65px] rounded-2xl text-xl font-black shadow-lg active:scale-95 disabled:cursor-not-allowed"
          >
            💷 TAKE PAYMENT
          </button>

          {message && (
            <div className="mt-4 rounded-2xl bg-white p-4 text-center text-lg font-black text-green-700">
              {message}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
