import { Layout } from "@/components/Layout";
import { useAppStore } from "@/store/useAppStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Trash2, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Settings = () => {
  const resetAllData = useAppStore((state) => state.resetAllData);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
    setIsDarkMode(!isDarkMode);
    toast.success(`Switched to ${isDarkMode ? "light" : "dark"} mode`);
  };

  const handleReset = () => {
    resetAllData();
    toast.success("All data has been reset");
  };

  return (
    <Layout>
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-muted-foreground" />
          <div>
            <h1 className="text-4xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your app preferences</p>
          </div>
        </div>

        {/* Appearance */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-secondary" />
                )}
                <div>
                  <Label htmlFor="theme-toggle" className="text-base font-medium">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
              </div>
              <Switch
                id="theme-toggle"
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Data Management</CardTitle>
            <CardDescription>Control your app data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <h4 className="font-medium text-foreground mb-1">Local Storage</h4>
              <p className="text-sm text-muted-foreground">
                All your data is stored locally in your browser. It will persist between sessions
                unless you clear your browser data or reset the app.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your tasks,
                    fitness entries, coding sessions, achievements, and vision board cards.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                    Yes, reset everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">FitCode Tracker</span> is your
              personal productivity companion for tracking fitness, coding progress, and achieving
              your goals.
            </p>
            <p>Built with React, TypeScript, and Tailwind CSS.</p>
            <p>Version 1.0.0</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
