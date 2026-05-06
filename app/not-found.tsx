import React from "react";
import Link from "next/link";
import { MainWrapper } from "@/components/shared/wrappers";

const NotFoundPage = () => {
  return (
    <div className="pt-[120px] md:pt-[180px]">
      <MainWrapper>
        <div className="flex items-center justify-center bg-[#F8F3FC] px-5 py-20 rounded-3xl">
          <div className="max-w-[400px] md:max-w-[600px] text-center px-4">
            <h1 className="text-2xl md:text-[32px] font-bold text-black-800 mb-4">
              404, Page Not Found
            </h1>
            <p className="text-gray-600 text-sm md:text-base mb-8">
              {`Apologies, The page you're looking for isn't available right now.
              It might be part of an update coming soon, moved, deleted, or
              maybe it never existed. Please check back later or return to the
              homepage.`}
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-main  hover:bg-purple-600 text-white rounded-lg transition-colors text-sm md:text-base"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </MainWrapper>
    </div>
  );
};

export default NotFoundPage;
