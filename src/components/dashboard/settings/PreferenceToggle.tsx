import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const PreferenceToggle = ({
  title,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <motion.div
    whileHover={{ x: 2 }}
    className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50 hover:border-border transition-all duration-300 group"
  >
    <div className="flex items-start gap-3 flex-1">
      {Icon && (
        <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div className="space-y-1">
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </div>
      </div>
    </div>
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <motion.span
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="inline-block h-4 w-4 transform rounded-full bg-background shadow-lg"
      />
    </motion.button>
  </motion.div>
);

export default PreferenceToggle;
