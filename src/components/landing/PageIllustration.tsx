import Stripes from "@/assets/images/stripes.svg";
import Image from "next/image";

export default function PageIllustration() {
  return (
    <>
      {/* Centered decorative stripes - constrained to viewport to avoid overflow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform w-[90vw] max-w-[900px]"
        aria-hidden="true"
      >
        <Image
          className="max-w-none select-none mix-blend-luminosity opacity-1"
          width={900}
          height={900}
          src={Stripes}
          alt="Decorative stripes pattern"
          priority
          style={{
            width: "100%",
            height: "auto",
          }}
        />
      </div>

      {/* Use percentages for off-center glows so they scale on small screens */}
      <div
        className="pointer-events-none absolute -top-32 left-[70%] -translate-x-1/2"
        aria-hidden="true"
      >
        <div
          className="h-72 w-72 sm:h-80 sm:w-80 rounded-full opacity-50 blur-[160px]"
          style={{
            background:
              "radial-gradient(circle at 60% 40%, var(--color-primary), transparent 70%)",
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute left-[82%] top-[420px] -translate-x-1/2"
        aria-hidden="true"
      >
        <div
          className="h-72 w-72 sm:h-80 sm:w-80 rounded-full opacity-50 blur-[160px]"
          style={{
            background:
              "radial-gradient(circle at 60% 40%, var(--color-primary), var(--color-background) 80%)",
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute left-[18%] top-[640px] -translate-x-1/2"
        aria-hidden="true"
      >
        <div
          className="h-72 w-72 sm:h-80 sm:w-80 rounded-full opacity-50 blur-[160px]"
          style={{
            background:
              "radial-gradient(circle at 60% 40%, var(--color-primary), var(--color-background) 80%)",
          }}
        />
      </div>
    </>
  );
}
