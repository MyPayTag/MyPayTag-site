import Link from "next/link";

import { BackButton } from "@/components/navigation/back-button";
import { blogPosts } from "@/lib/blog-posts";

export const metadata = {
  title: "MyPayTag Blog",
  description:
    "Product notes and developer guides for identity-based crypto payment resolution.",
};

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f4] text-[#151713]">
      <BackButton maxWidth="64rem" />
      <section className="border-b border-[#d9dfd1] bg-white">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          <Link
            className="text-sm font-semibold text-[#176b46] underline-offset-4 hover:underline"
            href="/"
          >
            MyPayTag
          </Link>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
            Blog
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#586250]">
            Product notes, ecosystem essays, and integration guides for paying
            users by approved identity instead of wallet address.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-6 py-8 lg:px-8">
        {blogPosts.map((post) => (
          <Link
            className="rounded-lg border border-[#d9dfd1] bg-white p-5 transition hover:border-[#b9c7ad]"
            href={`/blog/${post.slug}`}
            key={post.slug}
          >
            <span className="text-xs font-semibold uppercase tracking-normal text-[#245c8d]">
              {post.category}
            </span>
            <h2 className="mt-3 text-2xl font-semibold leading-snug text-[#151713]">
              {post.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#586250]">
              {post.description}
            </p>
            <span className="mt-4 block text-xs font-medium text-[#6d7668]">
              {post.publishedAt} · {post.readingMinutes} min read
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
