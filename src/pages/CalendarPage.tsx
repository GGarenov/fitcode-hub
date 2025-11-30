import { Layout } from "@/components/Layout";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, startOfWeek, endOfWeek } from "date-fns";

const CalendarPage = () => {
  const tasks = useAppStore((state) => state.tasks);
  const fitnessEntries = useAppStore((state) => state.fitnessEntries);
  const codingEntries = useAppStore((state) => state.codingEntries);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getDayData = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    
    const dayTasks = tasks.filter((task) => {
      const taskDate = format(parseISO(task.date), "yyyy-MM-dd");
      return taskDate === dateStr;
    });
    
    const dayFitness = fitnessEntries.filter((entry) => {
      const entryDate = format(parseISO(entry.date), "yyyy-MM-dd");
      return entryDate === dateStr;
    });
    
    const dayCoding = codingEntries.filter((entry) => {
      const entryDate = format(parseISO(entry.date), "yyyy-MM-dd");
      return entryDate === dateStr;
    });

    const completedTasks = dayTasks.filter((t) => t.isCompleted).length;
    const hasStreak = dayTasks.length > 0 && completedTasks === dayTasks.length;

    return {
      tasks: dayTasks,
      fitness: dayFitness,
      coding: dayCoding,
      completedTasks,
      totalTasks: dayTasks.length,
      hasStreak,
    };
  };

  const selectedDayData = selectedDate ? getDayData(selectedDate) : null;

  return (
    <Layout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">Track your progress day by day</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">{format(currentDate, "MMMM yyyy")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-medium text-sm text-muted-foreground py-2">
                    {day}
                  </div>
                ))}

                {calendarDays.map((day) => {
                  const dayData = getDayData(day);
                  const isCurrentMonth = format(day, "M") === format(currentDate, "M");
                  const isToday = isSameDay(day, new Date());
                  const isSelected = selectedDate && isSameDay(day, selectedDate);

                  return (
                    <button
                      key={day.toString()}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        aspect-square p-2 rounded-lg border transition-smooth
                        ${isCurrentMonth ? "border-border" : "border-transparent"}
                        ${isToday ? "ring-2 ring-primary" : ""}
                        ${isSelected ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}
                        ${!isCurrentMonth ? "opacity-40" : ""}
                      `}
                    >
                      <div className="text-sm font-medium">{format(day, "d")}</div>
                      <div className="flex gap-1 justify-center mt-1">
                        {dayData.fitness.length > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        )}
                        {dayData.coding.length > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                        {dayData.hasStreak && (
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4 mt-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span>Fitness</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Coding</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span>All Complete</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Day Details */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select a day"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDayData ? (
                <div className="space-y-4">
                  {selectedDayData.tasks.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Tasks</h4>
                      <div className="space-y-2">
                        {selectedDayData.tasks.map((task) => (
                          <div key={task.id} className="flex items-center gap-2 text-sm">
                            {task.isCompleted ? (
                              <span className="text-accent">✓</span>
                            ) : (
                              <span className="text-muted-foreground">○</span>
                            )}
                            <span className={task.isCompleted ? "text-muted-foreground line-through" : "text-foreground"}>
                              {task.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDayData.fitness.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Fitness</h4>
                      <div className="space-y-2">
                        {selectedDayData.fitness.map((entry) => (
                          <Badge key={entry.id} variant="secondary" className="mr-2">
                            {entry.type}
                            {entry.duration && ` - ${entry.duration}min`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDayData.coding.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Coding</h4>
                      <div className="space-y-2">
                        {selectedDayData.coding.map((entry) => (
                          <div key={entry.id} className="text-sm">
                            <span className="text-foreground">{entry.task}</span>
                            <span className="text-muted-foreground"> - {entry.hours}h</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDayData.tasks.length === 0 &&
                    selectedDayData.fitness.length === 0 &&
                    selectedDayData.coding.length === 0 && (
                      <p className="text-sm text-muted-foreground">No activity on this day</p>
                    )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Click a day to see details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
