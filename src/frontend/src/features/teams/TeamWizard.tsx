import { useState } from 'react';
import CreateTeamStep from './CreateTeamStep';
import PlayerSelectionStep from './PlayerSelectionStep';
import RosterReview from './RosterReview';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

type WizardStep = 'create' | 'select' | 'review';

export default function TeamWizard() {
  const [step, setStep] = useState<WizardStep>('create');
  const [currentTeamId, setCurrentTeamId] = useState<bigint | null>(null);

  const handleTeamCreated = (teamId: bigint) => {
    setCurrentTeamId(teamId);
    setStep('select');
  };

  const handlePlayersSelected = () => {
    setStep('review');
  };

  const handleTeamFinalized = () => {
    setCurrentTeamId(null);
    setStep('create');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Build Your Fantasy Team</h2>
        <p className="text-muted-foreground">Follow the steps to create your winning squad</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4">
          <StepIndicator 
            number={1} 
            label="Create Team" 
            active={step === 'create'} 
            completed={step === 'select' || step === 'review'} 
          />
          <div className="h-0.5 w-16 bg-border" />
          <StepIndicator 
            number={2} 
            label="Select Players" 
            active={step === 'select'} 
            completed={step === 'review'} 
          />
          <div className="h-0.5 w-16 bg-border" />
          <StepIndicator 
            number={3} 
            label="Review & Confirm" 
            active={step === 'review'} 
            completed={false} 
          />
        </div>
      </div>

      {/* Step Content */}
      {step === 'create' && <CreateTeamStep onTeamCreated={handleTeamCreated} />}
      {step === 'select' && currentTeamId && (
        <PlayerSelectionStep 
          teamId={currentTeamId} 
          onContinue={handlePlayersSelected}
        />
      )}
      {step === 'review' && currentTeamId && (
        <RosterReview 
          teamId={currentTeamId} 
          onFinalize={handleTeamFinalized}
        />
      )}
    </div>
  );
}

interface StepIndicatorProps {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}

function StepIndicator({ number, label, active, completed }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
          completed
            ? 'bg-accent text-accent-foreground'
            : active
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        {completed ? <CheckCircle2 className="h-5 w-5" /> : number}
      </div>
      <span className={`text-sm font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
        {label}
      </span>
    </div>
  );
}
