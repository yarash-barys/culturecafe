import MenuItem from "./MenuItem";

export default function MenuList({ items, cart, onAdd, onRemove }) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      {items.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          quantity={cart[item.id] || 0}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
