// "use client";

// const LoadingComponent = () => {
//   return (
//     <div className="fixed w-screen h-screen bg-white flex flex-col items-center justify-center gap-4">
//       <div className="relative">
//         <div className="w-12 h-12 rounded-full border-4 border-purple-20 border-t-purple-50 animate-spin"></div>
//       </div>
//     </div>
//   );
// };

// export default LoadingComponent;

"use client";

interface LoadingComponentProps {
  inline?: boolean;
}

const LoadingComponent = ({ inline = false }: LoadingComponentProps) => {
  if (inline) {
    return (
      <div className="flex items-center justify-center p-4 ">
        <div className="relative">
          <div className="w-8 h-8 rounded-full border-4 border-purple-20 border-t-purple-60 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed w-screen h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-purple-20 border-t-purple-60 animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingComponent;
