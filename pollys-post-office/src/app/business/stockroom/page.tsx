
"use client";

import { useState } from "react";
import Link from "next/link";
import { useBusiness } from "../../context/BusinessContext";

export default function StockRoomPage() {
  const { balance, products, stock, purchaseBasket } = useBusiness();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");

  const basketItems = products.filter(
    (product) => (quantities[product.id] ?? 0) > 0
  );

  const basketTotal = basketItems.reduce(
    (total, product) =>
      total + product.cost * (quantities[product.id] ?? 0),
    0
  );

  const basketCount = basketItems.reduce(
    (total, product) => total + (quantities[product.id] ?? 0),
    0
  );

  function changeQuantity(productId: string, amount: number) {
    setQuantities((current) => ({
      ...current,
      [productId]: Math.max(0, (current[productId] ?? 0) + amount),
    }));
    setMessage("");
  }

  function checkout() {
    if (basketCount === 0) {
      setMessage("Please add some products to your basket!");
      return;
    }

    const success = purchaseBasket(quantities);

    if (success) {
      setMessage("🎉 Order complete! Your new stock has arrived!");
      setQuantities({});
    } else {
      setMessage("❌ You don't have enough money for this order!");
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#fff1f7", padding: 20 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Link href="/business" style={{ textDecoration: "none", fontWeight: "bold" }}>
          ⬅ Back to My Business
        </Link>

        <h1 style={{ textAlign: "center", color: "#db2777", fontSize: 32, fontWeight: 900 }}>
          📦 Polly's Stock Room
        </h1>

        <div style={{ background: "#ffffff", padding: 20, borderRadius: 20, textAlign: "center", marginBottom: 20 }}>
          <p style={{ margin: 5, fontSize: 18 }}>💰 Money available</p>
          <h2 style={{ color: "#16a34a", fontSize: 30, fontWeight: 900 }}>
            £{balance.toFixed(2)}
          </h2>
        </div>

        {message && (
          <div style={{ background: "#fce7f3", padding: 15, borderRadius: 15, textAlign: "center", fontWeight: "bold", marginBottom: 20 }}>
            {message}
          </div>
        )}

        <h2 style={{ color: "#db2777", fontSize: 24, fontWeight: 900 }}>
          🛍️ Choose Your Stock
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 15 }}>
          {products.map((product) => {
            const quantity = quantities[product.id] ?? 0;

            return (
              <div key={product.id} style={{ background: "#ffffff", padding: 18, borderRadius: 20, boxShadow: "0 3px 8px #f3c4d8" }}>
                <div style={{ textAlign: "center", fontSize: 45 }}>{product.emoji}</div>

                <h2 style={{ textAlign: "center", fontSize: 18, fontWeight: 900 }}>
                  {product.name}
                </h2>

                <p style={{ textAlign: "center" }}>
                  🏷️ £{product.cost.toFixed(2)} each
                </p>

                <p style={{ textAlign: "center", fontWeight: "bold", color: "#7c3aed" }}>
                  📦 In stock: {stock[product.id] ?? 0}
                </p>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, margin: "15px 0" }}>
                  <button
                    onClick={() => changeQuantity(product.id, -1)}
                    style={{ background: "#fbcfe8", border: "none", borderRadius: 12, padding: "12px 18px", fontSize: 20, fontWeight: "bold" }}
                  >
                    −
                  </button>

                  <span style={{ fontSize: 22, fontWeight: "bold", minWidth: 30, textAlign: "center" }}>
                    {quantity}
                  </span>

                  <button
                    onClick={() => changeQuantity(product.id, 1)}
                    style={{ background: "#fbcfe8", border: "none", borderRadius: 12, padding: "12px 18px", fontSize: 20, fontWeight: "bold" }}
                  >
                    +
                  </button>
                </div>

                <p style={{ textAlign: "center", fontWeight: "bold" }}>
                  Subtotal: £{(product.cost * quantity).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ background: "#ffffff", padding: 20, borderRadius: 20, marginTop: 25, boxShadow: "0 3px 8px #f3c4d8" }}>
          <h2 style={{ color: "#db2777", fontSize: 24, fontWeight: 900 }}>
            🛒 Your Shopping Basket
          </h2>

          {basketItems.length === 0 ? (
            <p>Your basket is empty. Choose some stock above!</p>
          ) : (
            basketItems.map((product) => (
              <div key={product.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "10px 0", borderBottom: "1px solid #fce7f3" }}>
                <span>
                  {product.emoji} {product.name} × {quantities[product.id]}
                </span>
                <strong>
                  £{(product.cost * quantities[product.id]).toFixed(2)}
                </strong>
              </div>
            ))
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, fontSize: 22, fontWeight: 900 }}>
            <span>Order Total</span>
            <span>£{basketTotal.toFixed(2)}</span>
          </div>

          <p style={{ textAlign: "center", color: "#666" }}>
            {basketCount} item{basketCount === 1 ? "" : "s"} in your basket
          </p>

          <button
            onClick={checkout}
            disabled={basketCount === 0}
            style={{
              width: "100%",
              padding: 18,
              border: "none",
              borderRadius: 15,
              background: basketCount === 0 ? "#d1d5db" : "#ec4899",
              color: "#ffffff",
              fontWeight: "bold",
              fontSize: 20,
              opacity: 1,
            }}
          >
            💳 CHECKOUT – £{basketTotal.toFixed(2)}
          </button>
        </div>
      </div>
    </main>
  );
}
