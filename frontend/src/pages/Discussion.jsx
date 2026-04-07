import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import { MessageCircle, Plus, Search, Send, ArrowLeft } from 'lucide-react';

export default function Discussion() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [tags, setTags] = useState('');
  const [comment, setComment] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchThreads = useCallback(async () => {
    try {
      setLoading(true);
      const url = query ? `/forum?q=${encodeURIComponent(query)}` : '/forum';
      const res = await axios.get(url);
      setThreads(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load discussions');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  const selectThread = async (threadId) => {
    try {
      const res = await axios.get(`/forum/${threadId}`);
      setSelectedThread(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load thread');
    }
  };

  const createThread = async () => {
    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/forum', {
        title,
        content,
        category,
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      });
      setTitle('');
      setContent('');
      setCategory('General');
      setTags('');
      toast.success('Discussion created');
      await fetchThreads();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create thread');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!comment) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`/forum/${selectedThread._id}/comments`, { content: comment });
      toast.success('Comment added');
      setComment('');
      selectThread(selectedThread._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <div className="flex flex-col gap-6 mb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="heading-lg mb-2">Discussion Forum</h1>
          <p className="text-text-secondary text-sm">Share ideas, ask questions, and engage with alumni and current students in structured discussion threads.</p>
        </div>

        {selectedThread ? (
          <Card className="max-w-4xl mx-auto p-6">
            <button className="inline-flex items-center gap-2 text-primary mb-4" onClick={() => setSelectedThread(null)}>
              <ArrowLeft size={16} /> Back to discussions
            </button>
            <div className="mb-4">
              <div className="text-xs uppercase tracking-[0.3em] text-text-secondary mb-2">{selectedThread.category}</div>
              <h2 className="text-2xl font-bold mb-2">{selectedThread.title}</h2>
              <div className="text-sm text-text-secondary">Posted by {selectedThread.authorName} • {new Date(selectedThread.createdAt).toLocaleString()}</div>
            </div>
            <p className="text-text-secondary leading-relaxed mb-6">{selectedThread.content}</p>
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-semibold mb-3">Comments</h3>
                {selectedThread.comments.length === 0 ? (
                  <p className="text-sm text-text-secondary">No comments yet. Be the first to respond.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedThread.comments.map((commentItem) => (
                      <div key={commentItem._id} className="p-4 rounded-2xl border border-border bg-card">
                        <div className="flex items-center justify-between mb-2 text-sm text-text-secondary">
                          <span>{commentItem.authorName}</span>
                          <span>{new Date(commentItem.createdAt).toLocaleString()}</span>
                        </div>
                        <p>{commentItem.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {user ? (
                <div className="space-y-3">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a thoughtful comment..."
                    className="form-input w-full text-sm resize-none h-28"
                  />
                  <Button onClick={addComment} disabled={loading}>
                    <Send size={14} /> Add Comment
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-text-secondary">Log in to contribute to the discussion.</p>
              )}
            </div>
          </Card>
        ) : (
          <>
            <Card className="max-w-4xl mx-auto p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">Create a new thread</h2>
                  <p className="text-text-secondary text-sm">Ask questions or share resources with the alumni community.</p>
                </div>
                <div className="relative max-w-xs">
                  <Search className="absolute top-3 left-3 text-text-secondary" size={16} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search discussions..."
                    className="form-input pl-10 h-10 w-full"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="form-label">Title</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-input h-10 text-sm" />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <input value={category} onChange={(e) => setCategory(e.target.value)} className="form-input h-10 text-sm" />
                </div>
              </div>
              <div className="mt-3">
                <label className="form-label">Tags (comma separated)</label>
                <input value={tags} onChange={(e) => setTags(e.target.value)} className="form-input h-10 text-sm" />
              </div>
              <div className="mt-3">
                <label className="form-label">Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} className="form-input w-full text-sm" />
              </div>
              <div className="mt-4 flex flex-wrap gap-3 justify-end">
                <Button onClick={createThread} disabled={!user || loading}>
                  <Plus size={14} /> Create Thread
                </Button>
              </div>
              {!user && <p className="text-xs text-text-secondary mt-2">You must be logged in to post a thread.</p>}
            </Card>

            <div className="grid gap-4">
              {loading && threads.length === 0 ? (
                <div className="p-8 rounded-3xl border border-border bg-card text-center text-text-secondary">Loading discussions...</div>
              ) : threads.length === 0 ? (
                <div className="p-8 rounded-3xl border border-border bg-card text-center text-text-secondary">No discussions available yet. Start the first conversation.</div>
              ) : (
                threads.map((thread) => (
                  <Card key={thread._id} className="p-6 hover:border-primary transition-colors cursor-pointer" onClick={() => selectThread(thread._id)}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold">{thread.title}</h3>
                      <span className="text-xs uppercase tracking-[0.2em] text-text-secondary">{thread.category}</span>
                    </div>
                    <p className="text-text-secondary line-clamp-2 mb-4">{thread.content}</p>
                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <span>{thread.authorName}</span>
                      <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
