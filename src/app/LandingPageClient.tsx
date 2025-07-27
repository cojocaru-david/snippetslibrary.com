"use client";
import { useEffect, useState, lazy, Suspense } from "react";
import dynamic from "next/dynamic";

import Header from "@/components/custom/header";
import Footer from "@/components/custom/footer";
import Hero from "@/components/landing/Hero";

import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const Features = lazy(() => import("@/components/landing/Features"));
const Cta = lazy(() => import("@/components/landing/Cta"));

const AOSLoader = dynamic(
  () =>
    import("aos").then((AOS) => {
      const AOSComponent = () => {
        useEffect(() => {
          AOS.init({
            once: true,
            disable: "phone",
            duration: 700,
            easing: "ease-out-cubic",
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

const SectionLoading = () => (
  <div className="py-20">
    <div className="container mx-auto px-4">
      <div className="animate-pulse space-y-6">
        <div className="h-12 bg-muted/50 rounded-lg mx-auto max-w-md"></div>
        <div className="h-6 bg-muted/30 rounded mx-auto max-w-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-muted/20 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function LandingPageClient() {
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
    } catch (error) {
      toast.error("Failed to login. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {shouldLoadAOS && <AOSLoader />}

      <Header handleLogin={handleLogin} isLoading={isLoading} />
      <main className="grow">
        <Hero handleLogin={handleLogin} />

        <Suspense fallback={<SectionLoading />}>
          <Features />
        </Suspense>

        <Suspense fallback={<SectionLoading />}>
          <Cta handleLogin={handleLogin} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
