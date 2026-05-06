interface AnimateDetailProps {
  canView: boolean;
  hiddenContent: React.ReactNode;
  visibleContent: React.ReactNode;
}

const AnimateDetail: React.FC<AnimateDetailProps> = ({
  canView,
  hiddenContent,
  visibleContent,
}) => (
  <div className="relative overflow-hidden">
    <div
      className={`transition-all duration-200 ${
        canView ? "opacity-0 pointer-events-none absolute" : "opacity-60"
      }`}
    >
      {hiddenContent}
    </div>
    <div
      className={`transition-all duration-200 ${
        canView ? "opacity-100" : "opacity-0 pointer-events-none absolute"
      }`}
    >
      {visibleContent}
    </div>
  </div>
);

export default AnimateDetail;
