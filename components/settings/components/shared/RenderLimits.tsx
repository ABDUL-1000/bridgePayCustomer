import { TierLimits } from "@/shared-types";
export interface Limits {
  maximumAccountLimit: string;
  maximumTransactionLimit: string;
  cardLimitPerTransaction: string;
  cardBalanceLimit: string;
}
export const RenderLimits = ({ limits }: { limits: TierLimits }) => {
  return (
    <table className="w-full text-sm tracking-[0.084px]">
      <tbody>
        {Object.entries(limits).map(([key, value]) => (
          <tr key={key} className="capitalize">
            <td className="text-sub-500 py-1">
              {key
                .split(/(?=[A-Z])|_/)
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </td>
            <td className="text-black-900 py-1">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
