import LoginButton from './LoginButton';

export default function AuthGate() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <img 
            src="/assets/generated/ipl-fantasy-logo.dim_512x512.png" 
            alt="IPL Fantasy Logo" 
            className="w-32 h-32 mx-auto"
          />
          <h1 className="text-4xl font-bold text-balance">
            IPL Fantasy League
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Build your dream cricket team. Select 11 players and compete for glory.
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to create your fantasy team and start playing
          </p>
          <LoginButton />
        </div>

        <p className="text-xs text-muted-foreground">
          Secure authentication powered by Internet Identity
        </p>
      </div>
    </div>
  );
}
