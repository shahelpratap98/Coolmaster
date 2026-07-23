import type { Metadata } from "next";
import { PAGES } from "@/content/pages.generated";

export const metadata: Metadata = {
  title: { absolute: PAGES.services.title },
  description: PAGES.services.description,
};

export default function ServicesPage() {
  return <div dangerouslySetInnerHTML={{ __html: PAGES.services.html }} />;
}
