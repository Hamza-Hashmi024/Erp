const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8" 
         style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mb-8">
          <h2 className="mt-6 text-6xl font-extrabold" style={{ color: "#993F82" }}>404</h2>
          <p className="mt-2 text-3xl font-bold" style={{ color: "#47464C" }}>Page not found</p>
          <p className="mt-2 text-sm" style={{ color: "#47464C" }}>
            Sorry, we couldn,t find the page you,re looking for.
          </p>
        </div>
        <div className="mt-8">
          <a href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm hover:scale-105 transition-transform"
            style={{ 
              backgroundColor: "#993F82",
              color: "#FFFFFF"
            }}>
            <svg 
              className="mr-2 h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              style={{ color: "#FFFFFF" }}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            Go back home
          </a>
        </div>
      </div>
      <div className="mt-16 w-full max-w-2xl">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t" style={{ borderColor: "#47464C" }}></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 text-sm" style={{ 
              backgroundColor: "#FFFFFF",
              color: "#47464C"
            }}>
              If you think this is a mistake, please contact support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;