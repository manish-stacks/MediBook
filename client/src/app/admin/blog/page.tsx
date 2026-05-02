'use client';
// src/app/admin/blog/page.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

function BlogModal({ post, onClose }: { post: any; onClose: () => void }) {
  const qc = useQueryClient();
  const isEdit = !!post?.id;
  const [form, setForm] = useState({
    title: post?.title || '', excerpt: post?.excerpt || '', content: post?.content || '',
    coverImage: post?.coverImage || '', isPublished: post?.isPublished || false,
  });
  const up = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit
      ? api.put(`/blogs/${post.id}`, data)
      : api.post('/blogs', data),
    onSuccess: () => { toast.success(isEdit ? 'Post updated!' : 'Post created!'); qc.invalidateQueries({ queryKey: ['admin-blogs'] }); onClose(); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl p-6 my-4">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-900 text-lg">{isEdit ? 'Edit Post' : 'New Blog Post'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={e => up('title', e.target.value)} placeholder="Post title..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Cover Image URL</label>
            <input type="url" value={form.coverImage} onChange={e => up('coverImage', e.target.value)} placeholder="https://..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Excerpt</label>
            <textarea value={form.excerpt} onChange={e => up('excerpt', e.target.value)} rows={2} placeholder="Brief summary..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 resize-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Content *</label>
            <textarea value={form.content} onChange={e => up('content', e.target.value)} rows={10} placeholder="Write your blog post here..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-brand-400 resize-y transition-all" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => up('isPublished', !form.isPublished)}
              className={`w-11 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-brand-600' : 'bg-slate-200'} relative`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm font-medium text-slate-700">{form.isPublished ? 'Published' : 'Draft'}</span>
          </label>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-2xl">Cancel</button>
          <button onClick={() => mutation.mutate(form)} disabled={mutation.isPending || !form.title}
            className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-2xl disabled:opacity-60 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> {mutation.isPending ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminBlogPage() {
  const qc = useQueryClient();
  const [editPost, setEditPost] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: () => api.get('/admin/blogs').then(r => r.data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/blogs/${id}`),
    onSuccess: () => { toast.success('Post deleted'); qc.invalidateQueries({ queryKey: ['admin-blogs'] }); },
  });

  const posts = data?.posts || [];

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Blog Posts</h1>
          <p className="text-slate-500 mt-1">{posts.length} articles</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-2xl text-sm hover:bg-brand-700 shadow-sm">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_,i) => <div key={i} className="h-20 skeleton rounded-2xl" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="divide-y divide-slate-50">
            {posts.map((post: any, i: number) => (
              <motion.div key={post.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors">
                {post.coverImage && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 hidden sm:block">
                    <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{post.title}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>By {post.author?.firstName} {post.author?.lastName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${post.isPublished ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {post.isPublished ? '● Published' : '○ Draft'}
                  </span>
                  <button onClick={() => setEditPost(post)} className="p-1.5 rounded-xl hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => { if(confirm('Delete this post?')) deleteMutation.mutate(post.id); }}
                    className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {(editPost || showCreate) && <BlogModal post={editPost} onClose={() => { setEditPost(null); setShowCreate(false); }} />}
    </div>
  );
}
