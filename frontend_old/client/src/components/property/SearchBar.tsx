import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="surface flex flex-col gap-3 rounded-3xl p-3 sm:flex-row">
      <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4">
        <Search size={19} className="text-primary" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch(value)}
          placeholder="Procure por cidade, bairro ou código"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>
      <Button
        onClick={() => onSearch(value)}
        className="h-12 rounded-2xl bg-primary px-7 font-semibold shadow-lg shadow-blue-900/20"
      >
        Encontrar imóvel
      </Button>
    </div>
  );
}