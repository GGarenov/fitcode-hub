import { Layout } from "@/components/Layout";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock } from "lucide-react";
import { format, parseISO } from "date-fns";

const Achievements = () => {
  const achievements = useAppStore((state) => state.achievements);

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  return (
    <Layout>
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-accent" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Achievements</h1>
            <p className="text-muted-foreground mt-1">
              {unlockedAchievements.length} of {achievements.length} unlocked
            </p>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="shadow-card gradient-hero/10 border-2 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Your Progress</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Keep completing tasks to unlock more achievements
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                  {((unlockedAchievements.length / achievements.length) * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Unlocked</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="shadow-card hover:shadow-glow transition-smooth bg-accent/5 border-accent/20"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{achievement.icon || "🏆"}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-lg">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                        {achievement.dateUnlocked && (
                          <Badge variant="secondary" className="mt-3">
                            Unlocked {format(parseISO(achievement.dateUnlocked), "MMM d, yyyy")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {lockedAchievements.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Locked</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="shadow-card opacity-60 hover:opacity-80 transition-smooth"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="text-5xl grayscale">{achievement.icon || "🏆"}</div>
                        <div className="absolute -top-1 -right-1 bg-muted rounded-full p-1">
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-lg">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                        <Badge variant="outline" className="mt-3">
                          {achievement.conditionType.replace("-", " ")} • Target: {achievement.target}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Achievements;
