import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import Logo from "./logo";

export default function Header({
  handleLogin,
  isLoading,
}: {
  handleLogin: () => Promise<void>;
  isLoading: boolean;
}) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleButtonClick = () => {
    if (isAuthenticated && user) {
      router.push("/dashboard");
    } else {
      handleLogin();
    }
  };

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-background/20 px-3 backdrop-blur-lg before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] border border-border/30 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
          <Logo />

          <ul className="flex flex-1 items-center justify-end gap-3">
            <li>
              <ThemeToggle />
            </li>
            <li className="flex items-center gap-2">
              {isAuthenticated && user && (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.image || undefined}
                    alt={user?.name || ""}
                  />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <Button
                className="btn-sm bg-primary text-primary-foreground shadow-sm hover:bg-primary/80 text-xs sm:text-sm px-3 sm:px-4"
                onClick={handleButtonClick}
                disabled={isLoading}
              >
                {isLoading
                  ? "Loading..."
                  : isAuthenticated
                    ? "Go to Dashboard"
                    : "Get Started"}
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
