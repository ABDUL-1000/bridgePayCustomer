export const PAYMENT_OPTIONS: Option[] = [
  { value: "payment_request", label: "Payment Request" },
  { value: "credit", label: "Credit" },
  { value: "debit", label: "Debit" },
]

export const STATUS_OPTIONS: Option[] = [
  { value: "successful", label: "Successful" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
]

export interface Option {
  value: string
  label: string
}
export const SelectInput = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  showStatusDot = false,
}: {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  showStatusDot?: boolean
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`p-2 border border-soft-200 rounded-lg h-full flex text-sub-500 text-xs w-full  pr-6 appearance-none transition-all ${
        showStatusDot && value ? "pl-5" : "pl-2"
      }`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {showStatusDot && value && (
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <div
          className={`w-2 h-2 rounded-full ${
            value === "successful"
              ? "bg-success"
              : value === "pending"
                ? "bg-yellow-away "
                : value === "failed"
                  ? "bg-error"
                  : ""
          }`}
        />
      </div>
    )}
    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg
        className="w-[14px] h-[14px] text-sub-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>
)
