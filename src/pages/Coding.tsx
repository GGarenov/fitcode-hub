import { Layout } from "@/components/Layout";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Plus, Trash2, Code2, Flame } from "lucide-react";
import { format, parseISO, subDays, differenceInDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Coding = () => {
  const codingEntries = useAppStore((state) => state.codingEntries);
  const addCodingEntry = useAppStore((state) => state.addCodingEntry);
  const toggleCodingEntry = useAppStore((state) => state.toggleCodingEntry);
  const deleteCodingEntry = useAppStore((state) => state.deleteCodingEntry);

  const [task, setTask] = useState("");
  const [hours, setHours] = useState("");

  const handleAdd = () => {
    if (!task.trim() || !hours) return;

    addCodingEntry({
      date: new Date().toISOString(),
      task,
      hours: parseFloat(hours),
      completed: false,
    });

    setTask("");
    setHours("");
  };

  // Calculate streak
  const sortedEntries = [...codingEntries]
    .filter((e) => e.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let currentStreak = 0;
  if (sortedEntries.length > 0) {
    let lastDate = parseISO(sortedEntries[0].date);
    currentStreak = 1;

    for (let i = 1; i < sortedEntries.length; i++) {
      const entryDate = parseISO(sortedEntries[i].date);
      const daysDiff = differenceInDays(lastDate, entryDate);
      
      if (daysDiff === 1) {
        currentStreak++;
        lastDate = entryDate;
      } else if (daysDiff > 1) {
        break;
      }
    }
  }

  const totalHours = codingEntries.reduce((sum, e) => sum + e.hours, 0);
  const completedCount = codingEntries.filter((e) => e.completed).length;

  // Chart data for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayHours = codingEntries
      .filter((e) => format(parseISO(e.date), "yyyy-MM-dd") === dateStr)
      .reduce((sum, e) => sum + e.hours, 0);
    return {
      date: format(date, "MMM d"),
      hours: dayHours,
    };
  });

  const recentEntries = [...codingEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <Layout>
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-3">
          <Code2 className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Coding Progress</h1>
            <p className="text-muted-foreground mt-1">Track your coding journey</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                {totalHours.toFixed(1)}h
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{completedCount}</p>
            </CardContent>
          </Card>

          <Card className="shadow-card gradient-secondary/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">Current Streak</CardTitle>
              <Flame className="w-5 h-5 text-secondary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold gradient-secondary bg-clip-text text-transparent">
                {currentStreak} days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Weekly Coding Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Add Entry */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Log Coding Session</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Task Description</Label>
                  <Input
                    placeholder="e.g., Built user authentication"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hours Spent</Label>
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="e.g., 2.5"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </div>

                <Button onClick={handleAdd} className="w-full gradient-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Session
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {recentEntries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No coding sessions logged yet.</p>
                ) : (
                  recentEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth group"
                    >
                      <Checkbox
                        checked={entry.completed}
                        onCheckedChange={() => toggleCodingEntry(entry.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            entry.completed ? "line-through text-muted-foreground" : "text-foreground"
                          }`}
                        >
                          {entry.task}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">{entry.hours}h</span>
                          <span className="text-xs text-muted-foreground">
                            • {format(parseISO(entry.date), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCodingEntry(entry.id)}
                        className="opacity-0 group-hover:opacity-100 transition-smooth"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Coding;
