import { useRef, useState } from "react";
import { SelectInput, Option } from "./SelectInput";

interface StatementState {
  accountType: string;
  dateFrom: string;
  dateTo: string;
  format: string;
}

const ACCOUNT_OPTIONS: Option[] = [
  { value: "ngn", label: "Naira Account" },
  { value: "usd", label: "USD Card" },
];

const FORMAT_OPTIONS: Option[] = [
  { value: "download", label: "Download PDF" },
  { value: "mail", label: "Send as Mail" },
];

const Statement = () => {
  const [showStatement, setShowStatement] = useState(false);
  const [statements, setStatements] = useState<StatementState>({
    accountType: "",
    dateFrom: "",
    dateTo: "",
    format: "",
  });
  const statementRef = useRef<HTMLDivElement>(null);



  const handleChange = (key: keyof StatementState, value: string) => {
    setStatements((prev) => ({ ...prev, [key]: value }));
  };

  const Label = ({ label }: { label: string }) => (
    <label className="text-xs text-sub-500">{label}</label>
  );

  return (
    <div className="relative block" ref={statementRef}>
      <button
        onClick={() => setShowStatement(!showStatement)}
        className="px-4 py-2 border border-soft-200 rounded-lg flex items-center gap-2 text-sub-500 text-sm tracking-[-0.04px]"
      >
        <StatementIcon />
        <span className="hidden md:block">Statement</span>
      </button>

      {showStatement && (
        <div className="mt-10 p-4 border border-soft-200 rounded-lg absolute top-0 right-0 bg-white z-10 animate-fade-in">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label label="Statement account" />
              <SelectInput
                value={statements.accountType}
                onChange={(value) => handleChange("accountType", value)}
                options={ACCOUNT_OPTIONS}
                placeholder="Select type"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label label="Select date" />
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <Label label="From" />
                  <input
                    type="date"
                    value={statements.dateFrom}
                    onChange={(e) => handleChange("dateFrom", e.target.value)}
                    className="p-2 border border-soft-200 rounded-lg text-xs text-sub-500"
                  />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <Label label="To" />
                  <input
                    type="date"
                    value={statements.dateTo}
                    onChange={(e) => handleChange("dateTo", e.target.value)}
                    className="p-2 border border-soft-200 rounded-lg text-xs text-sub-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label label="Format" />
              <SelectInput
                value={statements.format}
                onChange={(value) => handleChange("format", value)}
                options={FORMAT_OPTIONS}
                placeholder="Select Format"
              />
            </div>

            <button
              onClick={() => setShowStatement(false)}
              className="px-3 py-1.5 bg-purple-main text-white rounded-lg text-xs hover:opacity-90 transition-all self-end w-fit"
            >
              Get Statement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statement;

const StatementIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M15.6 19.2V4.8H4.8V18.3C4.8 18.5387 4.89482 18.7676 5.0636 18.9364C5.23239 19.1052 5.46131 19.2 5.7 19.2H15.6ZM18.3 21H5.7C4.98392 21 4.29716 20.7155 3.79081 20.2092C3.28446 19.7028 3 19.0161 3 18.3V3.9C3 3.66131 3.09482 3.43239 3.2636 3.2636C3.43239 3.09482 3.66131 3 3.9 3H16.5C16.7387 3 16.9676 3.09482 17.1364 3.2636C17.3052 3.43239 17.4 3.66131 17.4 3.9V10.2H21V18.3C21 19.0161 20.7155 19.7028 20.2092 20.2092C19.7028 20.7155 19.0161 21 18.3 21ZM17.4 12V18.3C17.4 18.5387 17.4948 18.7676 17.6636 18.9364C17.8324 19.1052 18.0613 19.2 18.3 19.2C18.5387 19.2 18.7676 19.1052 18.9364 18.9364C19.1052 18.7676 19.2 18.5387 19.2 18.3V12H17.4ZM6.6 6.6H12V12H6.6V6.6ZM8.4 8.4V10.2H10.2V8.4H8.4ZM6.6 12.9H13.8V14.7H6.6V12.9ZM6.6 15.6H13.8V17.4H6.6V15.6Z"
      fill="#868c98"
    />
  </svg>
);
