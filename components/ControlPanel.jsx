'use client';

export default function ControlsPanel({ controls, values, onChange, isPremium, isUnlocked }) {
  if (!controls || controls.length === 0) {
    return (
      <div className="p-4 text-center text-sky-600 text-sm bg-sky-50/50">
        ⚙️ No controls available for this simulation.
      </div>
    );
  }

  return (
    <div className="p-5 bg-white/80 backdrop-blur-sm border-t-2 border-sky-200/50">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {controls.map((ctrl) => {
          const isDisabled = isPremium && !isUnlocked;
          return (
            <div key={ctrl.id} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor={ctrl.id}
                  className={`text-sm font-medium ${isDisabled ? 'text-gray-400' : 'text-sky-800'}`}
                >
                  {ctrl.label}
                </label>
                <span className="text-xs font-bold text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">
                  {values[ctrl.id] || ctrl.default} {ctrl.unit}
                </span>
              </div>

              <input
                id={ctrl.id}
                type="range"
                min={ctrl.min}
                max={ctrl.max}
                step={ctrl.step}
                value={values[ctrl.id] ?? ctrl.default}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange(ctrl.id, val);
                }}
                disabled={isDisabled}
                className={`w-full h-2 rounded-full appearance-none cursor-pointer transition-all
                  ${isDisabled
                    ? 'bg-gray-200'
                    : 'bg-sky-200 accent-sky-600 hover:accent-sky-700'
                  }
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:transition-all
                  ${isDisabled
                    ? '[&::-webkit-slider-thumb]:bg-gray-400'
                    : '[&::-webkit-slider-thumb]:bg-sky-500 hover:[&::-webkit-slider-thumb]:scale-110'
                  }
                `}
              />

              {/* Min/Max labels for child-friendly context */}
              <div className="flex justify-between text-[10px] text-sky-400 font-medium px-0.5">
                <span>{ctrl.min}</span>
                <span className="text-sky-300">⟷</span>
                <span>{ctrl.max}</span>
              </div>
            </div>
          );
        })}
      </div>

      {isPremium && !isUnlocked && (
        <div className="mt-3 text-center text-xs text-amber-600 bg-amber-50 rounded-full py-1.5 px-4 inline-block mx-auto">
          🔒 Premium controls locked — unlock to adjust
        </div>
      )}
    </div>
  );
}