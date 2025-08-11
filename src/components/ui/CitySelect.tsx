"use client";
import React from "react";
import { UKRAINE_REGIONAL_CENTERS } from "@/const/regions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CitySelectProps {
  value: string | undefined;
  onChange: (city: string) => void;
  label?: string;
  error?: string;
}
function CitySelect({ value, onChange, label, error }: CitySelectProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor="city-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <Select>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Оберіть місто" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {UKRAINE_REGIONAL_CENTERS.map((city, ind) => (
              <SelectItem key={city + ind} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default CitySelect;

// import React, { useState } from "react";
// import { CitySelect } from "./CitySelect";

// export default function ExampleForm() {
//   const [city, setCity] = useState<string | undefined>(undefined);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!city) {
//       setError("Будь ласка, оберіть місто");
//       return;
//     }
//     setError(null);
//     alert(`Обрано місто: ${city}`);
//     // тут дальше логика добавления бизнеса, отправка на сервер и т.д.
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
//       <CitySelect
//         label="Місто"
//         value={city}
//         onChange={(value) => setCity(value)}
//         error={error ?? undefined}
//       />
//       <button
//         type="submit"
//         className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Підтвердити
//       </button>
//     </form>
//   );
// }
