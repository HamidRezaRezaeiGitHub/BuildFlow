import { Button } from "@/components/ui/button"
import './App.css'
import { ThemeShowcase } from './components/theme'
import { AppProviders } from './contexts/AppProviders'
import { useAuth } from './contexts/AuthContext'

function AppContent() {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* App header with auth info */}
            <header className="border-b border-border bg-card">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary">BuildFlow</h1>
                    <div className="flex items-center gap-4">
                        {/* Authentication status */}
                        <div className="text-sm">
                            {isAuthenticated ? (
                                <span className="text-primary font-medium">
                                    Welcome, {user?.username}!
                                </span>
                            ) : (
                                <span className="text-muted-foreground">
                                    Not authenticated
                                </span>
                            )}
                        </div>
                        {!isAuthenticated && (
                            <Button size="sm">Login</Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Theme showcase component */}
            <ThemeShowcase showHeader={false} />
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