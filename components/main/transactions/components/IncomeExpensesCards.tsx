import { ParagraphLg, SubHeading } from "@/components/shared/Text";
import CustomImage from "@/components/ui/custom-image";
import { padAmount } from "@/lib/utils";
import {
  transactionsExpensesImg,
  transactionsPaymentRequestVolumeImg,
} from "@/public/main/svg";

const IncomeExpensesCards = () => {
  const paymentRequestVolume = padAmount(200);
  const expenses = padAmount(100);

  return (
    <section className="w-full flex justify-start gap-5">
      <div className="flex items-center justify-start gap-3">
        <CustomImage
          src={transactionsPaymentRequestVolumeImg}
          alt="Payment Request Volume"
          width={40}
        />
        <div>
          <SubHeading className="uppercase text-soft-400">
            Total payment request
          </SubHeading>
          <ParagraphLg className="text-black-900 font-medium mt-1">
            ${`${paymentRequestVolume[0]}.${paymentRequestVolume[1]}`}
          </ParagraphLg>
        </div>
      </div>
      <div className="flex items-center justify-start gap-3">
        <CustomImage
          src={transactionsExpensesImg}
          alt="Payment Request Volume"
          width={40}
        />
        <div>
          <SubHeading className="uppercase text-soft-400">
            Total card spent
          </SubHeading>
          <ParagraphLg className="text-black-900 font-medium mt-1">
            ${`${expenses[0]}.${expenses[1]}`}
          </ParagraphLg>
        </div>
      </div>
    </section>
  );
};

export default IncomeExpensesCards;
