import type { Metadata } from "next";
import { PAGES } from "@/content/pages.generated";

export const metadata: Metadata = {
  title: { absolute: PAGES.about.title },
  description: PAGES.about.description,
};

export default function AboutPage() {
  return <div dangerouslySetInnerHTML={{ __html: PAGES.about.html }} />;
}
