import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ThemeButton = ({
  value,
  label,
  icon: Icon,
  selected,
  onClick,
}: {
  value: "light" | "dark" | "auto";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  selected: boolean;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "relative group p-4 rounded-xl border-2 transition-all duration-300 text-left",
      "hover:shadow-lg hover:shadow-primary/10",
      selected
        ? "border-primary bg-primary/5 shadow-md shadow-primary/20"
        : "border-border hover:border-primary/50 bg-card/50",
    )}
  >
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "p-2 rounded-lg transition-colors",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-muted group-hover:bg-primary/10",
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">
          {value === "auto" && "Follow system"}
          {value === "light" && "Always light"}
          {value === "dark" && "Always dark"}
        </div>
      </div>
    </div>
    {selected && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
      >
        <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
      </motion.div>
    )}
  </motion.button>
);

export default ThemeButton;
