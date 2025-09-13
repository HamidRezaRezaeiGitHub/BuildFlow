import './App.css'
import { AppProviders } from './contexts/AppProviders'
import { AppRouter } from './router/AppRouter'

/**
 * Main App component that sets up the entire application.
 * 
 * Structure:
 * - AppProviders: Wraps the app with all necessary context providers (Router, Theme, Auth, etc.)
 * - AppRouter: Handles all routing logic and renders appropriate components
 * 
 * This clean separation allows for:
 * - Easy testing of individual components
 * - Clear separation of concerns
 * - Maintainable code structure
 */
function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}

export default App