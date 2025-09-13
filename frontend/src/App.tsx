import { Button } from "@/components/ui/button"
import { AppProviders } from './contexts/AppProviders'
import { useAuth } from './contexts/AuthContext'
import './App.css'

function AppContent() {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <div className="text-center space-y-4">
                <Button>Click me</Button>
                <div className="text-sm text-muted-foreground">
                    {isAuthenticated ? (
                        <p>Welcome, {user?.username}!</p>
                    ) : (
                        <p>Not authenticated</p>
                    )}
                </div>
            </div>
        </div>
    )
}

function App() {
    return (
        <AppProviders>
            <AppContent />
        </AppProviders>
    )
}

export default App