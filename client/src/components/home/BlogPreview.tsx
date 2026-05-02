'use client';
// src/components/home/BlogPreview.tsx
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowRight, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function BlogPreview() {
  const { data } = useQuery({
    queryKey: ['blog-preview'],
    queryFn: () => api.get('/blogs?limit=3').then(r => r.data.data.posts),
  });

  const posts = data || [];
  if (!posts.length) return null;

  return (
    <section className="py-20 bg-surface-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-brand-600 text-sm font-semibold tracking-wider uppercase">Health insights</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mt-2">Latest from the Blog</h2>
          </div>
          <Link href="/blog" className="hidden md:flex items-center gap-2 text-brand-600 font-semibold hover:gap-3 transition-all">
            All articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post: any, i: number) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link href={`/blog/${post.slug}`} className="group block bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover border border-slate-100 transition-all duration-300 hover:-translate-y-1">
                {post.coverImage && (
                  <div className="h-48 overflow-hidden">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-1"><Clock className="w-3 h-3" /><span>5 min read</span></div>
                    <span>•</span>
                    <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Recent'}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-2 mb-2">{post.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
