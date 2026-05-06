import clsx from "clsx"

interface BottomBorderContainerProps extends React.HTMLProps<HTMLDivElement> {}
export const BottomBorderContainer: React.FC<BottomBorderContainerProps> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        "py-2.5 border-b border-b-soft-200 last:border-b-transparent",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
