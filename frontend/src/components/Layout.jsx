import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
    window.location.reload();
  };

  const isAuthenticated = localStorage.getItem('access_token') !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-teal-900 to-gray-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>
      
      {/* Header */}
      <header className="w-full bg-black text-yellow-400 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex space-x-8">
            <Link to="/video" className="text-lg font-medium hover:text-yellow-300 transition-colors">
              Video
            </Link>
            <Link to="/" className="text-lg font-medium hover:text-yellow-300 transition-colors">
              Story
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Link 
                to="/create" 
                className="px-5 py-2 bg-red-600 rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                Post Story
              </Link>
            )}
            {isAuthenticated ? (
              <button onClick={handleLogout} className="px-5 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 text-yellow-400 hover:text-yellow-300 transition-colors">Login</Link>
                <Link to="/register" className="px-5 py-2 bg-red-600 rounded-lg font-medium hover:bg-red-700 transition-all">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - Only on Home Page */}
      {!['/login', '/register'].includes(location.pathname) && (
        <section className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          {/* Glowing Book Icon */}
          <div className="relative mb-8">
            <div className="w-40 h-40 rounded-full bg-purple-600/30 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <div className="w-32 h-32 rounded-full bg-pink-600/30 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-blue-600/30 flex items-center justify-center">
                  <span className="text-5xl">📖</span>
                </div>
              </div>
            </div>
            {/* Animated Bubbles */}
            <div className="absolute inset-0 animate-pulse">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-white/50"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Welcome Box */}
          <div className="bg-gray-800/90 rounded-xl p-8 max-w-md w-full text-center shadow-xl">
            <h1 className="text-3xl font-bold mb-4">
              Welcome to <span className="text-yellow-400">StoryVerse!</span>
            </h1>
            <p className="text-gray-300 mb-8">
              Dive into a world of imagination and thrilling stories with StoryVerse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isAuthenticated ? "/create" : "/register"}
                className="inline-block px-8 py-3 bg-red-600 text-white rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-red-700 hover:shadow-lg"
              >
                Start Your Adventure
              </Link>
              {isAuthenticated && (
                <Link
                  to="/create"
                  className="inline-block px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-white/10"
                >
                  Post Your Story
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className={`${['/login', '/register'].includes(location.pathname) ? 'pt-24' : ''} pb-16 max-w-7xl mx-auto px-4`}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-400">
        <p>© 2026 StoryVerse, Craft amazing stories worldwide.</p>
      </footer>
    </div>
  );
};

export default Layout;