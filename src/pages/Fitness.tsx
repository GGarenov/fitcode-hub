import { Layout } from "@/components/Layout";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, Trash2, TrendingUp } from "lucide-react";
import { format, parseISO, subDays } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Fitness = () => {
  const fitnessEntries = useAppStore((state) => state.fitnessEntries);
  const addFitnessEntry = useAppStore((state) => state.addFitnessEntry);
  const deleteFitnessEntry = useAppStore((state) => state.deleteFitnessEntry);

  const [type, setType] = useState<"workout" | "weight" | "general">("workout");
  const [value, setValue] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    addFitnessEntry({
      date: new Date().toISOString(),
      type,
      value: value ? parseFloat(value) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      notes: notes || undefined,
    });

    setValue("");
    setDuration("");
    setNotes("");
  };

  const recentEntries = [...fitnessEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Prepare chart data for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, "yyyy-MM-dd");
    const count = fitnessEntries.filter(
      (e) => format(parseISO(e.date), "yyyy-MM-dd") === dateStr
    ).length;
    return {
      date: format(date, "MMM d"),
      count,
    };
  });

  return (
    <Layout>
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-secondary" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Fitness Progress</h1>
            <p className="text-muted-foreground mt-1">Track your fitness journey</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold gradient-secondary bg-clip-text text-transparent">
                {fitnessEntries.filter((e) => e.type === "workout").length}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {last7Days.reduce((sum, day) => sum + day.count, 0)}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Latest Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {fitnessEntries
                  .filter((e) => e.type === "weight" && e.value)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
                  ?.value || "-"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last7Days}>
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
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--secondary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Add Entry */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Log Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(v: any) => setType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workout">Workout</SelectItem>
                      <SelectItem value="weight">Weight</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {type === "weight" && (
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 75"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                )}

                {type === "workout" && (
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      placeholder="e.g., 45"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    placeholder="Add details about your activity..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button onClick={handleAdd} className="w-full gradient-secondary text-secondary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Activity
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {recentEntries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No activities logged yet.</p>
                ) : (
                  recentEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground capitalize">{entry.type}</span>
                          {entry.value && (
                            <span className="text-sm text-muted-foreground">• {entry.value} kg</span>
                          )}
                          {entry.duration && (
                            <span className="text-sm text-muted-foreground">• {entry.duration} min</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(parseISO(entry.date), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                        {entry.notes && (
                          <p className="text-sm text-foreground mt-2">{entry.notes}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteFitnessEntry(entry.id)}
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

export default Fitness;
