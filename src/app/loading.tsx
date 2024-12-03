const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
            </div>
        </div>
    );
};
  
export default Loading;