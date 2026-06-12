export default function MenuItem({ item, quantity, onAdd, onRemove }) {
  const inCart = quantity > 0;

  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3
        border-2 transition-colors duration-150 border-transparent"}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-900 font-semibold text-base leading-snug">
            {item.name}
          </h3>
          <p className="text-[#A78862] font-bold text-lg mt-0.5">
            {item.kcal} kcal
          </p>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 mt-0.5">
          {inCart ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onRemove(item)}
                aria-label="Usuń jedną porcję"
                className="w-9 h-9 rounded-full bg-[#A78862] text-white font-bold text-xl
                           flex items-center justify-center hover:bg-[#B3B76F] active:bg-[#B3B76F]
                           transition-colors duration-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                </svg>
              </button>
              <span className="w-6 text-center text-gray-900 font-semibold text-base tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => onAdd(item)}
                aria-label="Dodaj jedną porcję"
                className="w-9 h-9 rounded-full bg-[#A78862] text-white font-bold text-xl
                           flex items-center justify-center hover:bg-[#B3B76F] active:bg-[#B3B76F]
                           transition-colors duration-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAdd(item)}
              aria-label="Dodaj do kalkulatora"
              className="w-10 h-10 rounded-full bg-[#A78862] text-white font-bold text-2xl
                         flex items-center justify-center hover:bg-amber-600 active:bg-amber-700
                         transition-colors duration-100 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-100">
        <MacroChip label="Białko" value={item.proteins} unit="g" color="olive" />
        <MacroChip label="Tłuszcze" value={item.fats} unit="g" color="yellow" />
        <MacroChip label="Węglowodany" value={item.carbs} unit="g" color="green" />
      </div>
    </div>
  );
}

function MacroChip({ label, value, unit, color }) {
  const colorMap = {
    olive: "bg-white text-gray-900",
    yellow: "bg-white text-gray-900",
    green: "bg-white text-gray-900",
  };
  return (
    <div className={`rounded-lg px-2 py-1.5 text-center ${colorMap[color]}`}>
      <p className="text-xs font-medium leading-tight truncate">{label}</p>
      <p className="text-sm font-bold leading-tight">
        {value}
        <span className="text-xs font-normal ml-0.5">{unit}</span>
      </p>
    </div>
  );
}
