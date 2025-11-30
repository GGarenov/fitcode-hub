import { NavLink } from "@/components/NavLink";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Dumbbell, 
  Code2, 
  Trophy, 
  ImageIcon, 
  Settings 
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/fitness", label: "Fitness", icon: Dumbbell },
  { to: "/coding", label: "Coding", icon: Code2 },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/vision", label: "Vision Board", icon: ImageIcon },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card shadow-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
          FitCode Tracker
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            activeClassName="bg-primary/10 text-primary font-medium"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
