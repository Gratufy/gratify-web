"use client";
import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomSelectProps<T> {
  value: string | undefined;
  onChange: (val: string) => void;
  options: T[];
  label?: string;
  error?: string;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string;
  placeholder?: string;
  className?: string;
}
function CustomSelect<T>({
  value,
  onChange,
  options,
  label,
  error,
  getOptionLabel,
  getOptionValue,
  placeholder = "Оберіть...",
  className,
}: CustomSelectProps<T>) {
  return (
    <div>
      {label && (
        <label
          htmlFor="custom-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <Select value={value} onValueChange={(v) => onChange(v)}>
        <SelectTrigger className={className ?? "w-[280px]"}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option, index) => {
              const val = getOptionValue
                ? getOptionValue(option)
                : (option as unknown as string);
              const label = getOptionLabel
                ? getOptionLabel(option)
                : (option as unknown as string);
              return (
                <SelectItem key={val ?? index} value={val ?? ""}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default CustomSelect;
