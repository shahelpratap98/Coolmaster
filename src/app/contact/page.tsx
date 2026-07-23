import type { Metadata } from "next";
import { PAGES } from "@/content/pages.generated";
import { ContactFormScript } from "@/components/ContactFormScript";

export const metadata: Metadata = {
  title: { absolute: PAGES.contact.title },
  description: PAGES.contact.description,
};

export default function ContactPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: PAGES.contact.html }} />
      <ContactFormScript />
    </>
  );
}
