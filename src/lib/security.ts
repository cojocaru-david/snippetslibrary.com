import { createHash } from "crypto";
import { customAlphabet } from "nanoid";

export function hashIP(ip: string): string {
  if (!ip || ip === "unknown") {
    return "unknown";
  }

  const salt = process.env.IP_HASH_SALT || "default-salt-change-in-production";

  let processedIP = ip;
  if (ip.includes(".") && !ip.includes(":")) {

    const parts = ip.split(".");
    if (parts.length === 4) {
      processedIP = `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }

  return createHash("sha256")
    .update(`${processedIP}:${salt}`)
    .digest("hex")
    .substring(0, 16); 
}

const SHARE_ID_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const SHARE_ID_LENGTH = 24;

export function generateSecureShareId(): string {
  const nanoid = customAlphabet(SHARE_ID_ALPHABET, SHARE_ID_LENGTH);
  return nanoid();
}

export function isValidShareId(shareId: string): boolean {
  if (!shareId || typeof shareId !== 'string') {
    return false;
  }

  if (shareId.length !== SHARE_ID_LENGTH) {
    return false;
  }

  return shareId.split('').every(char => SHARE_ID_ALPHABET.includes(char));
}

export function getClientIP(request: {
  headers: { get: (key: string) => string | null };
}): string {

  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwardedFor) {
    const ips = forwardedFor.split(",");
    const firstIP = ips[0]?.trim();
    if (firstIP && firstIP !== "unknown") {
      return firstIP;
    }
  }

  if (cfConnectingIP && cfConnectingIP !== "unknown") {
    return cfConnectingIP;
  }

  if (realIP && realIP !== "unknown") {
    return realIP;
  }

  return "unknown";
}