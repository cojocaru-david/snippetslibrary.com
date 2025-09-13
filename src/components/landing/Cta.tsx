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

      <div className="mx-auto mt-12 max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <a
            href="https://launchigniter.com/product/snippets-library?ref=badge-snippets-library"
            target="_blank"
            rel="noopener noreferrer"
            className="badge-wrapper"
            aria-label="Featured on LaunchIgniter"
          >
            <img
              src="https://launchigniter.com/api/badge/snippets-library?theme=neutral"
              alt="Featured on LaunchIgniter"
              className="h-14 w-auto object-contain"
            />
          </a>

          <a
            href="https://fazier.com"
            target="_blank"
            rel="noopener noreferrer"
            className="badge-wrapper"
            aria-label="Fazier badge"
          >
            <img
              src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=neutral"
              alt="Fazier badge"
              className="h-14 w-auto object-contain"
            />
          </a>

          <a
            href="https://www.uneed.best/tool/snippets-library"
            target="_blank"
            rel="noopener noreferrer"
            className="badge-wrapper"
            aria-label="Uneed badge"
          >
            <img
              src="https://www.uneed.best/EMBED3B.png"
              alt="Uneed Embed Badge"
              className="h-14 w-auto object-contain"
            />
          </a>

          <a
            href="https://startupfa.st/projects/snippets-library-store-organize-amp-share-code-snippets"
            target="_blank"
            rel="noopener noreferrer"
            title="Featured on Startup Fast"
            className="badge-wrapper"
            aria-label="Featured on Startup Fast"
          >
            <img
              src="https://startupfa.st/badge-light.png"
              alt="Featured on Startup Fast"
              className="h-14 w-auto object-contain"
            />
          </a>

          <a
            href="https://www.rilna.net"
            target="_blank"
            rel="noopener noreferrer"
            title="Find us on Rilna"
            className="badge-wrapper"
            aria-label="Featured on Rilna"
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-2 bg-white text-foreground border border-gray-200 rounded-md h-14"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                stroke="#7B3FF2"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="flex flex-col leading-none">
                <span className="text-[11px] font-medium uppercase tracking-wide">
                  FEATURED ON
                </span>
                <span className="text-[15px] font-bold">RILNA</span>
              </span>
            </span>
          </a>

          <a
            href="https://www.microsaasexamples.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="badge-wrapper text-sm text-foreground px-3 h-14 inline-flex items-center justify-center border border-transparent"
            aria-label="Featured on Micro SaaS Examples"
          >
            Featured On Micro SaaS Examples
          </a>

          <a
            href="https://tinylaunch.com"
            target="_blank"
            rel="noopener noreferrer"
            className="badge-wrapper"
            aria-label="TinyLaunch badge"
          >
            <img
              src="https://tinylaunch.com/tinylaunch_badge_launching_soon.svg"
              alt="TinyLaunch Badge"
              className="h-14 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
