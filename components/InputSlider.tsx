import React from 'react';

interface InputSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  prefix?: string;
  suffix?: string;
  formatValue?: (val: number) => string;
}

export function InputSlider({ label, value, min, max, step, onChange, prefix = '', suffix = '', formatValue }: InputSliderProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters from input
    const rawVal = e.target.value.replace(/[^0-9.]/g, '');
    let num = Number(rawVal);
    if (!isNaN(num)) {
      onChange(num);
    } else if (rawVal === '') {
      onChange(0); // Allow empty temporarily
    }
  };

  const handleBlur = () => {
    if (value < min) onChange(min);
    if (value > max) onChange(max);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
        <label className="font-sans font-medium text-on-surface">{label}</label>
        <div className="relative w-full md:w-auto">
          {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">{prefix}</span>}
          <input 
            type="text"
            value={value || ''}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`w-full md:w-36 bg-surface-container text-primary font-bold text-lg rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-secondary/40 text-right ${prefix ? 'pl-8' : 'pl-4'} pr-4 shadow-sm border border-outline-variant/30 transition-all`}
          />
          {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-bold">{suffix}</span>}
        </div>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full appearance-none bg-surface-variant h-2 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:shadow-[0_2px_10px_rgba(0,0,0,0.15)] hover:[&::-webkit-slider-thumb]:scale-110 transition-all [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
      />
      <div className="flex justify-between text-xs text-outline font-medium mt-3 font-sans">
        <span>{prefix}{formatValue ? formatValue(min) : min}{suffix}</span>
        <span>{prefix}{formatValue ? formatValue(max) : max}{suffix}</span>
      </div>
    </div>
  );
}
