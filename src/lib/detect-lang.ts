type Language =
  | "javascript"
  | "typescript"
  | "html"
  | "php"
  | "bash"
  | "python"
  | "go"
  | "rust"
  | "java"
  | "csharp"
  | "cpp"
  | "css"
  | "json"
  | "sql"
  | "ruby"
  | "swift"
  | "kotlin"
  | "text";

interface LanguagePattern {
  language: Language;
  signatures: RegExp[];
  validator?: (code: string) => boolean;
  priority: number; // Higher priority means checked earlier
}

const LANGUAGE_PATTERNS: LanguagePattern[] = [
  {
    language: "json",
    priority: 100,
    signatures: [/^\s*{[\s\S]*?}\s*$/, /^\s*\[[\s\S]*?]\s*$/],
    validator: (code) => {
      try {
        JSON.parse(code);
        return true;
      } catch {
        return false;
      }
    },
  },
  {
    language: "html",
    priority: 90,
    signatures: [
      /^\s*<!DOCTYPE\s+html\b/i,
      /^\s*<html\b[^>]*>/i,
      /^\s*<head\b[^>]*>/i,
      /^\s*<body\b[^>]*>/i,
      /^\s*<[a-z]+[\s>][\s\S]*<\/[a-z]+>/i,
    ],
    validator: (code) =>
      !/^\s*(?:import|export|const|let|var|function|class|interface|type)\b/.test(
        code,
      ) && /<[a-z][\s\S]*>/i.test(code),
  },
  {
    language: "typescript",
    priority: 80,
    signatures: [
      /^\s*interface\s+\w+\s*{/m,
      /^\s*type\s+\w+\s*=/m,
      /:\s*(?:string|number|boolean|void|any|unknown|null|undefined)\b[^:=>]*?[;=]/,
      /^\s*export\s+(?:type|interface|enum)\s+\w+/m,
      /^\s*declare\s+(?:function|const|let|var|module)\s+\w+/m,
    ],
    validator: (code) =>
      !/^\s*<!DOCTYPE\s+html\b/i.test(code) &&
      !/^\s*<[a-z][\s\S]*>/i.test(code) &&
      (/(?:^|\s)(?:interface|type|enum)\s+\w+/.test(code) ||
        /:\s*(?:string|number|boolean|void|any|unknown)\b/.test(code)),
  },
  {
    language: "javascript",
    priority: 70,
    signatures: [
      /^\s*(?:const|let|var)\s+\w+\s*[=;]/m,
      /^\s*function\s+\w*\s*\(/m,
      /=>\s*(?:{|\w)/,
      /^\s*console\.\w+\(/m,
      /^\s*(?:import|export)\s+[\w{*]/m,
      /^\s*<\/?script\b[^>]*>/im,
    ],
    validator: (code) =>
      !/:\s*(?:string|number|boolean|void|any|unknown)\b/.test(code) &&
      !/^\s*interface\s+\w+/m.test(code),
  },
  {
    language: "php",
    priority: 65,
    signatures: [
      /<\?php\s+[\s\S]*?\?>/,
      /^\s*function\s+\w+\s*\([^)]*\)\s*{/m,
      /\$\w+\s*=[^=]/m,
      /^\s*use\s+[\w\\]+;/m,
    ],
    validator: (code) => /<\?php[\s\S]*?\?>/.test(code),
  },
  {
    language: "python",
    priority: 60,
    signatures: [
      /^\s*def\s+\w+\s*\([^)]*\)\s*:/m,
      /^\s*class\s+\w+\s*:/m,
      /^\s*(?:from\s+\w+\s+)?import\s+\w+/m,
      /^\s*print\s*\(/m,
      /^\s*#!\/usr\/bin\/(?:env\s+)?python\d*/m,
    ],
  },
  {
    language: "bash",
    priority: 60,
    signatures: [
      /^\s*#!\/bin\/(?:ba)?sh\b/m,
      /^\s*(?:if|then|fi|for|do|done|case|esac|while|until)\b/m,
      /^\s*\w+\(\)\s*{/m,
      /^\s*\w+\s*=\s*\w+/m,
    ],
  },
  {
    language: "css",
    priority: 55,
    signatures: [
      /^\s*[\w.#][^{]*{\s*[\w-]+\s*:/m,
      /^\s*@(?:import|media|keyframes)\b/m,
    ],
    validator: (code) =>
      /[\w.#][^{]*{\s*[\w-]+\s*:[^}]*}/.test(code) &&
      !/^\s*(?:function|var|let|const|if|for|while)\b/m.test(code),
  },
  {
    language: "go",
    priority: 50,
    signatures: [
      /^\s*package\s+\w+/m,
      /^\s*func\s+\w*\s*\(/m,
      /^\s*import\s+\(?[\w"]/m,
      /^\s*(?:type|struct)\s+\w+/m,
    ],
  },
  {
    language: "rust",
    priority: 50,
    signatures: [
      /^\s*(?:pub\s+)?fn\s+\w+\s*\(/m,
      /^\s*use\s+[\w]+::/m,
      /^\s*impl\s+\w+/m,
      /^\s*let\s+(?:mut\s+)?\w+\s*=/m,
    ],
  },
  {
    language: "java",
    priority: 50,
    signatures: [
      /^\s*(?:public|private|protected)\s+class\s+\w+/m,
      /^\s*import\s+java\./m,
      /^\s*package\s+[\w.]+;/m,
      /^\s*@Override\b/m,
    ],
  },
  {
    language: "csharp",
    priority: 50,
    signatures: [
      /^\s*using\s+System(?:\.\w+)*;/m,
      /^\s*namespace\s+\w+/m,
      /^\s*(?:public|private)\s+class\s+\w+/m,
      /^\s*\[\w+\(/m,
    ],
  },
  {
    language: "cpp",
    priority: 50,
    signatures: [
      /^\s*#\s*include\s+<[\w.]+>/m,
      /^\s*(?:int|void)\s+main\s*\(/m,
      /^\s*std::\w+/m,
      /^\s*using\s+namespace\s+std;/m,
    ],
  },
  {
    language: "sql",
    priority: 45,
    signatures: [
      /^\s*(?:SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM)\s+\w+/im,
      /^\s*CREATE\s+(?:TABLE|INDEX|DATABASE)\b/im,
      /^\s*FROM\s+\w+/im,
      /^\s*WHERE\s+\w+/im,
    ],
  },
  {
    language: "ruby",
    priority: 45,
    signatures: [
      /^\s*def\s+\w+\s*(?:\([^)]*\))?\s*\n/m,
      /^\s*class\s+\w+/m,
      /^\s*require\s+['"]/m,
      /^\s*attr_(?:accessor|reader|writer)\b/m,
    ],
  },
  {
    language: "swift",
    priority: 45,
    signatures: [
      /^\s*import\s+(?:Foundation|SwiftUI|UIKit)\b/m,
      /^\s*(?:func|struct|class)\s+\w+/m,
      /^\s*var\s+\w+\s*(?::\s*\w+)?\s*\{?=/m,
      /^\s*@(?:State|Binding|ObservedObject)\b/m,
    ],
  },
  {
    language: "kotlin",
    priority: 45,
    signatures: [
      /^\s*(?:fun|val|var)\s+\w+/m,
      /^\s*(?:class|interface|object)\s+\w+/m,
      /^\s*import\s+\w+\./m,
      /^\s*data\s+class\b/m,
    ],
  },
  {
    language: "text",
    priority: 0,
    signatures: [/[\s\S]*/],
  },
];

// Sort patterns by priority (highest first)
const SORTED_LANGUAGE_PATTERNS = [...LANGUAGE_PATTERNS].sort(
  (a, b) => b.priority - a.priority,
);

// Cache for recent detections
const DETECTION_CACHE = new Map<string, Language>();
const CACHE_SIZE = 1000;

function detectLanguage(code: string | null | undefined): Language {
  // Input validation
  if (!code?.trim() || code.length < 3) {
    return "text";
  }

  // Check cache first
  const cacheKey = code.substring(0, 1000);
  if (DETECTION_CACHE.has(cacheKey)) {
    return DETECTION_CACHE.get(cacheKey)!;
  }

  // Use entire code for detection
  const sample = code.trim();

  // Check patterns in priority order
  for (const { language, signatures, validator } of SORTED_LANGUAGE_PATTERNS) {
    const hasSignature = signatures.some((pattern) => pattern.test(sample));

    if (hasSignature && (!validator || validator(sample))) {
      if (DETECTION_CACHE.size >= CACHE_SIZE) {
        DETECTION_CACHE.clear();
      }
      DETECTION_CACHE.set(cacheKey, language);
      return language;
    }
  }

  return "text";
}

export default detectLanguage;
