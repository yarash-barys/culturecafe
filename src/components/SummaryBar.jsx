export default function SummaryBar({ totals, onClear }) {
  const hasItems = totals.kcal > 0;

  if (!hasItems) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 grid grid-cols-4 gap-2">
            <MacroStat label="Białka" value={totals.proteins} unit="g" />
            <MacroStat label="Tłuszcze" value={totals.fats} unit="g" />
            <MacroStat label="Węglow." value={totals.carbs} unit="g" />
            <MacroStat label="Kalorie" value={totals.kcal} unit="kcal" highlight />
          </div>
          <button
            onClick={onClear}
            aria-label="Wyczyść kalkulator"
            className="flex-shrink-0 px-3 py-2 rounded-xl bg-gray-100 text-gray-600
                       text-sm font-medium min-h-[44px] min-w-[72px]
                       hover:bg-red-50 hover:text-red-600 active:bg-red-100
                       transition-colors duration-150"
          >
            Wyczyść
          </button>
        </div>
      </div>
    </div>
  );
}

function MacroStat({ label, value, unit, highlight }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 leading-tight font-medium">{label}</p>
      <p
        className={`text-sm font-bold leading-tight tabular-nums ${
          highlight ? "text-amber-600" : "text-gray-900"
        }`}
      >
        {value}
        <span className="text-xs font-normal ml-0.5 text-gray-500">{unit}</span>
      </p>
    </div>
  );
}
