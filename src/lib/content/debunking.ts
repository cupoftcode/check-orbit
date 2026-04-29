import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "debunking");

export type DebunkingFrontmatter = {
  title: string;
  description: string;
  myth: string;
  publishedAt: string; // ISO 8601
  updatedAt?: string;
  relatedChecks?: { medication: string; country: string; label: string }[];
};

export type DebunkingArticle = {
  slug: string;
  frontmatter: DebunkingFrontmatter;
  content: string;
};

export function getDebunkingSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getDebunkingArticle(
  slug: string
): DebunkingArticle | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as DebunkingFrontmatter,
    content,
  };
}

export function getAllDebunkingArticles(): DebunkingArticle[] {
  return getDebunkingSlugs()
    .map(getDebunkingArticle)
    .filter((a): a is DebunkingArticle => a !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime()
    );
}
