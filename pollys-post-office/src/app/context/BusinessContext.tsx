
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Sale = {
  id: number;
  description: string;
  amount: number;
  date: string;
};

export type Product = {
  id: string;
  name: string;
  emoji: string;
  price: number;
};

type BusinessContextType = {
  balance: number;
  sales: Sale[];
  products: Product[];
  stock: Record<string, number>;
  addSale: (description: string, amount: number) => void;
  addStock: (productId: string, quantity: number) => void;
  removeStock: (productId: string, quantity: number) => boolean;
};

const initialProducts: Product[] = [
  { id: "chocolate", name: "Chocolate bar", emoji: "🍫", price: 1 },
  { id: "lollipop", name: "Lollipop", emoji: "🍭", price: 0.5 },
  { id: "teddy", name: "Teddy", emoji: "🧸", price: 5 },
  { id: "toy-car", name: "Toy car", emoji: "🚗", price: 2.5 },
  { id: "colouring-book", name: "Colouring book", emoji: "📚", price: 3 },
  { id: "pencil", name: "Pencil", emoji: "✏️", price: 0.5 },
  { id: "stickers", name: "Sticker pack", emoji: "🌈", price: 1.5 },
  { id: "cupcake", name: "Cupcake", emoji: "🧁", price: 1.2 },
  { id: "juice", name: "Juice", emoji: "🧃", price: 0.8 },
  { id: "dinosaur", name: "Dinosaur", emoji: "🦖", price: 4 },
  { id: "flower", name: "Flower", emoji: "🌸", price: 2 },
  { id: "gift-bag", name: "Gift bag", emoji: "🎁", price: 1 },
];

const startingStock: Record<string, number> = {
  chocolate: 10,
  lollipop: 10,
  teddy: 10,
  "toy-car": 10,
  "colouring-book": 10,
  pencil: 10,
  stickers: 10,
  cupcake: 10,
  juice: 10,
  dinosaur: 10,
  flower: 10,
  "gift-bag": 10,
};

const BusinessContext = createContext<BusinessContextType | null>(null);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(20);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stock, setStock] = useState<Record<string, number>>(startingStock);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("polly-business");

      if (saved) {
        const data = JSON.parse(saved);

        if (typeof data.balance === "number" && data.balance >= 0) {
          setBalance(data.balance);
        }

        if (Array.isArray(data.sales)) {
          setSales(data.sales);
        }

        if (data.stock && typeof data.stock === "object") {
          setStock({ ...startingStock, ...data.stock });
        }
      }
    } catch {
      console.log("Starting a new Polly's Post Office account.");
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        "polly-business",
        JSON.stringify({ balance, sales, stock })
      );
    }
  }, [balance, sales, stock, loaded]);

  function addSale(description: string, amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) return;

    setBalance((current) => Math.round((current + amount) * 100) / 100);

    setSales((current) => [
      {
        id: Date.now(),
        description,
        amount,
        date: new Date().toLocaleDateString("en-GB"),
      },
      ...current,
    ]);
  }

  function addStock(productId: string, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) return;

    setStock((current) => ({
      ...current,
      [productId]: (current[productId] ?? 0) + quantity,
    }));
  }
  function removeStock(productId: string, quantity: number): boolean {
  const currentStock = stock[productId] ?? 0;

  if (!Number.isInteger(quantity) || quantity <= 0) return false;
  if (currentStock < quantity) return false;

  setStock((current) => ({
    ...current,
    [productId]: current[productId] - quantity,
  }));

  return true;
}

  if (!loaded) {
  return null;
}

return (
  <BusinessContext.Provider
      value={{
        balance,
        sales,
        products: initialProducts,
        stock,
        addSale,
addStock,
removeStock,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);

  if (!context) {
    throw new Error("useBusiness must be used inside BusinessProvider");
  }

  return context;
}
