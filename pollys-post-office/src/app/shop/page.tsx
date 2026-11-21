
"use client";

import { useState } from "react";

const products = [
  { name: "Chocolate Bar", emoji: "🍫", price: 1.00 },
  { name: "Lollipop", emoji: "🍭", price: 0.50 },
  { name: "Teddy Bear", emoji: "🧸", price: 5.00 },
  { name: "Toy Car", emoji: "🚗", price: 2.50 },
  { name: "Colouring Book", emoji: "📚", price: 3.00 },
  { name: "Pencil", emoji: "✏️", price: 0.50 },
  { name: "Sticker Pack", emoji: "🌈", price: 1.50 },
  { name: "Cupcake", emoji: "🧁", price: 1.20 },
  { name: "Juice", emoji: "🧃", price: 0.80 },
  { name: "Toy Dinosaur", emoji: "🦖", price: 4.00 },
  { name: "Flower", emoji: "🌸", price: 2.00 },
  { name: "Gift Bag", emoji: "🎁", price: 1.00 },
];

export default function Shop() {
  const [basket, setBasket] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  const total = basket.reduce((sum, index) => sum + products[index].price, 0);

  function addProduct(index: number) {
    setBasket([...basket, index]);
    setMessage("");
  }

  function checkout() {
    if (basket.length === 0) return;
    setMessage(`Amazing! Your customer has paid £${total.toFixed(2)}. 🎉`);
    setBasket([]);
  }

  return (
    <main className="min-h-screen bg-[#fff8f1] p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <a href="/" className="font-bold text-pink-600">← Back home</a>

        <header className="my-5 rounded-3xl bg-pink-200 p-6 text-center">
          <div className="text-5xl">🛍️</div>
          <h1 className="text-3xl font-black text-pink-800">Polly's Shop</h1>
          <p className="text-pink-800">What would you like to buy?</p>
        </header>

        <h2 className="mb-3 text-xl font-black">Choose your products</h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {products.map((product, index) => (
            <button
              key={product.name}
              onClick={() => addProduct(index)}
              className="rounded-2xl bg-white p-4 text-center shadow-sm active:scale-95"
            >
              <div className="text-4xl">{product.emoji}</div>
              <div className="mt-2 font-bold text-gray-800">{product.name}</div>
              <div className="font-black text-pink-600">
                £{product.price.toFixed(2)}
              </div>
              <div className="mt-2 rounded-full bg-pink-100 py-2 text-sm font-bold text-pink-800">
                + Add to basket
              </div>
            </button>
          ))}
        </div>

        <section className="mt-6 rounded-3xl bg-yellow-100 p-5">
          <h2 className="text-xl font-black">🧺 Shopping Basket</h2>

          {basket.length === 0 ? (
            <p className="mt-3 text-gray-600">Your basket is empty!</p>
          ) : (
            <div className="mt-3 space-y-2">
              {basket.map((index, position) => (
                <div key={position} className="flex justify-between">
                  <span>{products[index].emoji} {products[index].name}</span>
                  <span className="font-bold">£{products[index].price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-between border-t border-yellow-300 pt-3 text-xl font-black">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>

          <button
            onClick={checkout}
            disabled={basket.length === 0}
            className="mt-4 w-full rounded-full bg-green-500 py-4 font-black text-white disabled:opacity-40"
          >
            Take Payment 💷
          </button>

          {message && (
            <p className="mt-4 rounded-xl bg-white p-3 text-center font-bold text-green-700">
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
