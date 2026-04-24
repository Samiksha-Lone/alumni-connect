import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/useToast';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PasswordInput from '../components/ui/PasswordInput';
import {
  User, GraduationCap, Building2, BookOpen,
  LogOut,
  RefreshCw, X, AlertCircle, Pencil, Link as LinkIcon
} from 'lucide-react';

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Profile() {
  const { user, logout } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [editing, setEditing]   = useState(false);
  const [form, setForm]         = useState({});
  const [updating, setUpdating] = useState(false);

  // Redirect admin to their dedicated dashboard
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const load = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`/users/${user._id}`);
        setForm(res.data);
      } catch (err) {
        if (err.response?.status === 401) logout();
      }
    };
    load();
  }, [user?._id, logout]);

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-28 text-text-secondary animate-fade-in">
      <div className="w-5 h-5 mb-4 border-2 rounded-full animate-spin border-primary border-t-transparent" />
      <p className="text-sm">Loading your profile…</p>
    </div>
  );

  const handleSave = async () => {
    if (!user?._id) { error('Please refresh and log in again.'); return; }
    setUpdating(true);
    try {
      const payload = { ...form };
      if (payload.yearOfStudying !== undefined && payload.yearOfStudying !== '') {
        payload.yearOfStudying = Number(payload.yearOfStudying);
      } else {
        delete payload.yearOfStudying;
      }
      const res = await axios.put(`/users/${user._id}`, payload);
      setForm(res.data);
      success('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      if (err.response?.status === 401) { error('Session expired.'); logout(); }
      else error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  /* derived info */
  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  const subline = user.role === 'student'
    ? [form.course, form.yearOfStudying ? `Year ${form.yearOfStudying}` : null].filter(Boolean).join(' · ') || 'Student'
    : user.role === 'alumni'
      ? [form.company, form.courseStudied].filter(Boolean).join(' · ') || 'Alumni'
      : 'Administrator';

  const skillsArr = form.skills
    ? (Array.isArray(form.skills) ? form.skills : form.skills.split(',').map(s => s.trim())).filter(Boolean)
    : [];
  const topicsArr = form.mentorshipTopics
    ? (Array.isArray(form.mentorshipTopics) ? form.mentorshipTopics : form.mentorshipTopics.split(',').map(s => s.trim())).filter(Boolean)
    : [];
  const certificationsArr = form.certifications
    ? (Array.isArray(form.certifications) ? form.certifications : form.certifications.split(',').map(c => c.trim())).filter(Boolean)
    : [];
  const languagesArr = form.languages
    ? (Array.isArray(form.languages) ? form.languages : form.languages.split(',').map(l => l.trim())).filter(Boolean)
    : [];
  const desiredRolesArr = form.desiredRoles
    ? (Array.isArray(form.desiredRoles) ? form.desiredRoles : form.desiredRoles.split(',').map(r => r.trim())).filter(Boolean)
    : [];

  return (
    <div className="max-w-5xl section-container animate-slide-up">

      {/* ── PROFILE HEADER ── */}
      <div className="flex flex-col gap-5 pb-8 mb-8 border-b sm:flex-row sm:items-start border-border">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex items-center justify-center w-16 h-16 text-2xl font-extrabold text-white shadow-md select-none rounded-2xl bg-primary shadow-primary/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="absolute w-4 h-4 border-2 rounded-full -bottom-1 -right-1 bg-emerald-500 border-card" title="Online" />
        </div>

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight truncate text-text-primary">
            {user.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full border bg-primary-soft text-primary border-primary/20">
              {roleLabel}
            </span>
            {subline && (
              <span className="text-xs text-text-secondary">{subline}</span>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-1.5 truncate">{form.email || user.email}</p>
        </div>

        {/* Actions */}
        <div className="flex self-start gap-2 shrink-0">
          <Button
            variant="secondary"
            onClick={() => { setEditing(!editing); }}
            className="h-9 px-4 text-sm border-border gap-1.5"
          >
            {editing
              ? <><X size={14} /> Cancel</>
              : <><Pencil size={14} /> Edit</>
            }
          </Button>
          <Button
            onClick={logout}
            className="px-4 text-sm text-white bg-red-500 border-transparent h-9 hover:bg-red-600"
          >
            <LogOut size={14} className="mr-1" /> Sign out
          </Button>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-2">

          {/* LEFT: Details */}
          <div className="space-y-6">

            {/* About / Bio */}
            <Card className="p-5">
              <SectionHeading icon={<User size={13} />} label="About" />
              {editing ? (
                <textarea
                  value={form.bio || ''}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  className="form-input text-sm min-h-[100px] resize-none mt-3"
                  placeholder="Write a short bio about your goals, expertise, or interests."
                />
              ) : form.bio ? (
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{form.bio}</p>
              ) : (
                <EmptyHint editing={editing} message="Add a short bio to help people understand who you are." />
              )}
            </Card>

            {/* Personal + Academic Info */}
            <Card className="p-5">
              <SectionHeading icon={<GraduationCap size={13} />} label={user.role === 'student' ? 'Academic Info' : 'Professional Info'} />
              <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow
                  label="Full Name"
                  name="name"
                  value={form.name}
                  editing={editing}
                  onChange={setForm}
                />
                <InfoRow
                  label="Email Address"
                  name="email"
                  value={form.email}
                  editing={editing}
                  onChange={setForm}
                  type="email"
                />

                {user.role === 'student' && (
                  <>
                    <InfoRowSelect
                      label="Year of Study"
                      name="yearOfStudying"
                      value={form.yearOfStudying}
                      editing={editing}
                      onChange={setForm}
                      options={[
                        { value: '', label: 'Select year' },
                        { value: '1', label: '1st Year' },
                        { value: '2', label: '2nd Year' },
                        { value: '3', label: '3rd Year' },
                        { value: '4', label: '4th Year' },
                      ]}
                    />
                    <InfoRow label="Course / Branch" name="course" value={form.course} editing={editing} onChange={setForm} />
                  </>
                )}

                {user.role === 'alumni' && (
                  <>
                    <InfoRow label="Graduation Year" name="graduationYear" value={form.graduationYear} editing={editing} onChange={setForm} type="number" />
                    <InfoRow label="Course Studied" name="courseStudied" value={form.courseStudied} editing={editing} onChange={setForm} />
                    <InfoRow label="Current Company" name="company" value={form.company} editing={editing} onChange={setForm} />
                    <InfoRow label="Expertise" name="expertise" value={form.expertise} editing={editing} onChange={setForm} />
                  </>
                )}
              </div>
            </Card>

            {/* STUDENT JOB PROFILE SECTION */}
            {user.role === 'student' && (
              <>
                {/* Job Preferences */}
                <Card className="p-5">
                  <SectionHeading icon={<Building2 size={13} />} label="Job Preferences" />
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-text-secondary">Desired Roles</p>
                      {editing ? (
                        <input
                          className="text-sm form-input"
                          placeholder="e.g. Frontend Developer, Data Scientist, QA Engineer (comma separated)"
                          value={Array.isArray(form.desiredRoles) ? form.desiredRoles.join(', ') : form.desiredRoles || ''}
                          onChange={e => setForm(p => ({ ...p, desiredRoles: e.target.value }))}
                        />
                      ) : desiredRolesArr.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {desiredRolesArr.map(r => (
                            <span key={r} className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 font-medium">
                              {r}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <EmptyHint editing={editing} message="Specify your desired job roles." />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-text-secondary">Availability</p>
                        {editing ? (
                          <select
                            className="text-sm form-input"
                            value={form.availabilityStatus || 'not_available'}
                            onChange={e => setForm(p => ({ ...p, availabilityStatus: e.target.value }))}
                          >
                            <option value="not_available">Not Available</option>
                            <option value="notice_period">Notice Period</option>
                            <option value="immediate">Immediate</option>
                          </select>
                        ) : (
                          <p className="text-sm font-medium text-text-primary">
                            {form.availabilityStatus === 'immediate' ? 'Available Immediately' : 
                             form.availabilityStatus === 'notice_period' ? 'Notice Period Required' :
                             'Not Available'}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-text-secondary">GPA</p>
                        {editing ? (
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            className="text-sm form-input"
                            placeholder="e.g. 3.5"
                            value={form.gpa || ''}
                            onChange={e => setForm(p => ({ ...p, gpa: e.target.value }))}
                          />
                        ) : (
                          <p className="text-sm font-medium text-text-primary">
                            {form.gpa ? `${form.gpa}/10` : 'Not specified'}
                          </p>
                        )}
                      </div>
                    </div>

                    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(form.openToRemote)}
                        disabled={!editing}
                        onChange={e => setForm(p => ({ ...p, openToRemote: e.target.checked }))}
                        className="w-4 h-4 rounded border-border accent-primary"
                      />
                      <span className={`text-sm ${form.openToRemote ? 'text-emerald-600 font-semibold' : 'text-text-secondary'}`}>
                        Open to remote opportunities
                      </span>
                    </label>
                  </div>
                </Card>

              </>
            )}

            {/* Save button */}
            {editing && (
              <Button onClick={handleSave} disabled={updating} className="w-full text-sm font-semibold h-11">
                {updating
                  ? <><RefreshCw size={14} className="mr-2 animate-spin" /> Saving…</>
                  : 'Save Changes'
                }
              </Button>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* Skills (alumni only) */}
            {user.role === 'alumni' && (
              <Card className="p-5">
                <SectionHeading icon={<BookOpen size={13} />} label="Skills & Mentorship" />
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-text-secondary">Skills</p>
                    {editing ? (
                      <input
                        className="text-sm form-input"
                        placeholder="e.g. React, Python, System Design (comma separated)"
                        value={Array.isArray(form.skills) ? form.skills.join(', ') : form.skills || ''}
                        onChange={e => setForm(p => ({ ...p, skills: e.target.value }))}
                      />
                    ) : skillsArr.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {skillsArr.map(s => (
                          <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-primary-soft text-primary border border-primary/10 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <EmptyHint editing={editing} message="Add your skills to help students find the right mentor." />
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-text-secondary">Mentorship</p>
                    <label className="inline-flex items-center gap-2.5 cursor-pointer group select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(form.mentorAvailable)}
                        disabled={!editing}
                        onChange={e => setForm(p => ({ ...p, mentorAvailable: e.target.checked }))}
                        className="w-4 h-4 rounded border-border accent-primary"
                      />
                      <span className={`text-sm ${form.mentorAvailable ? 'text-emerald-600 font-semibold' : 'text-text-secondary'}`}>
                        {form.mentorAvailable ? 'Available for mentorship' : 'Not accepting mentorship requests'}
                      </span>
                    </label>
                    {form.mentorAvailable && (
                      <div className="mt-3">
                        {editing ? (
                          <input
                            className="text-sm form-input"
                            placeholder="e.g. Career advice, Interview prep (comma separated)"
                            value={Array.isArray(form.mentorshipTopics) ? form.mentorshipTopics.join(', ') : form.mentorshipTopics || ''}
                            onChange={e => setForm(p => ({ ...p, mentorshipTopics: e.target.value }))}
                          />
                        ) : topicsArr.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {topicsArr.map(t => (
                              <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-medium">
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <EmptyHint editing={editing} message="Add your mentorship topics so students know what to reach out for." />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}



            {/* Skills & Experience (student only) */}
            {user.role === 'student' && (
              <>
                {/* Work Experience & Skills */}
                <Card className="p-5">
                  <SectionHeading icon={<BookOpen size={13} />} label="Skills & Experience" />
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-text-secondary">Technical Skills</p>
                      {editing ? (
                        <input
                          className="text-sm form-input"
                          placeholder="e.g. Python, React, JavaScript, SQL (comma separated)"
                          value={Array.isArray(form.skills) ? form.skills.join(', ') : form.skills || ''}
                          onChange={e => setForm(p => ({ ...p, skills: e.target.value }))}
                        />
                      ) : skillsArr.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {skillsArr.map(s => (
                            <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-primary-soft text-primary border border-primary/10 font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <EmptyHint editing={editing} message="Add your technical skills to improve job prospects." />
                      )}
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-text-secondary">Work Experience</p>
                      {editing ? (
                        <textarea
                          className="text-sm form-input resize-none min-h-[80px]"
                          placeholder="Internship at Company (2023-2024), Project Lead at XYZ, Freelance work"
                          value={form.experience || ''}
                          onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}
                        />
                      ) : form.experience ? (
                        <p className="text-sm whitespace-pre-wrap text-text-secondary">{form.experience}</p>
                      ) : (
                        <EmptyHint editing={editing} message="Add internships, projects, or work experience." />
                      )}
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-text-secondary">Certifications</p>
                      {editing ? (
                        <input
                          className="text-sm form-input"
                          placeholder="e.g. AWS Solutions Architect, Google Associate Cloud Engineer (comma separated)"
                          value={Array.isArray(form.certifications) ? form.certifications.join(', ') : form.certifications || ''}
                          onChange={e => setForm(p => ({ ...p, certifications: e.target.value }))}
                        />
                      ) : certificationsArr.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {certificationsArr.map(c => (
                            <span key={c} className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 font-medium">
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <EmptyHint editing={editing} message="Add relevant certifications." />
                      )}
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-text-secondary">Languages</p>
                      {editing ? (
                        <input
                          className="text-sm form-input"
                          placeholder="e.g. English, Hindi, Spanish (comma separated)"
                          value={Array.isArray(form.languages) ? form.languages.join(', ') : form.languages || ''}
                          onChange={e => setForm(p => ({ ...p, languages: e.target.value }))}
                        />
                      ) : languagesArr.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {languagesArr.map(l => (
                            <span key={l} className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 font-medium">
                              {l}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <EmptyHint editing={editing} message="Add languages you speak." />
                      )}
                    </div>
                  </div>
                </Card>

                {/* Portfolio & Links */}
                <Card className="p-5">
                  <SectionHeading icon={<LinkIcon size={13} />} label="Portfolio & Links" />
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-text-secondary">Location</p>
                      {editing ? (
                        <input
                          className="text-sm form-input"
                          placeholder="e.g. San Francisco, CA or Remote"
                          value={form.location || ''}
                          onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                        />
                      ) : (
                        <p className="text-sm font-medium text-text-primary">
                          {form.location || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-text-secondary">Portfolio Links</p>
                      {editing ? (
                        <textarea
                          className="text-sm form-input resize-none min-h-[60px]"
                          placeholder={`GitHub: https://github.com/yourprofile\nPortfolio: https://yourportfolio.com\nLinkedIn: https://linkedin.com/in/yourprofile`}
                          value={form.portfolioLinks || ''}
                          onChange={e => setForm(p => ({ ...p, portfolioLinks: e.target.value }))}
                        />
                      ) : form.portfolioLinks ? (
                        <div className="space-y-2">
                          {form.portfolioLinks.split('\n').filter(link => link.trim()).map((link, idx) => {
                            const colonIndex = link.indexOf(':');
                            const [label, url] = colonIndex > 0 
                              ? [link.substring(0, colonIndex).trim(), link.substring(colonIndex + 1).trim()]
                              : [link.trim(), ''];
                            return url ? (
                              <a key={idx} href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" 
                                className="block px-3 py-2 text-xs font-medium text-purple-700 truncate transition-colors border border-purple-200 rounded-lg bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20 hover:bg-purple-100 dark:hover:bg-purple-500/20">
                                🔗 {label}
                              </a>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <EmptyHint editing={editing} message="Add GitHub, portfolio, or other profile links." />
                      )}
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-text-secondary">Achievements</p>
                      {editing ? (
                        <textarea
                          className="text-sm form-input resize-none min-h-[60px]"
                          placeholder="e.g. Won Hackathon 2024, Published research paper, etc."
                          value={form.achievements || ''}
                          onChange={e => setForm(p => ({ ...p, achievements: e.target.value }))}
                        />
                      ) : form.achievements ? (
                        <p className="text-sm whitespace-pre-wrap text-text-secondary">{form.achievements}</p>
                      ) : (
                        <EmptyHint editing={editing} message="Add notable achievements and awards." />
                      )}
                    </div>
                  </div>
                </Card>
              </>
            )}

          </div>

        </div>
        {/* Centered Tip */}
        <div className="max-w-xl mx-auto mt-6">
          <div className="p-4 border rounded-lg border-border bg-card/50">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-md bg-primary-soft text-primary flex items-center justify-center border border-primary/10 shrink-0 mt-0.5 flex-none">
                <AlertCircle size={12} />
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-text-primary">Make it easy for alumni</p>
                <p className="text-xs leading-relaxed text-text-secondary">
                  Your profile helps alumni recruiters understand your background and reach out with relevant opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

/* ─────────────────────────────────────────
   SECTION HEADING
───────────────────────────────────────── */
function SectionHeading({ icon, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-primary opacity-70">{icon}</span>
      <h2 className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">{label}</h2>
    </div>
  );
}

/* ─────────────────────────────────────────
   INFO ROW (2-col grid cell)
───────────────────────────────────────── */
function InfoRow({ label, name, value, editing, onChange, type = 'text' }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary mb-1">{label}</p>
      {editing ? (
        <input
          type={type}
          className="text-sm form-input h-9"
          value={value || ''}
          onChange={e => onChange(prev => ({ ...prev, [name]: e.target.value }))}
        />
      ) : (
        <p className="text-sm font-medium text-text-primary">
          {value || <span className="text-xs italic text-text-secondary/40">Not provided</span>}
        </p>
      )}
    </div>
  );
}

function InfoRowSelect({ label, name, value, editing, onChange, options }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary mb-1">{label}</p>
      {editing ? (
        <select
          className="text-sm cursor-pointer form-input h-9"
          value={value || ''}
          onChange={e => onChange(prev => ({ ...prev, [name]: e.target.value }))}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <p className="text-sm font-medium text-text-primary">
          {options.find(o => String(o.value) === String(value))?.label
            || <span className="text-xs italic text-text-secondary/40">Not provided</span>}
        </p>
      )}
    </div>
  );
}

function EmptyHint({ message }) {
  return (
    <p className="mt-2 text-xs italic text-text-secondary/50">{message}</p>
  );
}
