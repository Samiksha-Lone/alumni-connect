import React, { useEffect, useState, useCallback } from 'react';
import { Briefcase, AlertCircle, Search, X } from 'lucide-react';
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

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs();
      const list = Array.isArray(data) ? data : data?.data || [];
      setItems(list);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load opportunities');
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
      <SectionHeader
        eyebrow="MGM Opportunities"
        title="Career openings shared by alumni"
        description="Browse internships and full-time roles posted by graduates who want to support the next batch."
        align="center"
      />

      {/* Search */}
      <div className="flex max-w-xl mx-auto mb-10">
        <div className="relative flex-grow group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={15} />
          <input
            type="text"
            placeholder="Search roles or companies..."
            className="w-full h-10 pl-10 text-sm form-input"
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}