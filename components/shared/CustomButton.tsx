import clsx from "clsx";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  paddingX?: number;
  paddingY?: number;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  children,
  paddingX = 12,
  paddingY = 12,
  className,
  disabled,
  ...rest
}) => (
  <button
    type={type}
    disabled={disabled}
    style={{ padding: `${paddingY}px ${paddingX}px` }}
    className={clsx([
      "bg-purple-main text-sm text-white duration-200 shadow-sm",
      className,
      {
        "opacity-50 cursor-not-allowed": disabled,
        "hover:scale-[.97]": !disabled,
      },
    ])}
    {...rest}
  >
    {children}
  </button>
);

export default Button;

interface CustomizableButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const CustomizableButton: React.FC<CustomizableButtonProps> = ({
  type = "button",
  children,
  className = "bg-transparent border-none outline-none",
  disabled,
  ...rest
}) => (
  <button
    type={type}
    className={clsx([
      className,
      {
        "opacity-85": disabled,
      },
    ])}
    disabled={disabled}
    {...rest}
  >
    {children}
  </button>
);

export { CustomizableButton };
