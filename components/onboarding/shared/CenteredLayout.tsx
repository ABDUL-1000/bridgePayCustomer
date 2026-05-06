import { ChildrenProps } from "@/shared-types";

const CenteredLayout = ({ children }: ChildrenProps) => {
  return (
    <div className="w-full  sm:px-0 sm:w-auto lg:w-fit flex flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default CenteredLayout;
