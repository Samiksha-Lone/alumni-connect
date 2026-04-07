import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import { Sparkles, Star, MessageCircle, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

export default function Recommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const res = await axios.get(`/recommendations/for/${user._id}`);
      setRecommendations(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <div className="section-container">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3 text-primary">
          <Sparkles size={24} />
          <h1 className="heading-lg">Alumni Recommendations for You</h1>
        </div>
        <p className="text-text-secondary text-sm">
          AI-powered suggestions based on your course, skills, and career interests. Connect with alumni who can help guide your journey.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-secondary">Loading recommendations...</div>
      ) : recommendations.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-soft">
            <Sparkles size={24} className="text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Update your profile for better recommendations</h3>
          <p className="text-text-secondary text-sm mb-4">
            Add your skills, expertise, and interests to get personalized alumni suggestions.
          </p>
          <Button variant="primary">Go to Profile</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {recommendations.map((alumni) => (
            <Card key={alumni._id} className="p-5 hover:border-primary transition-colors">
              <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                {/* Left: Alumni Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{alumni.name}</h3>
                    {alumni.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-500/20">
                        <CheckCircle2 size={10} /> Verified
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-text-secondary mb-3">
                    <p className="flex items-center gap-2">
                      <span className="font-semibold text-primary">{alumni.company || 'Not specified'}</span>
                    </p>
                    <p className="text-xs">{alumni.expertise || alumni.courseStudied || 'Professional'}</p>
                  </div>

                  {alumni.skills && alumni.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {alumni.skills.slice(0, 4).map((skill) => (
                        <span key={skill} className="px-2 py-1 rounded-full bg-primary-soft text-primary text-[10px] font-semibold">
                          {skill}
                        </span>
                      ))}
                      {alumni.skills.length > 4 && (
                        <span className="px-2 py-1 text-[10px] text-text-secondary">+{alumni.skills.length - 4} more</span>
                      )}
                    </div>
                  )}

                  {alumni.bio && (
                    <p className="text-xs text-text-secondary line-clamp-2 mb-3">{alumni.bio}</p>
                  )}
                </div>

                {/* Right: Match Score & Actions */}
                <div className="flex flex-col items-end gap-3 sm:w-auto w-full">
                  <div className="flex items-center gap-2 text-primary">
                    <Star size={18} className="fill-primary" />
                    <span className="font-bold text-lg">{alumni.matchScore?.toFixed(1) || 0}%</span>
                  </div>
                  <p className="text-xs text-text-secondary">Match Score</p>

                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <Button variant="secondary" className="h-9 px-4 text-xs gap-2">
                      <MessageCircle size={14} /> Message
                    </Button>
                    {alumni.mentorAvailable && (
                      <Button variant="primary" className="h-9 px-4 text-xs gap-2">
                        <LinkIcon size={14} /> Request Mentor
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
