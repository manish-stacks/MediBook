'use client';
// src/app/(public)/blog/page.tsx
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Calendar, Search } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['blog', page],
    queryFn: () => api.get(`/blogs?page=${page}&limit=9`).then(r => r.data.data),
  });
  const posts = data?.posts || [];
  const total  = data?.total || 0;

  return (
    <div className="pt-16 min-h-screen bg-surface-subtle">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3">Health Blog</h1>
            <p className="text-slate-500 text-lg">Expert health tips, medical insights, and wellness advice</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-80 skeleton rounded-2xl" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-slate-500 text-lg">No blog posts yet</p>
            <p className="text-slate-400 text-sm mt-2">Check back soon for health tips and insights</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any, i: number) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Link href={`/blog/${post.slug}`} className="group block bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  {!post.coverImage && (
                    <div className="h-48 bg-gradient-to-br from-brand-50 to-teal-50 flex items-center justify-center text-5xl">📰</div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.publishedAt ? formatDate(post.publishedAt) : 'Recent'}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />5 min read</span>
                    </div>
                    <h2 className="font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">{post.title}</h2>
                    {post.excerpt && <p className="text-sm text-slate-500 line-clamp-3 flex-1">{post.excerpt}</p>}
                    <div className="mt-4 flex items-center justify-between">
                      {post.author && (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 font-bold text-xs flex items-center justify-center">
                            {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                          </div>
                          <span className="text-xs text-slate-500">{post.author.firstName} {post.author.lastName}</span>
                        </div>
                      )}
                      <span className="text-brand-600 text-xs font-semibold group-hover:underline">Read more →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {total > 9 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-5 py-2.5 rounded-2xl border border-slate-200 text-sm font-medium disabled:opacity-40 hover:bg-slate-50">Previous</button>
            <span className="text-sm text-slate-500">Page {page} of {Math.ceil(total / 9)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={posts.length < 9} className="px-5 py-2.5 rounded-2xl border border-slate-200 text-sm font-medium disabled:opacity-40 hover:bg-slate-50">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
