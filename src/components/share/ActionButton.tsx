import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const ActionButton = ({
  onClick,
  disabled,
  loading,
  variant = "outline",
  size = "sm",
  icon,
  children,
  className,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) => (
  <Button
    onClick={onClick}
    disabled={disabled || loading}
    variant={variant}
    size={size}
    className={cn(
      "h-9 px-4 gap-2 font-medium transition-all duration-200 hover:scale-105 active:scale-95",
      loading && "animate-pulse",
      className,
    )}
  >
    {loading ? (
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    ) : (
      icon
    )}
    {children}
  </Button>
);

export { ActionButton };
