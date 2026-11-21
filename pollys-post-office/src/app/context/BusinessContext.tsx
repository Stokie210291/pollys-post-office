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

type BusinessContextType = {
  balance: number;
  sales: Sale[];
  addSale: (description: string, amount: number) => void;
};

const BusinessContext = createContext<BusinessContextType | null>(null);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(20);
  const [sales, setSales] = useState<Sale[]>([]);
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
        JSON.stringify({ balance, sales })
      );
    }
  }, [balance, sales, loaded]);

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

  return (
    <BusinessContext.Provider value={{ balance, sales, addSale }}>
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