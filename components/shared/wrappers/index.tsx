interface WrapperProps {
  children: React.ReactNode;
}
export const MainWrapper = ({ children }: WrapperProps) => {
  return <div className="max-w-[1139px] mx-auto w-[92%]">{children}</div>;
};
export const WideWrapper = ({ children }: WrapperProps) => {
  return <div className="max-w-[1248px] mx-auto w-[92%]">{children}</div>;
};
