export default function Features() {
  return (
    <section className="relative before:absolute before:inset-0 before:-z-20 before:bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-3xl pb-12 md:pb-16 lg:pb-20 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground md:text-4xl font-sans leading-tight">
              Store, organize, and share your code snippets with ease
            </h2>
          </div>
          <div className="grid overflow-hidden grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-0 md:*:relative md:*:p-6 lg:*:p-10 md:*:before:absolute md:*:before:bg-muted md:*:before:[block-size:100vh] md:*:before:[inline-size:1px] md:*:before:[inset-block-start:0] md:*:before:[inset-inline-start:-1px] md:*:after:absolute md:*:after:bg-muted md:*:after:[block-size:1px] md:*:after:[inline-size:100vw] md:*:after:[inset-block-start:-1px] md:*:after:[inset-inline-start:0]">
            <article className="p-6 bg-card rounded-lg border md:bg-transparent md:border-none md:rounded-none">
              <h3 className="mb-3 flex items-center space-x-2 font-medium text-foreground">
                <svg
                  className="fill-primary flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                >
                  <path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Zm2-4a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4Zm1 10a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H5Z" />
                </svg>
                <span>Smart Code Storage</span>
              </h3>
              <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                Save code snippets with intelligent language detection and
                organize them by language, tags, and visibility.
              </p>
            </article>
            <article className="p-6 bg-card rounded-lg border md:bg-transparent md:border-none md:rounded-none">
              <h3 className="mb-3 flex items-center space-x-2 font-medium text-foreground">
                <svg
                  className="fill-primary flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                >
                  <path d="M14.29 2.614a1 1 0 0 0-1.58-1.228L6.407 9.492l-3.199-3.2a1 1 0 1 0-1.414 1.415l4 4a1 1 0 0 0 1.496-.093l7-9ZM1 14a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2H1Z" />
                </svg>
                <span>Syntax Highlighting</span>
              </h3>
              <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                Beautiful syntax highlighting for 50+ programming languages,
                with multiple light and dark themes.
              </p>
            </article>
            <article className="p-6 bg-card rounded-lg border md:bg-transparent md:border-none md:rounded-none">
              <h3 className="mb-3 flex items-center space-x-2 font-medium text-foreground">
                <svg
                  className="fill-primary flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                >
                  <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm1.715-6.752a1 1 0 0 1 .57-1.916 8.014 8.014 0 0 1 5.383 5.383 1 1 0 1 1-1.916.57 6.014 6.014 0 0 0-4.037-4.037Zm4.037 7.467a1 1 0 1 1 1.916.57 8.014 8.014 0 0 1-5.383 5.383 1 1 0 1 1-.57-1.916 6.014 6.014 0 0 0 4.037-4.037Zm-7.467 4.037a1 1 0 1 1-.57 1.916 8.014 8.014 0 0 1-5.383-5.383 1 1 0 1 1 1.916-.57 6.014 6.014 0 0 0 4.037 4.037Z" />
                </svg>
                <span>Instant Search</span>
              </h3>
              <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                Find your snippets instantly by title, description, or content.
                Filter by language, visibility, and date.
              </p>
            </article>
            <article className="p-6 bg-card rounded-lg border md:bg-transparent md:border-none md:rounded-none">
              <h3 className="mb-3 flex items-center space-x-2 font-medium text-foreground">
                <svg
                  className="fill-primary flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                >
                  <path d="M8 0a1 1 0 0 1 1 1v14a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1Zm6 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1a1 1 0 1 1 0 2h-1a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h1a1 1 0 1 1 0 2h-1ZM1 1a1 1 0 0 0 0 2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 1 0 0 2h1a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H1Z" />
                </svg>
                <span>Shareable Links</span>
              </h3>
              <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                Generate public share links for your snippets, or keep them
                private. Share with anyone, anywhere.
              </p>
            </article>
            <article className="p-6 bg-card rounded-lg border md:bg-transparent md:border-none md:rounded-none">
              <h3 className="mb-3 flex items-center space-x-2 font-medium text-foreground">
                <svg
                  className="fill-primary flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                >
                  <path d="M10.284.33a1 1 0 1 0-.574 1.917 6.049 6.049 0 0 1 2.417 1.395A1 1 0 0 0 13.5 2.188 8.034 8.034 0 0 0 10.284.33ZM6.288 2.248A1 1 0 0 0 5.718.33 8.036 8.036 0 0 0 2.5 2.187a1 1 0 0 0 1.372 1.455 6.036 6.036 0 0 1 2.415-1.395ZM1.42 5.401a1 1 0 0 1 .742 1.204 6.025 6.025 0 0 0 0 2.79 1 1 0 0 1-1.946.462 8.026 8.026 0 0 1 0-3.714A1 1 0 0 1 1.421 5.4Zm2.452 6.957A1 1 0 0 0 2.5 13.812a8.036 8.036 0 0 0 3.216 1.857 1 1 0 0 0 .574-1.916 6.044 6.044 0 0 1-2.417-1.395Zm9.668.04a1 1 0 0 1-.041 1.414 8.033 8.033 0 0 1-3.217 1.857 1 1 0 1 1-.571-1.917 6.035 6.035 0 0 0 2.415-1.395 1 1 0 0 1 1.414.042Zm2.242-6.255a1 1 0 1 0-1.946.462 6.03 6.03 0 0 1 0 2.79 1 1 0 1 0 1.946.462 8.022 8.022 0 0 0 0-3.714Z" />
                </svg>
                <span>Copy to Clipboard</span>
              </h3>
              <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                One-click code copying with visual feedback. Copy and paste your
                code anywhere, instantly.
              </p>
            </article>
            <article className="p-6 bg-card rounded-lg border md:bg-transparent md:border-none md:rounded-none">
              <h3 className="mb-3 flex items-center space-x-2 font-medium text-foreground">
                <svg
                  className="fill-primary flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                >
                  <path d="M9 1a1 1 0 1 0-2 0v6a1 1 0 0 0 2 0V1ZM4.572 3.08a1 1 0 0 0-1.144-1.64A7.987 7.987 0 0 0 0 8a8 8 0 0 0 16 0c0-2.72-1.36-5.117-3.428-6.56a1 1 0 1 0-1.144 1.64A5.987 5.987 0 0 1 14 8 6 6 0 1 1 2 8a5.987 5.987 0 0 1 2.572-4.92Z" />
                </svg>
                <span>Open Source & Free</span>
              </h3>
              <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                100% open source. Contribute on{" "}
                <a
                  href="https://github.com/cojocaru-david/snippetslibrary.com"
                  className="underline hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>{" "}
                or use it for free at{" "}
                <a
                  href="https://snippetslibrary.com/"
                  className="underline hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  snippetslibrary.com
                </a>
                .
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
