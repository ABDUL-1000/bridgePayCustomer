import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { FaXmark } from "react-icons/fa6";
import { Option, STATUS_OPTIONS, SelectInput } from "./SelectInput";
import { TransactionFilters } from "@/hooks/useTransactionFilters";

const CURRENCY_OPTIONS: Option[] = [
  { value: "NGN", label: "Naira — NGN" },
  { value: "USD", label: "Dollar — USD" },
];

interface TransactionFilterProps {
  filters:        TransactionFilters;
  onFilterChange: <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => void;
  onReset:        () => void;
}

const TransactionFilter = ({ filters, onFilterChange, onReset }: TransactionFilterProps) => {
  const [showFilter, setShowFilter] = useState(false);

  const Label = ({ label }: { label: string }) => (
    <label className="text-xs text-sub-500">{label}</label>
  );

  const Header = ({ label, onClear }: { label: string; onClear: () => void }) => (
    <div className="flex justify-between items-center">
      <Label label={label} />
      <button type="button" className="text-xs text-error" onClick={onClear}>Clear</button>
    </div>
  );

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="px-4 py-2 border border-soft-200 rounded-lg flex items-center min-h-[41.6px] gap-2 text-sub-500 text-sm tracking-[-0.04px]"
      >
        <span className="hidden sm:block">Filter</span>
        <FiFilter className="text-soft-400" />
      </button>

      {showFilter && (
        <div className="bg-black-900/50 md:bg-transparent fixed md:static inset-0 md:inset-auto z-[150] md:z-auto">
          <div className="mt-10 p-4 border border-soft-200 rounded-lg fixed md:absolute top-1/2 translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 md:top-0 right-1/2 md:right-0 bg-white z-10 animate-fade-in min-w-[260px]">
            <div className="flex justify-between text-sub-500 border-b border-b-soft-200 pb-3 mb-5">
              <p className="text-xs">Filter</p>
              <button onClick={() => setShowFilter(false)} type="button">
                <FaXmark />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status */}
              <div className="flex flex-col gap-2">
                <Header label="Status" onClear={() => onFilterChange("status", "")} />
                <SelectInput
                  value={filters.status}
                  onChange={(v) => onFilterChange("status", v)}
                  options={STATUS_OPTIONS}
                  placeholder="Select status"
                  showStatusDot
                />
              </div>

              {/* Date range */}
              <div className="flex flex-col gap-2">
                <Header
                  label="Date range"
                  onClear={() => { onFilterChange("from", ""); onFilterChange("to", ""); }}
                />
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <Label label="From" />
                    <input
                      type="date"
                      value={filters.from}
                      onChange={(e) => onFilterChange("from", e.target.value)}
                      className="p-2 border border-soft-200 rounded-lg text-xs text-sub-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <Label label="To" />
                    <input
                      type="date"
                      value={filters.to}
                      onChange={(e) => onFilterChange("to", e.target.value)}
                      className="p-2 border border-soft-200 rounded-lg text-xs text-sub-500"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 justify-between">
                <button
                  onClick={() => { onReset(); setShowFilter(false); }}
                  className="px-3 py-1.5 border border-soft-200 rounded-lg text-sub-500 text-xs hover:opacity-90 transition-all"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilter(false)}
                  className="px-3 py-1.5 bg-purple-main text-white rounded-lg text-xs hover:opacity-90 transition-all"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilter;
