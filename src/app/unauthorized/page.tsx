import Link from "next/link";

const Unauthorized = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-red-400 to-yellow-400 text-white text-center">
        <h1 className="text-9xl font-bold">403</h1>
        <h2 className="text-3xl font-semibold mt-4">Unauthorized Access</h2>
        <p className="mt-2 text-lg">Sorry, you do not have permission to view this page.</p>
        <Link href="/" className="mt-6 px-4 py-2 bg-white text-red-500 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition duration-300">
            Go to Home
        </Link>
      </div>
    );
  };
  
  export default Unauthorized;
  