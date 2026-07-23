import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PAGES, SERVICE_SLUGS } from "@/content/pages.generated";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return {};
  return { title: { absolute: page.title }, description: page.description };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page || !(SERVICE_SLUGS as readonly string[]).includes(slug)) notFound();
  return <div dangerouslySetInnerHTML={{ __html: page.html }} />;
}
