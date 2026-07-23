import { PAGES } from "@/content/pages.generated";

export default function HomePage() {
  return <div dangerouslySetInnerHTML={{ __html: PAGES.home.html }} />;
}
