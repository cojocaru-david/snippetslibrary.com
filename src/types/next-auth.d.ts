import "next-auth";
import "next-auth/jwt";
import { UserSettings } from "@/db/schema";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      settings?: UserSettings;
    };
  }

  interface User {
    id: string;
    settings?: UserSettings;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    provider?: string;
    id?: string;
  }
}
