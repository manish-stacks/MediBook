'use client';
// src/app/(public)/blog/[slug]/page.tsx
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Clock, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function BlogPostPage() {
  const { slug } = useParams();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => api.get(`/blogs/${slug}`).then(r => r.data.data),
    enabled: !!slug,
  });

  if (isLoading) return (
    <div className="pt-24 max-w-3xl mx-auto px-4 space-y-4">
      <div className="h-10 skeleton rounded-xl w-3/4" />
      <div className="h-64 skeleton rounded-2xl" />
      {[...Array(5)].map((_, i) => <div key={i} className="h-4 skeleton rounded w-full" />)}
    </div>
  );

  if (!data) return (
    <div className="pt-24 text-center">
      <p className="text-slate-400">Post not found</p>
      <Link href="/blog" className="text-brand-600 hover:underline mt-2 inline-block">← Back to blog</Link>
    </div>
  );

  const post = data;

  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-6 text-sm transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Blog
        </button>

        {post.coverImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl overflow-hidden mb-8 h-72">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8 pb-6 border-b border-slate-100">
            {post.author && (
              <span className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 font-bold text-xs flex items-center justify-center">
                  {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                </div>
                {post.author.firstName} {post.author.lastName}
              </span>
            )}
            {post.publishedAt && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(post.publishedAt)}</span>}
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />5 min read</span>
          </div>

          {post.excerpt && (
            <p className="text-xl text-slate-500 leading-relaxed mb-8 font-medium">{post.excerpt}</p>
          )}

          <div
            className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content || '<p>Content coming soon...</p>' }}
          />
        </motion.div>
      </div>
    </div>
  );
}
