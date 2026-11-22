
"use client";

import Link from "next/link";
import { useBusiness } from "../context/BusinessContext";

export default function BusinessPage() {
  const { balance, products, stock, sales, expenses } = useBusiness();

  const totalItems = products.reduce(
    (total, product) => total + (stock[product.id] ?? 0),
    0
  );

  const totalSales = sales.reduce((total, sale) => total + sale.amount, 0);
  const totalExpenses = expenses.reduce(
  (total, expense) => total + expense.amount,
  0
);

const totalProfit = totalSales - totalExpenses;

  return (
    <main style={{ minHeight: "100vh", background: "#fff1f7", padding: 20 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Link href="/" style={{ textDecoration: "none", fontWeight: "bold" }}>
          ⬅ Back Home
        </Link>

        <h1 style={{ textAlign: "center", color: "#db2777", fontSize: 32, fontWeight: 900 }}>
          🏪 My Business
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 15 }}>
          <div style={{ background: "#ffffff", padding: 20, borderRadius: 20, textAlign: "center" }}>
            <p>💰 Money</p>
            <h2 style={{ color: "#16a34a", fontSize: 28, fontWeight: 900 }}>
              £{balance.toFixed(2)}
            </h2>
          </div>

          <div style={{ background: "#ffffff", padding: 20, borderRadius: 20, textAlign: "center" }}>
            <p>📦 Items in Stock</p>
            <h2 style={{ color: "#7c3aed", fontSize: 28, fontWeight: 900 }}>
              {totalItems}
            </h2>
          </div>

          <div style={{ background: "#ffffff", padding: 20, borderRadius: 20, textAlign: "center" }}>
            <p>🛍️ Total Sales</p>
            <h2 style={{ color: "#db2777", fontSize: 28, fontWeight: 900 }}>
              £{totalSales.toFixed(2)}
            </h2>
          </div>

<div style={{ background: "#ffffff", padding: 20, borderRadius: 20, textAlign: "center" }}>
  <p>📦 Stock Expenses</p>
  <h2 style={{ color: "#ea580c", fontSize: 28, fontWeight: 900 }}>
    £{totalExpenses.toFixed(2)}
  </h2>
</div>

<div style={{ background: "#ffffff", padding: 20, borderRadius: 20, textAlign: "center" }}>
  <p>🏆 Business Profit</p>
  <h2 style={{ color: totalProfit >= 0 ? "#16a34a" : "#dc2626", fontSize: 28, fontWeight: 900 }}>
    £{totalProfit.toFixed(2)}
  </h2>
</div>

        </div>

        <Link href="/business/stockroom" style={{ textDecoration: "none" }}>
          <div style={{ background: "#ec4899", color: "white", padding: 20, borderRadius: 20, textAlign: "center", marginTop: 25, fontWeight: 900, fontSize: 22 }}>
            📦 STOCK ROOM – BUY NEW STOCK
          </div>
        </Link>

        <h2 style={{ color: "#db2777", marginTop: 30 }}>📋 Stock Overview</h2>

        <div style={{ background: "#ffffff", borderRadius: 20, padding: 15 }}>
          {products.map((product) => (
            <div key={product.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 5px", borderBottom: "1px solid #fce7f3" }}>
              <span>{product.emoji} {product.name}</span>
              <strong>{stock[product.id] ?? 0} in stock</strong>
            </div>
          ))}
        </div>

        <h2 style={{ color: "#db2777", marginTop: 30 }}>🧾 Recent Sales</h2>

        <div style={{ background: "#ffffff", borderRadius: 20, padding: 15 }}>
          {sales.length === 0 ? (
            <p style={{ textAlign: "center" }}>No sales yet. Let's get selling! 🎉</p>
          ) : (
            sales.slice(0, 10).map((sale) => (
              <div key={sale.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "12px 5px", borderBottom: "1px solid #fce7f3" }}>
                <div>
                  <strong>{sale.description}</strong>
                  <div style={{ fontSize: 12, color: "#777" }}>{sale.date}</div>
                </div>
                <strong style={{ color: "#16a34a" }}>£{sale.amount.toFixed(2)}</strong>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
