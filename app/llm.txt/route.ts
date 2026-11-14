// Some tools ask for /llm.txt (singular); send them to the standard /llms.txt.
import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  return Response.redirect(site.url + "/llms.txt", 301);
}
