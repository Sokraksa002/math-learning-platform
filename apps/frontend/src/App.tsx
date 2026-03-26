function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">
          Grade 12 Math Learning Platform
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            Tailwind CSS is working ✅
          </h2>

          <p className="text-gray-600 mb-6">
            Your frontend technology setup is complete.
            You can now start building lessons, quizzes,
            flashcards, and analysis dashboards.
          </p>

          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => alert("Frontend is ready 🚀")}
          >
            Get Started
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center p-3 text-sm text-gray-600">
        © 2026 Grade 12 Math Platform
      </footer>
    </div>
  );
}

export default App;