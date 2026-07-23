import { PAGES } from "@/content/pages.generated";

export default function NotFound() {
  return <div dangerouslySetInnerHTML={{ __html: PAGES.notfound.html }} />;
}
