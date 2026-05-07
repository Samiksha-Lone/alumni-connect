import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Briefcase, GraduationCap, MessageSquare, RefreshCw, ShieldCheck } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa6';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { CardSkeleton } from '../components/ui/Skeleton';

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMentorsOnly, setShowMentorsOnly] = useState(false);
  const { user } = useAuth();

  const fetchAlumni = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/users/alumni', { withCredentials: true });
      const list = (res.data || []).filter(a => a._id !== user?.id);
      setAlumni(list);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Please login to view the alumni directory');
      } else {
        setError(err.response?.data?.message || 'Failed to load alumni');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchAlumni(); }, [fetchAlumni]);

  const filteredAlumni = alumni.filter(a => {
    const matchesSearch =
      (a.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.courseStudied || '').toLowerCase().includes(searchQuery.toLowerCase());
    return showMentorsOnly ? matchesSearch && a.mentorAvailable : matchesSearch;
  });

  return (
    <div className="section-container">
      {/* Header */}
      <div className="flex flex-col items-center mb-10 text-center animate-slide-up">
        <h1 className="mb-2 text-3xl font-bold">Alumni Directory</h1>
        <p className="max-w-md text-sm text-text-secondary">
          Connect with our global network of professional graduates.
        </p>
      </div>

      {/* Search + Refresh */}
      <div className="flex flex-col items-center max-w-xl gap-3 mx-auto mb-6 sm:flex-row">
        <div className="relative flex-grow w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={15} />
          <input
            type="text"
            placeholder="Search by name, company or course..."
            className="w-full h-10 pl-10 text-sm form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={fetchAlumni} className="h-10 px-4 shrink-0 border-border">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </Button>
      </div>

      {/* Mentor Filter */}
      <div className="flex justify-center mb-10">
        <label className="inline-flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer hover:text-text-primary transition-colors select-none">
          <input
            type="checkbox"
            checked={showMentorsOnly}
            onChange={(e) => setShowMentorsOnly(e.target.checked)}
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
          />
          Show available mentors only
        </label>
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredAlumni.map((a) => (
            <AlumniCard key={a._id} alumni={a} />
          ))}
        </div>
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

function AlumniCard({ alumni }) {
  const [mentorshipStatus, setMentorshipStatus] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const checkMentorshipStatus = useCallback(async () => {
    try {
      const res = await axios.get(`/chat/mentorship-status/${alumni._id}`);
      setMentorshipStatus(res.data);
    } catch (err) {
      console.log('Error checking mentorship status:', err);
    }
  }, [alumni._id]);

  useEffect(() => {
    if (alumni.mentorAvailable && user) {
      checkMentorshipStatus();
    }
  }, [alumni.mentorAvailable, alumni._id, user, checkMentorshipStatus]);

  const handleMentorshipClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const templateMessage = `Hi ${alumni.name.split(' ')[0]},\n\nI hope you are doing well. I would love to connect with you for mentorship and learn more about your experience in ${alumni.company || 'your field'}.\n\nCould we chat about career guidance, skills I should focus on, and how to approach similar opportunities?\n\nThank you!`;

    navigate('/chat', {
      state: {
        partnerId: alumni._id,
        partnerName: alumni.name,
        initialMessage: templateMessage
      }
    });
  };

  const handleMessageClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/chat', { state: { partnerId: alumni._id, partnerName: alumni.name } });
  };

  return (
    <>
      <Card className="flex flex-col h-full group hover:border-primary/30 transition-all duration-200 !p-0 overflow-hidden bg-card">
        {/* Body */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center justify-center text-base font-bold transition-transform border w-11 h-11 rounded-xl bg-primary-soft text-primary border-primary/10 group-hover:scale-105">
              {alumni.name?.charAt(0)}
            </div>
            <div className="flex items-center gap-1.5">
              {alumni.mentorAvailable && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wide">
                  Mentor
                </span>
              )}
              {alumni.linkedin && (
                <a
                  href={alumni.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-text-secondary hover:text-blue-600 transition-colors border border-border"
                >
                  <FaLinkedin size={13} />
                </a>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-3">
            <h3 className="text-sm font-bold leading-tight truncate transition-colors group-hover:text-primary">
              {alumni.name}
            </h3>
            {alumni.isVerified && (
              <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Briefcase size={12} className="shrink-0 text-primary/60" />
              <span className="font-medium truncate">{alumni.company || 'Professional Member'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <GraduationCap size={12} className="shrink-0 text-primary/60" />
              <span className="truncate">Class of {alumni.graduationYear || 'N/A'} · {alumni.courseStudied || 'Member'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-gray-50/50 dark:bg-gray-800/10">
          {alumni.mentorAvailable && mentorshipStatus?.hasMentorshipRequest ? (
            // Second interaction - show Message button only
            <Button
              onClick={handleMessageClick}
              variant="secondary"
              className="w-full text-xs font-semibold h-9 border-border"
            >
              <MessageSquare size={12} className="mr-1.5 shrink-0" />
              Message
            </Button>
          ) : alumni.mentorAvailable ? (
            // First interaction - show Request Mentorship
            <Button
              onClick={handleMentorshipClick}
              variant="primary"
              className="w-full text-xs font-semibold h-9"
            >
              <MessageSquare size={12} className="mr-1.5 shrink-0" />
              Request Mentorship
            </Button>
          ) : (
            // Not a mentor - show Message
            <Button
              onClick={handleMessageClick}
              variant="secondary"
              className="w-full text-xs font-semibold h-9 border-border"
            >
              <MessageSquare size={12} className="mr-1.5 shrink-0" />
              Message
            </Button>
          )}
        </div>
      </Card>

    </>
  );
}