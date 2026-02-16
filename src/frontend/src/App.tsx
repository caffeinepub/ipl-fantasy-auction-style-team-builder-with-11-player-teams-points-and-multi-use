import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import AuthGate from './components/auth/AuthGate';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import AppShell from './components/layout/AppShell';
import AppHeader from './components/layout/AppHeader';
import { useState } from 'react';
import TeamWizard from './features/teams/TeamWizard';
import ManageTeamsView from './features/teams/ManageTeamsView';

type View = 'build' | 'manage';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentView, setCurrentView] = useState<View>('build');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthGate />;
  }

  return (
    <AppShell>
      {showProfileSetup && <ProfileSetupDialog />}
      <AppHeader currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1">
        {currentView === 'build' ? (
          <TeamWizard />
        ) : (
          <ManageTeamsView onCreateNew={() => setCurrentView('build')} />
        )}
      </main>
    </AppShell>
  );
}
