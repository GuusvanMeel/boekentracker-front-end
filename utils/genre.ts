// lib/genre.ts

/**
 * Controlled genre list used inside the app.
 * This is intentionally limited and human-friendly.
 */
export type Genre =
  | "Fantasy"
  | "Science Fiction"
  | "Romance"
  | "Thriller"
  | "Mystery"
  | "Horror"
  | "Historical Fiction"
  | "Young Adult"
  | "Children"
  | "Literary Fiction"
  | "Adventure"
  | "Crime"
  | "Non-fiction"
  | "Biography"
  | "History"
  | "Self-help"
  | "Philosophy"
  | "Psychology"
  | "Science"
  | "Technology"
  | "Business"
  | "Politics"
  | "Religion"
  | "Poetry"
  | "Comics & Graphic Novels"
  | "Art & Design"
  | "Travel"
  | "Cooking"
  | "Health"
  | "Education"
  | "Unknown";

/**
 * Keywords mapped to genres.
 * All matching is case-insensitive and partial.
 */
const GENRE_KEYWORDS: Record<Genre, string[]> = {
  Fantasy: [
    "fantasy",
    "magic",
    "wizard",
    "sorcery",
    "dragon",
    "mythical",
    "epic fantasy",
    "high fantasy",
  ],

  "Science Fiction": [
    "science fiction",
    "sci-fi",
    "sf",
    "space",
    "dystopia",
    "utopia",
    "time travel",
    "cyberpunk",
    "post-apocalyptic",
  ],

  Romance: [
    "romance",
    "love",
    "love story",
    "romantic fiction",
    "relationships",
  ],

  Thriller: [
    "thriller",
    "suspense",
    "psychological thriller",
    "political thriller",
    "legal thriller",
  ],

  Mystery: [
    "mystery",
    "detective",
    "whodunit",
    "crime mystery",
    "investigation",
  ],

  Horror: [
    "horror",
    "ghost",
    "supernatural",
    "paranormal",
    "gothic",
    "vampire",
    "zombie",
  ],

  "Historical Fiction": [
    "historical fiction",
    "historical novel",
    "period fiction",
  ],

  "Young Adult": [
    "young adult",
    "ya fiction",
    "teen fiction",
    "coming of age",
  ],

  Children: [
    "children",
    "children's fiction",
    "kids",
    "picture book",
    "juvenile fiction",
  ],

  "Literary Fiction": [
    "literary fiction",
    "contemporary fiction",
    "modern fiction",
    "classic fiction",
  ],

  Adventure: [
    "adventure",
    "exploration",
    "survival",
    "journey",
  ],

  Crime: [
    "crime",
    "true crime",
    "criminals",
    "organized crime",
  ],

  "Non-fiction": [
    "nonfiction",
    "non-fiction",
    "general nonfiction",
  ],

  Biography: [
    "biography",
    "autobiography",
    "memoir",
    "life stories",
  ],

  History: [
    "history",
    "historical",
    "world history",
    "military history",
  ],

  "Self-help": [
    "self-help",
    "personal development",
    "self improvement",
    "motivation",
  ],

  Philosophy: [
    "philosophy",
    "ethics",
    "metaphysics",
    "epistemology",
  ],

  Psychology: [
    "psychology",
    "mental health",
    "behavior",
    "cognitive",
  ],

  Science: [
    "science",
    "physics",
    "biology",
    "chemistry",
    "astronomy",
  ],

  Technology: [
    "technology",
    "computer science",
    "programming",
    "software",
    "internet",
  ],

  Business: [
    "business",
    "management",
    "entrepreneurship",
    "economics",
    "finance",
  ],

  Politics: [
    "politics",
    "political science",
    "government",
    "public policy",
  ],

  Religion: [
    "religion",
    "theology",
    "spirituality",
    "christianity",
    "islam",
    "buddhism",
  ],

  Poetry: [
    "poetry",
    "poems",
    "verse",
  ],

  "Comics & Graphic Novels": [
    "comics",
    "graphic novel",
    "manga",
    "comic books",
  ],

  "Art & Design": [
    "art",
    "design",
    "graphic design",
    "architecture",
  ],

  Travel: [
    "travel",
    "travel writing",
    "guidebook",
  ],

  Cooking: [
    "cooking",
    "cookbook",
    "recipes",
    "food",
  ],

  Health: [
    "health",
    "medicine",
    "wellness",
    "fitness",
  ],

  Education: [
    "education",
    "teaching",
    "learning",
    "pedagogy",
  ],

  Unknown: [],
};

/**
 * Derives a single genre from Open Library subjects.
 * Returns the first matching genre based on priority order.
 */
export function getTopGenresFromSubjects(
  subjects?: string[],
  limit: number = 2
): Genre[] {
  if (!subjects || subjects.length === 0) return ["Unknown"];

  const normalizedSubjects = subjects.map(s => s.toLowerCase());

  const scores: Partial<Record<Genre, number>> = {};

  for (const [genreKey, keywords] of Object.entries(GENRE_KEYWORDS)) {
    const genre = genreKey as Genre;
    if (genre === "Unknown") continue;

    let hits = 0;

    // Count "genre hits" per subject (max 1 per subject)
    // This avoids a single subject giving 10 hits because it matches many keywords.
    for (const subject of normalizedSubjects) {
      if (keywords.some(k => subject.includes(k))) {
        hits += 1;
      }
    }

    if (hits > 0) scores[genre] = hits;
  }

  const entries = Object.entries(scores) as Array<[Genre, number]>;
  if (entries.length === 0) return ["Unknown"];

  entries.sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0]);
  });

  return entries.slice(0, limit).map(([genre]) => genre);
}
