import LoginForm from './LoginForm';
import LoadingSpinner from './LoadingSpinner';

interface AdminLoginContainerProps {
    onSubmit: (username: string, password: string) => Promise<void>;
    loading: boolean;
    error: string;
    checkingSession: boolean;
}

export default function AdminLoginContainer({
    onSubmit,
    loading,
    error,
    checkingSession
}: AdminLoginContainerProps) {
    // Show loading state while checking session
    if (checkingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-primary-600">Tirta Fresh Admin</h1>
                <p className="text-gray-600 mt-2">Login to access your dashboard</p>
            </div>
            <LoginForm
                onSubmit={onSubmit}
                loading={loading}
                error={error}
            />
        </div>
    );
}
