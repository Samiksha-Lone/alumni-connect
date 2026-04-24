import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Briefcase, ExternalLink, AlertCircle, Search, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { CardSkeleton } from '../components/ui/Skeleton';

export default function Opportunities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/jobs');
      setItems(res.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOpportunities(); }, [fetchOpportunities]);

  const filteredItems = items.filter(o =>
    o.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="section-container">
      {/* Page Header */}
      <div className="flex flex-col items-center text-center mb-10 animate-slide-up">
        <h1 className="text-3xl font-bold mb-2">Career Opportunities</h1>
        <p className="text-text-secondary text-sm max-w-md">
          Exclusive job openings and internships shared by our alumni network.
        </p>
      </div>

      {/* Search */}
      <div className="flex max-w-xl mx-auto mb-10">
        <div className="relative group flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={15} />
          <input
            type="text"
            placeholder="Search roles or companies..."
            className="form-input pl-10 h-10 text-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <Card className="mb-8 border-red-500/20 bg-red-50 dark:bg-red-500/5 text-red-600 flex items-center gap-2.5 py-3 px-4 text-sm font-medium">
          <AlertCircle size={18} /> {error}
        </Card>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && items.length === 0 ? (
          [1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed col-span-full border-border rounded-2xl bg-gray-50/50 dark:bg-gray-900/10">
            <Briefcase size={40} className="mx-auto text-text-secondary/20 mb-3" />
            <p className="text-lg font-medium text-text-secondary">No opportunities found.</p>
            <p className="text-xs text-text-secondary/60">Try clearing your filters or check back later.</p>
          </div>
        ) : (
          filteredItems.map((o) => (
            <Card key={o._id} className="flex flex-col h-full group overflow-hidden !p-0">
              <div className="p-4 flex-grow">
                <div className="mb-3">
                  <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors leading-snug mb-0.5">
                    {o.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-text-secondary font-medium">
                    <Briefcase size={12} className="text-primary/60 shrink-0" />
                    {o.company}
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">{o.description}</p>
              </div>

              <div className="px-4 py-3 border-t border-border mt-auto flex items-center justify-between bg-gray-50/30 dark:bg-gray-800/10 gap-3">
                {o.closingDate ? (
                  <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <Clock size={11} className="text-amber-500 shrink-0" />
                    <span>Closes {new Date(o.closingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                ) : <div />}

                {o.link ? (
                  <a href={o.link} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" className="h-8 px-4 text-xs font-semibold gap-1.5">
                      Apply Now <ExternalLink size={11} />
                    </Button>
                  </a>
                ) : null}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}