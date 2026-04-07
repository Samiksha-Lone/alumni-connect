import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import { Search, Users, MessageCircle, Send } from 'lucide-react';

export default function Mentorship() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [topics, setTopics] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMentors = useCallback(async () => {
    try {
      setLoading(true);
      const url = query ? `/mentorship/mentors?q=${encodeURIComponent(query)}` : '/mentorship/mentors';
      const res = await axios.get(url);
      setMentors(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load mentors');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get('/mentorship/requests');
      setRequests(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load mentorship requests');
    }
  }, [user]);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const sendRequest = async () => {
    if (!selectedMentor) {
      toast.error('Choose a mentor first');
      return;
    }

    try {
      setLoading(true);
      await axios.post('/mentorship/requests', {
        mentorId: selectedMentor._id,
        topics: topics.split(',').map((topic) => topic.trim()).filter(Boolean),
        message,
      });
      toast.success('Mentorship request sent');
      setSelectedMentor(null);
      setTopics('');
      setMessage('');
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="heading-lg mb-2">Mentorship Network</h1>
        <p className="text-text-secondary text-sm">Find alumni mentors who align with your career goals and request guidance directly through the platform.</p>
      </div>

      <Card className="mb-8 p-6">
        <div className="flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex">
          <div>
            <h2 className="text-lg font-semibold">Search for mentors</h2>
            <p className="text-text-secondary text-sm">Filter by expertise, company, or skills.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-3 left-3 text-text-secondary" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mentors..."
              className="form-input h-10 pl-10 w-full"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {loading && mentors.length === 0 ? (
            <Card className="p-6 text-center text-text-secondary">Loading mentors...</Card>
          ) : mentors.length === 0 ? (
            <Card className="p-6 text-center text-text-secondary">No mentors found. Update your profile or try another search.</Card>
          ) : mentors.map((mentor) => (
            <Card key={mentor._id} className={`p-5 cursor-pointer ${selectedMentor?._id === mentor._id ? 'border-primary' : ''}`} onClick={() => setSelectedMentor(mentor)}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{mentor.name}</h3>
                  <p className="text-sm text-text-secondary">{mentor.company || 'Company not listed'}</p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-text-secondary">{mentor.isVerified ? 'Verified' : 'Unverified'}</span>
              </div>
              <p className="text-sm text-text-secondary mb-3">{mentor.expertise || 'Expertise not listed'}</p>
              <div className="flex flex-wrap gap-2 text-[11px] text-text-secondary">
                {(mentor.skills || []).slice(0, 4).map((skill) => (
                  <span key={skill} className="px-2 py-[5px] rounded-full border border-border bg-white/80">{skill}</span>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4 text-md font-semibold text-primary">
              <Users size={18} /> Mentor request
            </div>
            {selectedMentor ? (
              <>
                <div className="mb-3">
                  <div className="text-sm font-semibold">Selected mentor</div>
                  <div className="text-text-secondary">{selectedMentor.name} • {selectedMentor.company || 'No company listed'}</div>
                </div>
                <label className="form-label">Topics (comma separated)</label>
                <input value={topics} onChange={(e) => setTopics(e.target.value)} className="form-input h-10 text-sm" placeholder="e.g. career advice, resume review" />
                <label className="form-label">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="form-input w-full text-sm h-28" placeholder="Introduce yourself and explain what guidance you need." />
                <Button onClick={sendRequest} disabled={loading} className="w-full mt-3">
                  <Send size={14} /> Send Request
                </Button>
              </>
            ) : (
              <p className="text-sm text-text-secondary">Select a mentor to prepare and send a mentorship request.</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4 text-md font-semibold text-primary">
              <MessageCircle size={18} /> Your requests
            </div>
            {requests.length === 0 ? (
              <p className="text-sm text-text-secondary">No mentorship requests yet.</p>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div key={request._id} className="p-3 rounded-2xl border border-border bg-card">
                    <div className="flex items-center justify-between mb-2 text-sm font-semibold">
                      <span>{request.mentorName}</span>
                      <span className="uppercase text-[11px] text-text-secondary">{request.status}</span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{request.message || 'No message provided'}</p>
                    <div className="text-[11px] text-text-secondary">Topics: {request.topics.join(', ') || 'Not specified'}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
