import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="bg-card text-card-foreground p-8 rounded-lg shadow-md border text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">
          Vite + React + TypeScript + Tailwind + shadcn/ui
        </h1>
        <div className="mb-6">
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2 px-4 rounded-md transition-colors duration-200"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>
        </div>
        <p className="text-muted-foreground">
          Edit <code className="bg-muted px-2 py-1 rounded text-muted-foreground">src/App.tsx</code> and save to test HMR
        </p>
        <p className="text-muted-foreground/80 mt-4 text-sm">
          shadcn/ui is now configured and ready to use
        </p>
      </div>
    </div>
  )
}

export default App