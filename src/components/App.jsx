import { useState, useMemo, useEffect } from "react";
import { useCart } from "../hooks/useCart";
import CategoryTabs from "./CategoryTabs";
import MenuList from "./MenuList";
import SummaryBar from "./SummaryBar";

// Paste your published CSV URL here (File → Share → Publish to web → CSV)
const SHEET_CSV_URL = import.meta.env.VITE_SHEET_CSV_URL || "";

function parseCSV(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map((line) => {
    // Handle quoted fields containing commas
    const fields = [];
    let current = "";
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === "," && !inQuotes) { fields.push(current.trim()); current = ""; }
      else { current += ch; }
    }
    fields.push(current.trim());
    return Object.fromEntries(headers.map((h, i) => [h, fields[i] ?? ""]));
  });

  // Group rows into categories
  const categoryMap = new Map();
  for (const row of rows) {
    if (!row.category_id || !row.id) continue;
    if (!categoryMap.has(row.category_id)) {
      categoryMap.set(row.category_id, { id: row.category_id, name: row.category_name, items: [] });
    }
    categoryMap.get(row.category_id).items.push({
      id: row.id,
      name: row.name,
      proteins: parseFloat(row.proteins) || 0,
      fats: parseFloat(row.fats) || 0,
      carbs: parseFloat(row.carbs) || 0,
      kcal: parseFloat(row.kcal) || 0,
    });
  }
  return { categories: Array.from(categoryMap.values()) };
}

export default function App() {
  const [menuData, setMenuData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!SHEET_CSV_URL) {
      setError("Brak adresu URL arkusza. Ustaw zmienną VITE_SHEET_CSV_URL.");
      return;
    }
    fetch(SHEET_CSV_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => setMenuData(parseCSV(text)))
      .catch((err) => setError(`Nie udało się załadować menu: ${err.message}`));
  }, []);

  const categories = menuData?.categories ?? [];
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const activeId = activeCategoryId ?? categories[0]?.id ?? null;

  const allItems = useMemo(() => categories.flatMap((cat) => cat.items), [categories]);
  const { cart, addItem, removeItem, clearCart, totals } = useCart(allItems);

  const activeCategory = categories.find((c) => c.id === activeId);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow p-6 max-w-sm w-full text-center">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">Ładowanie menu…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Kalkulator kalorii
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Culture Café</p>
        </div>
      </header>

      <CategoryTabs
        categories={categories}
        activeId={activeId}
        onSelect={setActiveCategoryId}
      />

      <main className="max-w-2xl mx-auto pb-28">
        {activeCategory && (
          <MenuList
            items={activeCategory.items}
            cart={cart}
            onAdd={addItem}
            onRemove={removeItem}
          />
        )}
      </main>

      <SummaryBar totals={totals} onClear={clearCart} />
    </div>
  );
}
