import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { CardSkeleton } from '../components/ui/Skeleton';
import AlumniCard from '../components/alumni/AlumniCard';
import SectionHeader from '../components/common/SectionHeader';
import { userService } from '../services/user.service';

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 1 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showMentorsOnly, setShowMentorsOnly] = useState(false);
  const [gradYear, setGradYear] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchAlumni = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await userService.getAlumni({
        page,
        limit: 12,
        search: searchQuery.trim(),
        company: companyFilter.trim(),
        location: locationFilter.trim(),
        graduationYear: gradYear.trim(),
        mentorsOnly: showMentorsOnly
      });
      const list = (res.data || []).filter(a => a._id !== user?.id);
      setAlumni(list);
      setPagination(res.pagination || { page, limit: 12, total: 0, pages: 1 });
      setError('');
    } catch (err) {
      if (err.status === 401) {
        navigate('/auth');
        return;
      }
      setError(err.message || 'Failed to load alumni');
    } finally {
      setLoading(false);
    }
  }, [user?.id, navigate, searchQuery, companyFilter, locationFilter, gradYear, showMentorsOnly]);

  useEffect(() => { fetchAlumni(1); }, [fetchAlumni]);

  const filteredAlumni = alumni.filter((a) => {
    const matchesYear = gradYear ? String(a.graduationYear || '') === gradYear : true;
    const matchesCompany = companyFilter ? (a.company || '').toLowerCase().includes(companyFilter.toLowerCase()) : true;
    const matchesLocation = locationFilter ? (a.location || '').toLowerCase().includes(locationFilter.toLowerCase()) : true;
    const matchesMentor = showMentorsOnly ? a.mentorAvailable : true;

    return matchesYear && matchesCompany && matchesLocation && matchesMentor;
  });

  return (
    <div className="section-container">
      <SectionHeader
        eyebrow="MGM Alumni Directory"
        title="Find the right alumni connection"
        description="Search by name, company, batch, or location to discover professionals who can guide you next."
        align="center"
      />

      <div className="mx-auto mb-6 flex max-w-5xl flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary transition-colors" size={15} />
          <input
            type="text"
            placeholder="Search by name or company..."
            className="h-10 w-full rounded-xl border border-border bg-white pl-10 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:bg-slate-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchAlumni(1);
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select value={gradYear} onChange={(e) => setGradYear(e.target.value)} className="h-10 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary dark:bg-slate-900">
            <option value="">Graduation Year</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
          <input
            type="text"
            placeholder="Company"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="h-10 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary dark:bg-slate-900"
          />
          <input
            type="text"
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="h-10 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-primary dark:bg-slate-900"
          />
        </div>
        <Button variant="secondary" onClick={() => fetchAlumni(1)} className="h-10 shrink-0 border-border px-4">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </Button>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary">
          <input
            type="checkbox"
            checked={showMentorsOnly}
            onChange={(e) => setShowMentorsOnly(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary accent-primary"
          />
          Show available mentors only
        </label>
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Filter size={14} />
          <span>{filteredAlumni.length} profiles shown</span>
          {pagination.pages > 1 && <span>• Page {pagination.page} of {pagination.pages}</span>}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1,2,3,4,5,6,7,8].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <Card className="max-w-md p-8 mx-auto text-center border-red-100 bg-red-50/30 dark:bg-red-950/10">
          <p className="mb-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
          <Button variant="primary" onClick={fetchAlumni} className="px-6 text-sm h-9">Try Again</Button>
        </Card>
      ) : filteredAlumni.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAlumni.map((a) => (
              <AlumniCard
                key={a._id}
                alumni={a}
                onMessage={() => navigate('/chat', { state: { partnerId: a._id, partnerName: a.name } })}
                onMentor={() => navigate('/chat', { state: { partnerId: a._id, partnerName: a.name, initialMessage: `Hi ${a.name.split(' ')[0]},\n\nI would love to connect for guidance and mentorship. Could we talk about career opportunities and your experience in ${a.company || 'your field'}?` } })}
              />
            ))}
          </div>
          {pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                className="px-4"
                disabled={pagination.page <= 1}
                onClick={() => fetchAlumni(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-text-secondary">Page {pagination.page} of {pagination.pages}</span>
              <Button
                variant="secondary"
                className="px-4"
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchAlumni(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="max-w-sm py-16 mx-auto text-center border border-dashed border-border rounded-2xl bg-gray-50/50 dark:bg-gray-900/10">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 border rounded-xl bg-card border-border text-text-secondary">
            <Search size={22} />
          </div>
          <h3 className="mb-1 font-bold">No results found</h3>
          <p className="text-xs text-text-secondary">Try a different name, company, or clear the filter.</p>
        </div>
      )}
    </div>
  );
}