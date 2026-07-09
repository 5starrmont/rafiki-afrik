function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Test Header */}
      <header className="bg-primary p-6">
        <h1 className="text-4xl text-white">Rafiki Afrik</h1>
      </header>

      {/* Test Body */}
      <main className="p-6">
        <p className="text-tertiary text-lg mb-4">
          The fonts and brand colors are locked in and ready to go.
        </p>
        <button className="bg-secondary text-white px-6 py-2 rounded">
          Secondary Button
        </button>
      </main>
    </div>
  )
}

export default App