import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Cta({
  handleLogin,
}: {
  handleLogin: () => Promise<void>;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const handleButtonClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      handleLogin();
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-2xl text-center shadow-xl before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-background"
          data-aos="zoom-y-out"
        >
          {/* Glow */}
          <div
            className="absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 translate-y-1/2"
            aria-hidden="true"
          >
            <div
              className="h-56 w-[480px] rounded-full border-[20px] blur-3xl"
              style={{
                borderColor: "var(--primary)",
              }}
            />
          </div>
          <div className="px-4 py-12 md:px-12 md:py-20">
            <h2
              className="mb-6 border-y text-2xl sm:text-3xl font-bold text-foreground [border-image:linear-gradient(to_right,transparent,var(--border),transparent)1] md:mb-12 md:text-4xl leading-tight"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Start using Snippets Library today
            </h2>
            <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
              <Button
                className="btn group mb-4 w-full bg-primary bg-gradient-to-t from-primary to-primary/80 text-primary-foreground shadow-sm hover:bg-primary/90 sm:mb-0 sm:w-auto px-6 py-3 text-sm sm:text-base"
                onClick={handleButtonClick}
                disabled={false}
              >
                <span className="relative inline-flex items-center">
                  {user ? "Go to Dashboard" : "Try it now"}
                  <span className="ml-1 tracking-normal text-primary-foreground/70 transition-transform group-hover:translate-x-0.5">
                    -&gt;
                  </span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
