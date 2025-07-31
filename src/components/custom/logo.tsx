import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/favicon.svg"
        alt="Logo"
        className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
        width={32}
        height={32}
      />
      <div className="flex flex-col gap-0 space-y-0 ml-2 min-w-0">
        <span className="text-base sm:text-lg font-semibold text-foreground m-0 p-0 truncate">
          Snippets Library
        </span>
        <p className="text-xs sm:text-sm text-muted-foreground hidden lg:block m-0 p-0 truncate">
          Store, organize, and share your code snippets with ease
        </p>
      </div>
    </Link>
  );
}
