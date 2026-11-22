
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

type Expense = {
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
  cost: number;
};

type BusinessContextType = {
  balance: number;
  sales: Sale[];
  expenses: Expense[];
  products: Product[];
  stock: Record<string, number>;
  addSale: (description: string, amount: number) => void;
  addStock: (productId: string, quantity: number) => void;
  removeStock: (productId: string, quantity: number) => boolean;
  purchaseStock: (productId: string, quantity: number) => boolean;
  purchaseBasket: (quantities: Record<string, number>) => boolean;
};

const initialProducts: Product[] = [
  { id: "chocolate", name: "Chocolate bar", emoji: "🍫", price: 1, cost: 0.5 },
  { id: "lollipop", name: "Lollipop", emoji: "🍭", price: 0.5, cost: 0.2 },
  { id: "teddy", name: "Teddy", emoji: "🧸", price: 5, cost: 2.5 },
  { id: "toy-car", name: "Toy car", emoji: "🚗", price: 2.5, cost: 1.25 },
  { id: "colouring-book", name: "Colouring book", emoji: "📚", price: 3, cost: 1.5 },
  { id: "pencil", name: "Pencil", emoji: "✏️", price: 0.5, cost: 0.2 },
  { id: "stickers", name: "Sticker pack", emoji: "🌈", price: 1.5, cost: 0.75 },
  { id: "cupcake", name: "Cupcake", emoji: "🧁", price: 1.2, cost: 0.6 },
  { id: "juice", name: "Juice", emoji: "🧃", price: 0.8, cost: 0.4 },
  { id: "dinosaur", name: "Dinosaur", emoji: "🦖", price: 4, cost: 2 },
  { id: "flower", name: "Flower", emoji: "🌸", price: 2, cost: 1 },
  { id: "gift-bag", name: "Gift bag", emoji: "🎁", price: 1, cost: 0.5 },
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
  const [expenses, setExpenses] = useState<Expense[]>([]);
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
        if (Array.isArray(data.expenses)) {
  setExpenses(data.expenses);
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
        JSON.stringify({ balance, sales, expenses, stock })
      );
    }
  }, [balance, sales, expenses, stock, loaded]);

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
function purchaseStock(productId: string, quantity: number): boolean {
  const product = initialProducts.find((item) => item.id === productId);

  if (!product) return false;
  if (!Number.isInteger(quantity) || quantity <= 0) return false;

  const totalCost = product.cost * quantity;

  if (balance < totalCost) return false;

  setBalance((current) => Math.round((current - totalCost) * 100) / 100);
  setExpenses((current) => [
  {
    id: Date.now(),
    description: `Stock purchase: ${product.name}`,
    amount: totalCost,
    date: new Date().toLocaleDateString("en-GB"),
  },
  ...current,
]);

  setStock((current) => ({
    ...current,
    [productId]: (current[productId] ?? 0) + quantity,
  }));

  return true;
}
function purchaseBasket(quantities: Record<string, number>): boolean {
  let totalCost = 0;

  for (const [productId, quantity] of Object.entries(quantities)) {
    if (!Number.isInteger(quantity) || quantity < 0) return false;

    if (quantity === 0) continue;

    const product = initialProducts.find((item) => item.id === productId);

    if (!product) return false;

    totalCost += product.cost * quantity;
  }

  if (totalCost <= 0) return false;
  if (balance < totalCost) return false;

  setBalance((current) => Math.round((current - totalCost) * 100) / 100);
  setExpenses((current) => [
  {
    id: Date.now(),
    description: "Stock purchase: Shopping basket",
    amount: totalCost,
    date: new Date().toLocaleDateString("en-GB"),
  },
  ...current,
]);

  setStock((current) => {
    const updated = { ...current };

    for (const [productId, quantity] of Object.entries(quantities)) {
      if (quantity > 0) {
        updated[productId] = (updated[productId] ?? 0) + quantity;
      }
    }

    return updated;
  });

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
        expenses,
        products: initialProducts,
        stock,
        addSale,
addStock,
removeStock,
purchaseStock,
purchaseBasket,
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
