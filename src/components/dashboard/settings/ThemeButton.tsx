import { memo } from "react";
import { Sun, Check } from "lucide-react";

const ThemeButton = memo<{
  value: "light" | "dark" | "auto";
  label: string;
  icon: typeof Sun;
  selected: boolean;
  onClick: () => void;
}>(function ThemeButton({ label, icon: Icon, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-1.5 rounded-xl border transition-all px-4 py-3
        backdrop-blur-sm
        ${
          selected
            ? "border-primary bg-primary/10 shadow-sm"
            : "border-border hover:border-primary/40 hover:bg-muted/30"
        } focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60`}
    >
      <Icon
        className={`w-5 h-5 transition-transform ${
          selected ? "scale-110 text-primary" : "text-muted-foreground"
        }`}
      />
      <span
        className={`text-xs font-medium transition-colors ${
          selected ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>

      {selected && (
        <Check className="absolute top-2 right-2 w-4 h-4 text-primary/90 animate-in fade-in" />
      )}
    </button>
  );
});

export default ThemeButton;
