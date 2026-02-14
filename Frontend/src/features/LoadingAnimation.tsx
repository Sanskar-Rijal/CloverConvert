import { ThreeDot } from "react-loading-indicators";

function LoadingAnimation() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-200/20 backdrop-blur-sm">
      <ThreeDot
        variant="bounce"
        color="#2FBF8F"
        size="large"
        text=""
        textColor=""
      />
    </div>
  );
}

export default LoadingAnimation;
