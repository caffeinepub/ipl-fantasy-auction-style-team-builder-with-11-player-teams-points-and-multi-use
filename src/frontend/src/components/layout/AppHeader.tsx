import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import LoginButton from '../auth/LoginButton';
import { Button } from '@/components/ui/button';
import { Users, PlusCircle } from 'lucide-react';

interface AppHeaderProps {
  currentView: 'build' | 'manage';
  onViewChange: (view: 'build' | 'manage') => void;
}

export default function AppHeader({ currentView, onViewChange }: AppHeaderProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/ipl-fantasy-logo.dim_512x512.png" 
              alt="IPL Fantasy" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold">IPL Fantasy League</h1>
              {userProfile && (
                <p className="text-sm text-muted-foreground">Welcome, {userProfile.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex gap-2">
              <Button
                variant={currentView === 'build' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('build')}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Build Team
              </Button>
              <Button
                variant={currentView === 'manage' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('manage')}
              >
                <Users className="mr-2 h-4 w-4" />
                My Teams
              </Button>
            </nav>
            <LoginButton />
          </div>
        </div>

        <nav className="flex sm:hidden gap-2 mt-3">
          <Button
            variant={currentView === 'build' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('build')}
            className="flex-1"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Build Team
          </Button>
          <Button
            variant={currentView === 'manage' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('manage')}
            className="flex-1"
          >
            <Users className="mr-2 h-4 w-4" />
            My Teams
          </Button>
        </nav>
      </div>
    </header>
  );
}
