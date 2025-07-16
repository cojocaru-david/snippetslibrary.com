import { Link } from 'react-router-dom';

export default function Footer({ border = false }: { border?: boolean }) {
  return (
    <footer className="bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top area: Blocks */}
        <div
          className={`grid gap-10 py-8 sm:grid-cols-12 md:py-12 ${
            border
              ? "border-t border-border [border-image:linear-gradient(to_right,transparent,var(--color-border),transparent)1]"
              : ""
          }`}
        >
          {/* 1st block */}
          <div className="space-y-2 sm:col-span-12 lg:col-span-4">
            <div>
              <img src="/favicon.svg" alt="Logo" className="h-8 w-8" />
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()}{" "}
              <a
                href="https://snippetslibrary.com/"
                className="underline hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                snippetslibrary.com
              </a>{" "}
              - All rights reserved.
            </div>
          </div>

          {/* 3rd block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-muted-foreground transition hover:text-foreground"
                  href="https://github.com/cojocaru-david/snippetslibrary.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link
                  className="text-muted-foreground transition hover:text-foreground"
                  to="/terms"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* 4th block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  className="text-muted-foreground transition hover:text-foreground"
                  href="https://github.com/cojocaru-david/snippetslibrary.com/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report a Bug
                </a>
              </li>
              <li>
                <a
                  className="text-muted-foreground transition hover:text-foreground"
                  href="https://github.com/cojocaru-david/snippetslibrary.com/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Community & Support
                </a>
              </li>
            </ul>
          </div>

          {/* 5th block */}
          <div className="space-y-2 sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h3 className="text-sm font-medium">Social</h3>
            <ul className="flex gap-1">
              <li>
                <a
                  className="flex items-center justify-center text-primary transition hover:text-primary/80"
                  href="https://github.com/cojocaru-david/snippetslibrary.com"
                  aria-label="Github"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-8 w-8 fill-current"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z"></path>
                  </svg>
                </a>
              </li>
              <a href="https://startupfa.me/s/snippets-library?utm_source=snippetslibrary.com" target="_blank"><img src="https://startupfa.me/badges/featured-badge.webp" alt="Featured on Startup Fame" width="171" height="54" /></a>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
