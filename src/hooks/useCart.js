import { useState, useMemo } from "react";

export function useCart(allItems) {
  const [cart, setCart] = useState({});

  function addItem(item) {
    setCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
  }

  function removeItem(item) {
    setCart((prev) => {
      const current = prev[item.id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[item.id];
        return next;
      }
      return { ...prev, [item.id]: current - 1 };
    });
  }

  function clearCart() {
    setCart({});
  }

  const totals = useMemo(() => {
    const result = { proteins: 0, fats: 0, carbs: 0, kcal: 0 };
    if (!allItems) return result;
    for (const item of allItems) {
      const qty = cart[item.id] || 0;
      if (qty > 0) {
        result.proteins += item.proteins * qty;
        result.fats += item.fats * qty;
        result.carbs += item.carbs * qty;
        result.kcal += item.kcal * qty;
      }
    }
    result.proteins = Math.round(result.proteins * 10) / 10;
    result.fats = Math.round(result.fats * 10) / 10;
    result.carbs = Math.round(result.carbs * 10) / 10;
    result.kcal = Math.round(result.kcal);
    return result;
  }, [cart, allItems]);

  return { cart, addItem, removeItem, clearCart, totals };
}
