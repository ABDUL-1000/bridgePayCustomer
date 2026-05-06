"use client";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { ParagraphMd } from "../../../../shared/Text";

const ActiveStatusBar: React.FC = () => {
  const [accountIsUnderReview, setAccountIsUnderReview] = useState(true); // Local state
  const checkboxButtonRef = useRef<HTMLDivElement>(null);
  const checkboxContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (checkboxContainerRef.current && checkboxButtonRef.current) {
        const containerWidth = checkboxContainerRef.current.offsetWidth;
        const containerHeight = checkboxContainerRef.current.offsetHeight;

        checkboxButtonRef.current.style.height = `${containerHeight}px`;
        checkboxButtonRef.current.style.width = `${containerWidth / 2}px`;
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const toggleIsActive = () => {
    setAccountIsUnderReview((prev) => !prev); // Update local state
  };

  return (
    <div className="w-full flex items-center justify-center gap-2 pb-16">
      <ParagraphMd className="text-black-900 font-medium">
        {accountIsUnderReview ? "Live Mode" : "Under Review"}
      </ParagraphMd>

      <div
        onClick={toggleIsActive}
        ref={checkboxContainerRef}
        className={clsx([
          "relative w-[34px] h-[16px] rounded-full shadow-inner opacity-1 cursor-pointer duration-500",
          {
            "bg-[#E2E4E9]": !accountIsUnderReview,
            "bg-[#2D9F75]": accountIsUnderReview,
          },
        ])}
      >
        <div
          ref={checkboxButtonRef}
          className={clsx([
            `absolute top-1/2 -translate-y-1/2 flex items-center justify-center duration-200 bg-white rounded-full max-w-[12px] max-h-[12px]`,
            {
              "left-1": !accountIsUnderReview,
              "left-[calc(100%-16px)]": accountIsUnderReview,
            },
          ])}
        >
          <div
            className={clsx([
              "w-[4px] h-[4px] rounded-full",
              {
                "bg-[#2D9F75]": accountIsUnderReview,
                "bg-[#E2E4E9]": !accountIsUnderReview,
              },
            ])}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ActiveStatusBar;
