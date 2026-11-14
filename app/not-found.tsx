import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero">
      <div className="wrap prose">
        <p className="eyebrow">Page not found</p>
        <h1>This room is empty</h1>
        <p className="lede" style={{ marginTop: 16 }}>The page you were looking for has moved or never existed.</p>
        <div className="btn-row"><Link className="btn" href="/">Go to the home page</Link></div>
      </div>
    </section>
  );
}
