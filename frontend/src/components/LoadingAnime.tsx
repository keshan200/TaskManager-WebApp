

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
       
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 border-2 border-blue-500 rounded"
              style={{
                animation: `checkPulse 1.5s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
        
        <p className="text-gray-600 text-sm font-medium">Loading tasks...</p>
      </div>
      
      <style>{`
        @keyframes checkPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
            background-color: transparent;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
            background-color: rgb(59, 130, 246);
          }
        }
      `}</style>
    </div>

  );
};

export default Loading;