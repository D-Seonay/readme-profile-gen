import { serializeJsonLd } from '@/lib/structuredData';

type Node = Record<string, unknown>;

/** Structured data for search engines and AI crawlers, rendered in the server HTML. */
export function JsonLd({ data }: { data: Node | Node[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
