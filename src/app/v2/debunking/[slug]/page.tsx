import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getDebunkingArticle,
  getDebunkingSlugs,
} from "@/lib/content/debunking";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://checkorbit.com";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getDebunkingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getDebunkingArticle(slug);
  if (!article) return { title: "Not Found — Check Orbit" };

  const { title, description } = article.frontmatter;
  const canonicalUrl = `${BASE_URL}/debunking/${slug}`;

  return {
    title: `${title} | Check Orbit`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Check Orbit",
      type: "article",
      publishedTime: article.frontmatter.publishedAt,
      ...(article.frontmatter.updatedAt && {
        modifiedTime: article.frontmatter.updatedAt,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function DebunkingPage({ params }: Props) {
  const { slug } = await params;
  const article = getDebunkingArticle(slug);
  if (!article) notFound();

  const { frontmatter, content } = article;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.publishedAt,
    ...(frontmatter.updatedAt && { dateModified: frontmatter.updatedAt }),
    url: `${BASE_URL}/debunking/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "Check Orbit",
      url: BASE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        <article>
          <header className="mb-8">
            <p className="font-display font-bold text-[11px] tracking-[0.12em] uppercase text-brand mb-2.5">
              Myth vs. Reality
            </p>
            <h1 className="font-display font-black tracking-tighter text-ink leading-[1.1] mb-3.5" style={{ fontSize: "clamp(24px, 4vw, 34px)" }}>
              {frontmatter.title}
            </h1>
            <blockquote className="border-l-4 border-premium pl-4 italic text-ink-3 text-[14px]">
              &ldquo;{frontmatter.myth}&rdquo;
            </blockquote>
            <time
              dateTime={frontmatter.publishedAt}
              className="block mt-3 text-[12px] text-ink-4"
            >
              Published{" "}
              {new Date(frontmatter.publishedAt + "T00:00:00").toLocaleDateString(
                "en-US",
                { month: "long", day: "numeric", year: "numeric" }
              )}
            </time>
          </header>

          <div className="prose prose-slate prose-sm max-w-none">
            <MDXRemote source={content} />
          </div>

          {frontmatter.relatedChecks && frontmatter.relatedChecks.length > 0 && (
            <nav className="mt-10 bg-cream-2 border border-rule rounded-[18px] p-6">
              <h2 className="font-display font-extrabold text-[15px] text-ink mb-3">
                Check your medications
              </h2>
              <ul className="space-y-2">
                {frontmatter.relatedChecks.map((check) => (
                  <li key={`${check.medication}-${check.country}`}>
                    <Link
                      href={`/v2/check/${check.medication}/${check.country}`}
                      className="text-[14px] text-trust underline"
                    >
                      {check.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </article>
      </main>
    </>
  );
}
