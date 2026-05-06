interface BlindCircleButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const BlindCircleButton: React.FC<BlindCircleButtonProps> = ({
  children,
  ...rest
}) => {
  const buttonClasses =
    "flex items-center justify-center w-6 md:w-[40px] h-6 md:h-[40px] rounded-full border border-[#F6F8FA] hover:scale-95 duration-300"

  return (
    <button type="button" className={buttonClasses} {...rest}>
      {children}
    </button>
  )
}

export default BlindCircleButton
