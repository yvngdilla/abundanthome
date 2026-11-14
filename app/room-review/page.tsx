import type { Metadata } from "next";
import { ProductPage } from "@/components/ProductPage";
import { formatPrice, products } from "@/lib/shop";

const p = products["room-review"];
const title = `Virtual Room Review With an Interior Designer (${formatPrice(p.price)})`;

export const metadata: Metadata = {
  title,
  description: "Send interior designer Nancy Swanton photos of one room and what you want it to support. Get a written plan for what to move, change and add.",
  alternates: { canonical: "/room-review" },
  openGraph: { title, description: p.short, url: "/room-review" },
};

const faqs = [
  { q: "What do I need to send?", a: "Four to six daylight photos of the room, a rough floor plan with measurements (a sketch on paper is perfect), and a sentence or two about what you want the room to support in your life. After checkout, Nancy emails you exactly what to send." },
  { q: "Does it work in a rental?", a: "Yes. Tell Nancy what you cannot change, like a wall color or flooring, and the plan works around it." },
  { q: "Is this a video call?", a: "No. It is a written plan you can keep and work through at your own pace, plus one round of follow-up questions by email." },
  { q: "Can I review more than one room?", a: "Each review covers one room. Book a second review for another room." },
];

export default function Page() {
  return (
    <ProductPage product={p} path="/room-review" faqs={faqs}>
      <h2>What you get back</h2>
      <p>
        A written plan for your room, in the order that makes the biggest difference first: what to move, what to
        change, what to add and why. Every suggestion comes with the reason behind it, so you can make the next room on
        your own.
      </p>
    </ProductPage>
  );
}
