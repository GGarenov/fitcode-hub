import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";
import { Sparkles, Target, TrendingUp } from "lucide-react";

const Onboarding = () => {
  const setOnboardingComplete = useAppStore((state) => state.setOnboardingComplete);
  const navigate = useNavigate();

  const handleStart = () => {
    setOnboardingComplete();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 gradient-hero">
      <div className="max-w-2xl w-full bg-card/95 backdrop-blur rounded-2xl shadow-glow p-8 md:p-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Welcome to <span className="gradient-primary bg-clip-text text-transparent">FitCode Tracker</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Your personal productivity companion for tracking fitness, coding progress, and achieving your goals.
          </p>

          <div className="grid md:grid-cols-3 gap-6 py-8">
            <div className="space-y-3 p-6 rounded-xl bg-muted/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Track Goals</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your daily tasks, workouts, and coding sessions
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-xl bg-muted/50">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground">See Progress</h3>
              <p className="text-sm text-muted-foreground">
                Visualize your growth with charts and streaks
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-xl bg-muted/50">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground">Earn Achievements</h3>
              <p className="text-sm text-muted-foreground">
                Unlock rewards as you hit milestones
              </p>
            </div>
          </div>

          <Button
            onClick={handleStart}
            size="lg"
            className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-smooth text-lg px-8 py-6"
          >
            Get Started
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            All your data is stored locally in your browser. No account required.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
