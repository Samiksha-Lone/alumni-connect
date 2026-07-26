import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Briefcase, AlertCircle, Search, X, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { CardSkeleton } from '../components/ui/Skeleton';
import JobCard from '../components/jobs/JobCard';
import { useToast } from '../context/useToast';
import { useAuth } from '../context/AuthContext';
import DetailModal from '../components/ui/DetailModal';
import SectionHeader from '../components/common/SectionHeader';
import EmptyState from '../components/ui/EmptyState';
import { jobService } from '../services/job.service';

export default function Opportunities() {
  const { success, error: showError } = useToast();
  const { user } = useAuth();
  const [selectedJob, setSelectedJob] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [companyFilter, setCompanyFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const topRef = useRef(null);

  const fetchOpportunities = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await jobService.getJobsPaged({
        page,
        limit: pagination.limit,
        search: searchQuery.trim(),
        company: companyFilter.trim(),
        location: locationFilter.trim(),
        type: typeFilter.trim()
      });
      const list = res?.data || [];
      setItems(list);
      setPagination(res?.pagination || { page, limit: pagination.limit, total: 0, pages: 1 });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
      // scroll to top of list after page load
      try { topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* ignore */ }
    }
  }, [pagination.limit, searchQuery, companyFilter, locationFilter, typeFilter]);

  useEffect(() => { fetchOpportunities(1); }, [fetchOpportunities]);

  const filteredItems = items.filter(o =>
    (o.title?.toLowerCase().includes(searchQuery.toLowerCase()) || o.company?.toLowerCase().includes(searchQuery.toLowerCase()))
    && (companyFilter ? (o.company || '').toLowerCase() === companyFilter.toLowerCase() : true)
    && (locationFilter ? (o.location || '').toLowerCase().includes(locationFilter.toLowerCase()) : true)
    && (typeFilter ? (o.type || '').toLowerCase() === typeFilter.toLowerCase() : true)
  );

  return (
    <div className="section-container">
      <SectionHeader
        eyebrow="MGM Opportunities"
        title="Career openings shared by alumni"
        description="Browse internships and full-time roles posted by graduates who want to support the next batch."
        align="center"
      />

      {/* Search + Filters (aligned with Alumni page layout) */}
      <div className="flex flex-col max-w-5xl gap-3 p-4 mx-auto mb-6 border shadow-sm rounded-2xl border-border bg-card sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors" size={15} />
          <input
            type="text"
            placeholder="Search roles or companies..."
            className="w-full h-10 pl-10 text-sm bg-white border shadow-sm outline-none rounded-xl border-border focus:border-primary focus:ring-2 focus:ring-primary/10 dark:bg-slate-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') fetchOpportunities(1); }}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Company"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="h-10 px-3 text-sm bg-white border outline-none rounded-xl border-border focus:border-primary dark:bg-slate-900"
          />

          <input
            type="text"
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="h-10 px-3 text-sm bg-white border outline-none rounded-xl border-border focus:border-primary dark:bg-slate-900"
          />

          <input
            type="text"
            placeholder="Type (e.g. Internship)"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 text-sm bg-white border outline-none rounded-xl border-border focus:border-primary dark:bg-slate-900"
          />

          <Button variant="secondary" onClick={() => fetchOpportunities(1)} className="h-10 px-4 shrink-0 border-border">
            <RefreshCw size={15} className="mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-8 border-red-500/20 bg-red-50 dark:bg-red-500/5 text-red-600 flex items-center gap-2.5 py-3 px-4 text-sm font-medium">
          <AlertCircle size={18} /> {error}
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="text-sm text-text-secondary">
          Showing {items.length} of {pagination.total} opportunities
        </div>
        {pagination.pages > 1 && (
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchOpportunities(pagination.page - 1)}
              className="inline-flex items-center justify-center px-3 py-2 text-xs font-medium transition-colors border rounded-xl border-border bg-card text-text-secondary disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary hover:text-primary"
            >
              Previous
            </button>
            <span className="text-xs text-text-secondary">Page {pagination.page} of {pagination.pages}</span>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchOpportunities(pagination.page + 1)}
              className="inline-flex items-center justify-center px-3 py-2 text-xs font-medium transition-colors border rounded-xl border-border bg-card text-text-secondary disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary hover:text-primary"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div ref={topRef} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && items.length === 0 ? (
          [1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Briefcase}
              title="No opportunities found"
              description={searchQuery ? 'Try a different keyword or clear the search.' : 'There are no opportunities to show right now. Please check back later.'}
            />
          </div>
        ) : (
          filteredItems.map((o) => (
            <div key={o._id}>
              <JobCard
                job={{
                  ...o,
                  location: o.location || 'Pune, India',
                  salary: o.salary || '₹ 3 - 6 LPA',
                  postedDate: o.createdAt ? new Date(o.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '2 days ago',
                  skills: o.skills || ['React', 'Node.js', 'Communication'],
                }}
                onOpen={() => setSelectedJob(o)}
              />

              {selectedJob && selectedJob._id === o._id && (
                <DetailModal
                  open={true}
                  onClose={() => setSelectedJob(null)}
                  title={selectedJob.title}
                  subtitle={selectedJob.company}
                >
                  <p>{selectedJob.description}</p>
                  <div className="mt-4 space-y-2">
                    <div>Location: {selectedJob.location || 'Pune, India'}</div>
                    <div>Salary: {selectedJob.salary || '₹ 3 - 6 LPA'}</div>
                    <div>Posted: {selectedJob.postedDate}</div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={async () => {
                        if (!user) {
                          showError('Please sign in to apply');
                          return;
                        }
                        try {
                          window.open(selectedJob.link || '#', '_blank', 'noopener,noreferrer');
                          success('Opened application link');
                          setSelectedJob(null);
                        } catch (err) {
                          showError('Failed to open link');
                        }
                      }}
                      className="px-4 py-2 text-sm font-semibold text-white rounded-xl bg-primary"
                    >
                      Apply
                    </button>
                    <button
                      onClick={async () => {
                        if (!user) {
                          showError('Please sign in to save this job');
                          return;
                        }
                        try {
                          await jobService.saveJob(selectedJob._id);
                          success('Job saved');
                          setSelectedJob(null);
                        } catch (err) {
                          showError(err.message || 'Failed to save job');
                        }
                      }}
                      className="px-4 py-2 text-sm font-semibold border rounded-xl border-border"
                    >
                      Save
                    </button>
                  </div>
                </DetailModal>
              )}
            </div>
          ))
        )}
      </div>

      {/* bottom pagination + about */}
      <div className="mt-8">
        {pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              className="px-4 py-2 border rounded-lg border-border bg-card"
              disabled={pagination.page <= 1}
              onClick={() => fetchOpportunities(pagination.page - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-text-secondary">Page {pagination.page} of {pagination.pages}</span>
            <button
              className="px-4 py-2 border rounded-lg border-border bg-card"
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchOpportunities(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        )}

        
      </div>
    </div>
  );
}