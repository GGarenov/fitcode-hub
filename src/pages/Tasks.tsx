import { Layout } from "@/components/Layout";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { TaskCategory } from "@/types";
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from "date-fns";

const Tasks = () => {
  const tasks = useAppStore((state) => state.tasks);
  const addTask = useAppStore((state) => state.addTask);
  const toggleTask = useAppStore((state) => state.toggleTask);
  const deleteTask = useAppStore((state) => state.deleteTask);

  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>("personal");
  const [newTaskIcon, setNewTaskIcon] = useState("");
  const [isDaily, setIsDaily] = useState(true);

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;

    addTask({
      name: newTaskName,
      category: newTaskCategory,
      icon: newTaskIcon || undefined,
      isCompleted: false,
      date: new Date().toISOString(),
      isDaily,
    });

    setNewTaskName("");
    setNewTaskIcon("");
  };

  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);

  const dailyTasks = tasks.filter((t) => t.isDaily);
  const weeklyTasks = tasks.filter((t) => {
    if (t.isDaily) return false;
    const taskDate = parseISO(t.date);
    return isWithinInterval(taskDate, { start: weekStart, end: weekEnd });
  });

  const dailyCompleted = dailyTasks.filter((t) => t.isCompleted).length;
  const weeklyCompleted = weeklyTasks.filter((t) => t.isCompleted).length;
  const dailyProgress = dailyTasks.length > 0 ? (dailyCompleted / dailyTasks.length) * 100 : 0;
  const weeklyProgress = weeklyTasks.length > 0 ? (weeklyCompleted / weeklyTasks.length) * 100 : 0;

  return (
    <Layout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your daily and weekly tasks</p>
        </div>

        {/* Add Task Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Task Name</Label>
                  <Input
                    placeholder="e.g., Morning workout"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Icon (optional)</Label>
                  <Input
                    placeholder="e.g., 🏋️"
                    value={newTaskIcon}
                    onChange={(e) => setNewTaskIcon(e.target.value)}
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={newTaskCategory}
                    onValueChange={(value) => setNewTaskCategory(value as TaskCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="coding">Coding</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="flex items-center space-x-4 h-10">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="daily"
                        checked={isDaily}
                        onCheckedChange={(checked) => setIsDaily(checked as boolean)}
                      />
                      <label htmlFor="daily" className="text-sm cursor-pointer">
                        Daily Habit
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="weekly"
                        checked={!isDaily}
                        onCheckedChange={(checked) => setIsDaily(!(checked as boolean))}
                      />
                      <label htmlFor="weekly" className="text-sm cursor-pointer">
                        Weekly Task
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddTask}
                className="gradient-primary text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Tasks */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Daily Habits</CardTitle>
              <span className="text-sm text-muted-foreground">
                {dailyCompleted}/{dailyTasks.length} ({dailyProgress.toFixed(0)}%)
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {dailyTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No daily habits yet. Add one above!</p>
            ) : (
              dailyTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth group"
                >
                  <Checkbox
                    checked={task.isCompleted}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <span className="text-2xl">{task.icon || "📌"}</span>
                  <div className="flex-1">
                    <p className={`font-medium ${task.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{task.category}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-smooth"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Weekly Tasks */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Weekly Tasks</CardTitle>
              <span className="text-sm text-muted-foreground">
                {weeklyCompleted}/{weeklyTasks.length} ({weeklyProgress.toFixed(0)}%)
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {weeklyTasks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No weekly tasks yet. Add one above!</p>
            ) : (
              weeklyTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth group"
                >
                  <Checkbox
                    checked={task.isCompleted}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <span className="text-2xl">{task.icon || "📌"}</span>
                  <div className="flex-1">
                    <p className={`font-medium ${task.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.name}
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-muted-foreground capitalize">{task.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(task.date), "MMM d")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-smooth"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Tasks;
