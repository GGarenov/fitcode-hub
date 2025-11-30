import { Layout } from "@/components/Layout";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, TrendingUp, Flame, Target } from "lucide-react";
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const tasks = useAppStore((state) => state.tasks);
  const achievements = useAppStore((state) => state.achievements);
  const fitnessEntries = useAppStore((state) => state.fitnessEntries);
  const codingEntries = useAppStore((state) => state.codingEntries);

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);

  // Today's tasks
  const todayTasks = tasks.filter((task) => {
    const taskDate = parseISO(task.date);
    return format(taskDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  });
  const todayCompleted = todayTasks.filter((t) => t.isCompleted).length;
  const todayProgress = todayTasks.length > 0 ? (todayCompleted / todayTasks.length) * 100 : 0;

  // Week's tasks
  const weekTasks = tasks.filter((task) => {
    const taskDate = parseISO(task.date);
    return isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
  });
  const weekCompleted = weekTasks.filter((t) => t.isCompleted).length;
  const weekProgress = weekTasks.length > 0 ? (weekCompleted / weekTasks.length) * 100 : 0;

  // Calculate streak
  const dailyTasks = tasks.filter(t => t.isDaily).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  let currentStreak = 0;
  if (dailyTasks.length > 0 && dailyTasks[0].isCompleted) {
    currentStreak = 1;
    for (let i = 1; i < dailyTasks.length; i++) {
      if (dailyTasks[i].isCompleted) currentStreak++;
      else break;
    }
  }

  // Recent achievements
  const recentAchievements = achievements
    .filter((a) => a.unlocked)
    .sort((a, b) => 
      new Date(b.dateUnlocked || 0).getTime() - new Date(a.dateUnlocked || 0).getTime()
    )
    .slice(0, 3);

  return (
    <Layout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">{format(today, "EEEE, MMMM d, yyyy")}</p>
          </div>
          <Button
            onClick={() => navigate("/tasks")}
            className="gradient-primary text-primary-foreground shadow-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Progress
              </CardTitle>
              <Target className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{todayCompleted}/{todayTasks.length}</div>
              <Progress value={todayProgress} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Weekly Progress
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{weekCompleted}/{weekTasks.length}</div>
              <Progress value={weekProgress} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Streak
              </CardTitle>
              <Flame className="w-4 h-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-secondary bg-clip-text text-transparent">
                {currentStreak} days
              </div>
              <p className="text-xs text-muted-foreground mt-2">Keep it going!</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Achievements
              </CardTitle>
              <span className="text-2xl">{recentAchievements[0]?.icon || "🏆"}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {achievements.filter(a => a.unlocked).length}/{achievements.length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Unlocked</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Today's Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayTasks.length === 0 ? (
                <p className="text-muted-foreground text-sm">No tasks for today. Add some!</p>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
                  >
                    <span className="text-2xl">{task.icon || "📌"}</span>
                    <div className="flex-1">
                      <p className={`font-medium ${task.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {task.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{task.category}</p>
                    </div>
                    {task.isCompleted && (
                      <span className="text-accent">✓</span>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAchievements.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Complete tasks to unlock achievements!
                </p>
              ) : (
                recentAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20"
                  >
                    <span className="text-3xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Fitness Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Workouts</p>
                  <p className="text-2xl font-bold text-foreground">{fitnessEntries.length}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate("/fitness")}
                  className="w-full"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Coding Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Tasks</p>
                  <p className="text-2xl font-bold text-foreground">
                    {codingEntries.filter(e => e.completed).length}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate("/coding")}
                  className="w-full"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
