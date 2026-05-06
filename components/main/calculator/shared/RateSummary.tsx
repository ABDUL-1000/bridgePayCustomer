interface RateSummaryProps {
  fromCurrency: string
  toCurrency: string
  rate: number
  amount: number
  serviceFeePercentage?: number
}

const RateSummary: React.FC<RateSummaryProps> = ({
  fromCurrency,
  toCurrency,
  rate,
  amount,
  serviceFeePercentage = 1.5, // Default to 1.5%
}) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const convertedAmount = amount * rate
  const serviceFee = (convertedAmount * serviceFeePercentage) / 100
  const total = convertedAmount + serviceFee

  const summaryItems = [
    {
      label: "Rate",
      value: `1 ${fromCurrency} = ${formatCurrency(rate)} ${toCurrency}`,
    },
    {
      label: "Service Fee",
      value: `${formatCurrency(serviceFee)} ${toCurrency}`,
    },
    {
      label: "Total",
      value: `${formatCurrency(total)} ${toCurrency}`,
    },
  ]

  return (
    <div className="relative rounded-[12px] md:rounded-[24px] p-[2px]">
      <div
        style={{
          background: "linear-gradient(to right, #02C800, #D8DB3D)",
        }}
        className="absolute inset-0 rounded-[12px] md:rounded-[24px]"
      />
      <div className="relative bg-gradient-to-r from-[#D9FFD6] to-[#FDFFD6] rounded-[12px] p-4 md:p-6 md:rounded-[22px]">
        <div className="space-y-2.5">
          {summaryItems.map(({ label, value }) => (
            <div
              key={label}
              className="flex justify-between items-center text-black-900"
            >
              <span className="text-sm md:text-lg">{label}</span>
              <span className="text-sm md:text-base font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RateSummary
