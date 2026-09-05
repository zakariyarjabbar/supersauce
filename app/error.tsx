"use client";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="container empty-state error-page">
      <h1>صار خلل بسيط.</h1>
      <p>جرّب مرة ثانية، ونرجع نكمّل السالفة.</p>
      <button className="button button-red" onClick={reset}>
        حاول ثانية <RefreshCw size={19} />
      </button>
      <Link className="text-link" href="/">
        ارجع للرئيسية
      </Link>
    </section>
  );
}
