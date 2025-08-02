"use client";
import { useEffect, useState, lazy, Suspense } from "react";
import dynamic from "next/dynamic";

import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";

import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import PageIllustration from "@/components/landing/PageIllustration";
import {
  Code,
  Filter,
  Globe,
  Search,
  Clock,
  ArrowRight,
  Server,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/explore/FeatureCard";

const Cta = lazy(() => import("@/components/landing/Cta"));

const AOSLoader = dynamic(
  () =>
    import("aos").then((AOS) => {
      const AOSComponent = () => {
        useEffect(() => {
          AOS.init({
            once: true,
            disable: "phone",
            duration: 800,
            easing: "ease-out-cubic",
            offset: 50,
          });
        }, []);
        return null;
      };
      return { default: AOSComponent };
    }),
  {
    ssr: false,
    loading: () => null,
  },
);

export default function ExplorePageClient() {
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldLoadAOS, setShouldLoadAOS] = useState(false);

  useEffect(() => {
    const loadAOS = () => {
      setShouldLoadAOS(true);
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadAOS, { timeout: 2000 });
    } else {
      setTimeout(loadAOS, 1500);
    }

    const events = ["click", "scroll", "keydown", "touchstart"];
    const onUserInteraction = () => {
      loadAOS();
      events.forEach((event) => {
        document.removeEventListener(event, onUserInteraction);
      });
    };

    events.forEach((event) => {
      document.addEventListener(event, onUserInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, onUserInteraction);
      });
    };
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await signIn("github");
    } catch {
      toast.error("Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {shouldLoadAOS && <AOSLoader />}

      <Header handleLogin={handleLogin} isLoading={isLoading} />
      <main className="grow">
        <section className="relative overflow-hidden">
          <PageIllustration />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 relative">
            <div className="pb-12 pt-32 md:pb-20">
              <div className="pb-12 text-center flex flex-col items-center gap-6">
                <h1
                  className="relative border-y text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold [border-image:linear-gradient(to_right,transparent,var(--color-border),transparent)1] text-foreground leading-tight max-w-5xl"
                  data-aos="zoom-y-out"
                  data-aos-delay={150}
                >
                  Explore Snippets
                  <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Library
                  </span>
                </h1>

                <p
                  className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
                  data-aos="fade-up"
                  data-aos-delay={250}
                >
                  Discover and explore a vast collection of code snippets
                  contributed by developers from around the world. Learn, share,
                  and grow together.
                </p>
              </div>

              <div className="container mx-auto px-4">
                <div
                  className="mb-12 space-y-6"
                  data-aos="fade-up"
                  data-aos-delay={600}
                >
                  <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
                    <div className="relative flex-1 max-w-lg group">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-hover:text-primary transition-colors" />
                      <Input
                        placeholder="Search snippets, languages, or topics..."
                        className="pl-12 h-12 text-lg bg-card/50 border-border/50 focus:border-primary/50 focus:bg-card shadow-lg backdrop-blur-sm"
                        disabled
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="lg"
                        disabled
                        className="bg-card/50 border-border/50 hover:border-primary/50 backdrop-blur-sm shadow-lg"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        disabled
                        className="bg-card/50 border-border/50 hover:border-primary/50 backdrop-blur-sm shadow-lg"
                      >
                        <Code className="w-4 h-4 mr-2" />
                        Languages
                      </Button>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-between text-sm"
                    data-aos="fade-up"
                    data-aos-delay={700}
                  >
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span>Discovering public snippets...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        0 snippets available
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-12 mb-12 text-center overflow-hidden"
                  data-aos="zoom-in"
                  data-aos-delay={400}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>

                  <div className="relative z-10">
                    <div
                      className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg"
                      data-aos="flip-up"
                      data-aos-delay={600}
                    >
                      <Code className="w-10 h-10 text-primary" />
                    </div>

                    <h2
                      className="text-3xl font-bold text-foreground mb-4"
                      data-aos="fade-up"
                      data-aos-delay={700}
                    >
                      Under Construction
                    </h2>

                    <p
                      className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed mb-6"
                      data-aos="fade-up"
                      data-aos-delay={800}
                    >
                      We&apos;re working on this page to bring you an even
                      better experience for exploring code snippets. Stay tuned
                      for updates!
                    </p>

                    <div
                      className="flex items-center justify-center gap-4 text-sm text-muted-foreground"
                      data-aos="fade-up"
                      data-aos-delay={900}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>In Development</span>
                      </div>
                      <div className="w-1 h-4 bg-border"></div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Coming Soon</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-20">
                  <div className="text-center mb-16">
                    <h3
                      className="text-3xl font-bold text-foreground mb-4"
                      data-aos="fade-up"
                      data-aos-delay={200}
                    >
                      What to Expect
                    </h3>
                    <p
                      className="text-muted-foreground text-lg max-w-2xl mx-auto"
                      data-aos="fade-up"
                      data-aos-delay={300}
                    >
                      Revolutionary features designed to enhance your coding
                      journey
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <FeatureCard
                      icon={Server}
                      title="AI-Features"
                      description="Advanced AI-powered helpers to find, suggest, and enhance code snippets based on your needs."
                      delay={400}
                    />
                    <FeatureCard
                      icon={Filter}
                      title="Smart Filtering"
                      description="Advanced filters by complexity, performance, security level, and community ratings to find the perfect snippet for your needs."
                      delay={500}
                    />
                    <FeatureCard
                      icon={Globe}
                      title="Global Community"
                      description="Connect with developers worldwide, share knowledge, and contribute to a growing ecosystem of high-quality code snippets."
                      delay={600}
                    />
                  </div>

                  <div
                    className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-muted/10 to-muted/5 border border-muted/20"
                    data-aos="fade-up"
                    data-aos-delay={700}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-semibold text-foreground mb-2">
                          Ready to explore?
                        </h4>
                        <p className="text-muted-foreground">
                          Join the community of developers and start sharing
                          your snippets today!
                        </p>
                      </div>
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 shadow-lg group"
                        onClick={handleLogin}
                        disabled={isLoading}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Suspense
          fallback={
            <div className="w-full flex items-center justify-center py-12">
              <Skeleton className="w-[35rem] h-50 rounded-xl" />
            </div>
          }
        >
          <Cta handleLogin={handleLogin} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
