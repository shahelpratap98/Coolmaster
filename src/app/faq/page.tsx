import type { Metadata } from "next";
import { PAGES } from "@/content/pages.generated";

export const metadata: Metadata = {
  title: { absolute: PAGES.faq.title },
  description: PAGES.faq.description,
};

export default function FaqPage() {
  return <div dangerouslySetInnerHTML={{ __html: PAGES.faq.html }} />;
}
