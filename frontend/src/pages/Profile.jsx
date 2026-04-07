import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/useToast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PasswordInput from '../components/ui/PasswordInput';
import { User, Mail, GraduationCap, Building2, BookOpen, FileText, Upload, LogOut, Settings, Plus, ShieldCheck, CheckCircle2, ArrowUpRight, RefreshCw, X, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { user, setUser, logout, users, fetchAllUsers } = useAuth();
  const { success, error } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [updating, setUpdating] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`/users/${user._id}`);
        setForm(res.data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        if (err.response?.status === 401) logout();
      }
    };
    loadProfile();
  }, [user?._id, logout]);

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-24 text-text-secondary animate-fade-in">
       <div className="animate-spin mb-4 h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
       <p className="font-medium">Authentication required...</p>
    </div>
  );

  const handleSave = async () => {
    if (!user?._id) {
      error('Please refresh and login again.');
      return;
    }

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
      console.error('Update error:', err);
      if (err.response?.status === 401) {
        error('Session expired. Please refresh and login.');
        logout();
      } else {
        error(err.response?.data?.message || 'Update failed');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      error('Please select a resume file');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);

    setResumeUploading(true);
    try {
      const res = await axios.post(`/users/${user._id}/upload-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newResumeUrl = res.data.resumeUrl;
      setUser(prev => ({ ...prev, resumeUrl: newResumeUrl }));
      
      success('Resume uploaded successfully!');
      setResumeFile(null);
      fetchAllUsers();
    } catch (err) {
      error(err.response?.data?.message || 'Upload failed');
    } finally {
      setResumeUploading(false);
    }
  };

  return (
    <div className="section-container max-w-7xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6 animate-slide-up">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-bold shadow-xl shadow-primary/20 border-2 border-white dark:border-gray-900">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="heading-lg mb-0">{user.name}</h1>
            <p className="text-text-secondary text-xs font-semibold flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Member
            </p>
          </div>
        </div>
        <div className="flex gap-2.5 w-full md:w-auto">
          <Button 
            variant="secondary" 
            onClick={() => setEditing(!editing)}
            className="flex-1 md:flex-none h-10 text-xs px-5 border-border"
          >
            {editing ? 'Cancel Editing' : <span className="flex items-center gap-1.5 font-bold"><Settings size={16} /> Edit Profile</span>}
          </Button>
          <Button 
            onClick={logout} 
            className="flex-1 md:flex-none h-10 text-xs px-5 bg-red-500 hover:bg-red-600 border-none text-white font-bold"
          >
            <LogOut size={16} className="mr-1.5" /> Logout
          </Button>
        </div>
      </div>

      <div className={user.role === 'admin' ? "grid lg:grid-cols-4 gap-8" : "grid lg:grid-cols-3 gap-6"}>
        {/* Left Sidebar / Profile Card */}
        <div className={user.role === 'admin' ? "lg:col-span-1 space-y-6" : "lg:col-span-2 space-y-6"}>
          <Card className="p-5 border-primary/5 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-widest text-text-secondary mb-6 flex items-center gap-2">
              <User size={14} className="text-primary" /> Identity
            </h2>
            <div className="space-y-5">
              <ProfileField icon={<User size={12} />} label="Full Name" name="name" value={form.name} editing={editing} onChange={setForm} className="border-b border-border/40 pb-4 last:border-0" />
              <ProfileField icon={<Mail size={12} />} label="Work Email" name="email" value={form.email} editing={editing} onChange={setForm} type="email" className="border-b border-border/40 pb-4 last:border-0" />

              {user.role === 'student' && (
                <>
                  <ProfileSelectField
                    icon={<GraduationCap size={12} />}
                    label="Year of Study"
                    name="yearOfStudying"
                    value={form.yearOfStudying}
                    editing={editing}
                    onChange={setForm}
                    options={[
                      { value: '', label: 'Select Year' },
                      { value: '1', label: '1st Year' },
                      { value: '2', label: '2nd Year' },
                      { value: '3', label: '3rd Year' },
                      { value: '4', label: '4th Year' }
                    ]}
                  />
                  <ProfileField icon={<BookOpen size={12} />} label="Course Name" name="course" value={form.course} editing={editing} onChange={setForm} />
                </>
              )}

              {user.role === 'alumni' && (
                <>
                  <ProfileField icon={<GraduationCap size={12} />} label="Graduation Year" name="graduationYear" value={form.graduationYear} editing={editing} onChange={setForm} type="number" />
                  <ProfileField icon={<Building2 size={12} />} label="Current Company" name="company" value={form.company} editing={editing} onChange={setForm} />
                  <ProfileField icon={<BookOpen size={12} />} label="Course Studied" name="courseStudied" value={form.courseStudied} editing={editing} onChange={setForm} />
                  <ProfileField icon={<ShieldCheck size={12} />} label="Expertise" name="expertise" value={form.expertise} editing={editing} onChange={setForm} />
                  <ProfileField icon={<BookOpen size={12} />} label="Skills (comma separated)" name="skills" value={form.skills?.join ? form.skills.join(', ') : form.skills} editing={editing} onChange={setForm} />
                  <div className="border-b border-border/40 pb-4">
                    <label className="text-[11px] uppercase font-bold text-text-secondary tracking-widest pl-1 mb-1.5 block">Mentor Availability</label>
                    <label className="inline-flex items-center gap-2 text-sm text-text-primary">
                      <input
                        type="checkbox"
                        checked={Boolean(form.mentorAvailable)}
                        disabled={!editing}
                        onChange={(e) => setForm((prev) => ({ ...prev, mentorAvailable: e.target.checked }))}
                        className="form-checkbox"
                      />
                      Available for mentorship
                    </label>
                  </div>
                  <ProfileField icon={<User size={12} />} label="Mentorship Topics" name="mentorshipTopics" value={form.mentorshipTopics?.join ? form.mentorshipTopics.join(', ') : form.mentorshipTopics} editing={editing} onChange={setForm} />
                </>
              )}
              <div className="border-b border-border/40 pb-4">
                <label className="text-[11px] uppercase font-bold text-text-secondary tracking-widest pl-1 mb-1.5 block">About</label>
                <textarea
                  value={form.bio || ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                  disabled={!editing}
                  className="form-input w-full text-sm min-h-[90px]"
                  placeholder="Write a short bio about your goals, expertise, or interests."
                />
              </div>
            </div>

            {editing && (
              <Button onClick={handleSave} disabled={updating} className="w-full mt-8 h-10 text-xs font-black shadow-lg shadow-primary/10">
                {updating ? 'Saving...' : 'Sync Profile'}
              </Button>
            )}
          </Card>
        </div>

        {/* Main Dashboard / Career Assets */}
        <div className={user.role === 'admin' ? "lg:col-span-3 space-y-6" : "space-y-6"}>
          {user.role === 'admin' ? (
            <AdminPanel fetchAllUsers={fetchAllUsers} />
          ) : (
            <Card className="p-6 border-primary/5 shadow-sm h-full">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-widest text-text-secondary mb-6 flex items-center gap-2">
                    <FileText size={14} className="text-primary" /> Career Assets
                  </h2>

                  <p className="text-[11px] text-text-secondary mb-3 uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                    {user.resumeUrl ? 'Resume Uploaded' : 'Upload Career Resume'}
                  </p>
                  
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    id="resume-upload"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="hidden"
                  />
                  
                  <label 
                    htmlFor="resume-upload"
                    className="w-full py-2.5 px-4 rounded-lg border border-border bg-card hover:bg-gray-50 dark:hover:bg-primary-soft/5 transition-all cursor-pointer text-xs font-bold truncate flex items-center justify-center gap-2"
                  >
                    {resumeFile ? resumeFile.name : (user.resumeUrl ? 'Replace Resume' : 'Choose file...')}
                  </label>
                </div>

                <Button 
                  onClick={handleResumeUpload} 
                  disabled={!resumeFile || resumeUploading}
                  className="w-full h-10 text-xs font-black shadow-lg shadow-primary/10"
                >
                  {resumeUploading ? (
                    <span className="flex items-center gap-2"><RefreshCw size={14} className="animate-spin" /> Uploading...</span>
                  ) : 'Sync Resume to Profile'}
                </Button>

                {user.resumeUrl && (
                  <div className="pt-2 border-t border-border/50">
                    <a 
                      href={user.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-primary-soft/10 text-primary border border-primary/20 hover:bg-primary-soft/20 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-white dark:bg-gray-800">
                          <FileText size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-bold uppercase tracking-tight leading-none mb-1">Live Document</p>
                          <p className="text-[11px] font-bold text-text-primary">Current_Resume.pdf</p>
                        </div>
                      </div>
                      <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                )}
              </div>
            </Card>
          )}


        </div>
      </div>

      <Card className="p-4 bg-primary-soft/20 border-primary/10 text-center w-full mt-2">
        <h3 className="text-sm font-bold mb-1">Privacy Tip</h3>
        <p className="text-[11px] text-text-secondary leading-relaxed">
          Keeping your profile updated helps alumni find you for the right opportunities.
        </p>
      </Card>
    </div>
  );
}

function AdminPanel({ fetchAllUsers }) {
  const { users } = useAuth();
  const { success, error } = useToast();
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const res = await axios.get('/debug/status');
        setStats(res.data.counts);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  async function handleAddAdmin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/auth/register', { ...newAdmin, role: 'admin' });
      success('✅ New admin created successfully!');
      setNewAdmin({ name: '', email: '', password: '' });
      setShowAddAdmin(false);
      fetchAllUsers();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  }

  const StatBox = ({ label, value, icon, colorClass }) => (
    <div className="bg-card border border-border/60 p-3.5 rounded-xl flex items-center gap-3 transition-all hover:border-primary/40 hover:shadow-sm">
      <div className={`p-2.5 rounded-lg ${colorClass} opacity-90`}>
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider font-bold text-text-secondary mb-0.5">{label}</p>
        <p className="text-lg font-extrabold leading-none">{value !== undefined ? value : '...'}</p>
      </div>
    </div>
  );

  return (
    <Card className="mt-8 p-0 border-primary/10 bg-primary-soft/5 overflow-hidden">
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tight">
            <ShieldCheck size={18} className="text-primary" /> Admin Dashboard
          </h2>
          <Button 
            onClick={() => setShowAddAdmin(!showAddAdmin)} 
            variant={showAddAdmin ? 'secondary' : 'primary'}
            className="h-9 px-4 text-[11px] font-bold"
          >
            {showAddAdmin ? <X size={16} /> : <span className="flex items-center gap-1.5"><Plus size={16} /> Add Admin</span>}
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatBox 
            label="Students" 
            value={stats?.students} 
            icon={<GraduationCap />} 
            colorClass="bg-blue-500/10 text-blue-500" 
          />
          <StatBox 
            label="Alumni" 
            value={stats?.alumni} 
            icon={<User />} 
            colorClass="bg-emerald-500/10 text-emerald-500" 
          />
          <StatBox 
            label="Events" 
            value={stats?.events} 
            icon={<ShieldCheck />} 
            colorClass="bg-amber-500/10 text-amber-500" 
          />
          <StatBox 
            label="Jobs" 
            value={stats?.jobs} 
            icon={<Building2 />} 
            colorClass="bg-purple-500/10 text-purple-500" 
          />
        </div>
      </div>
      
      {/* Student Directory / Talent Pool (Admin Only) */}
      <div className="p-6 border-t border-border/50 bg-gray-50/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Student Directory</h3>
          <p className="text-[10px] text-text-secondary/60 italic font-medium">All students currently on the platform</p>
        </div>
        
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {users.filter(u => u.role === 'student').length === 0 ? (
            <div className="p-8 text-center text-[11px] text-text-secondary/60 bg-white/20 rounded-xl border border-dashed">
              No students found in the database.
            </div>
          ) : (
            users.filter(u => u.role === 'student').map((s) => (
              <div key={s._id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/60 hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-bold text-xs">
                    {s.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-text-primary leading-none mb-1">{s.name}</p>
                    <p className="text-[10px] text-text-secondary">{s.course || 'Degree Member'} | Year {s.yearOfStudying || '?'}</p>
                  </div>
                </div>
                
                {s.resumeUrl ? (
                  <a 
                    href={s.resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-all"
                  >
                    <FileText size={14} />
                  </a>
                ) : (
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-text-secondary opacity-30" title="No resume uploaded">
                    <AlertCircle size={14} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {showAddAdmin && (
        <div className="p-6 pt-0 border-t border-border/50 bg-gray-50/20">
          <form onSubmit={handleAddAdmin} className="space-y-4 animate-slide-up pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                 <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest pl-1 mb-1.5 block">Full Name</label>
                 <input
                   type="text"
                   placeholder="e.g. Rahul Sharma"
                   value={newAdmin.name}
                   onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                   className="form-input h-9 text-xs"
                   required
                 />
              </div>
              <div>
                 <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest pl-1 mb-1.5 block">Work Email</label>
                 <input
                   type="email"
                   placeholder="admin@college.edu"
                   value={newAdmin.email}
                   onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                   className="form-input h-9 text-xs"
                   required
                 />
              </div>
              <div>
                 <label className="text-[10px] uppercase font-bold text-text-secondary tracking-widest pl-1 mb-1.5 block">Secure Password</label>
                 <PasswordInput
                   placeholder="••••••••"
                   value={newAdmin.password}
                   onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                   className="h-9"
                   required
                 />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
               <Button 
                type="button"
                variant="ghost" 
                onClick={() => setShowAddAdmin(false)} 
                className="h-9 text-[11px] font-bold px-4"
               >
                 Cancel
               </Button>
               <Button 
                type="submit" 
                disabled={loading} 
                className="h-9 px-6 text-[11px] font-black shadow-lg shadow-primary/10"
               >
                {loading ? 'Creating Account...' : 'Deploy Admin Account'}
               </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
}

function ProfileField({ label, name, value, editing, onChange, type = "text", className = "", icon }) {
  return (
    <div className={className}>
      <label className="form-label flex items-center gap-2 text-[11px] opacity-70">
        {icon} {label}
      </label>
      {editing ? (
        <input
          type={type}
          className="form-input h-11"
          value={value || ''}
          onChange={(e) => onChange(prev => ({ ...prev, [name]: e.target.value }))}
        />
      ) : (
        <div className="px-1 py-1 font-bold text-text-primary">
           {value || <span className="text-text-secondary/40 font-normal italic">Not provided</span>}
        </div>
      )}
    </div>
  );
}

function ProfileSelectField({ label, name, value, editing, onChange, options, className = "", icon }) {
  return (
    <div className={className}>
      <label className="form-label flex items-center gap-2 text-[11px] opacity-70">
        {icon} {label}
      </label>
      {editing ? (
        <select 
          className="form-input h-11 cursor-pointer"
          value={value || ''}
          onChange={(e) => onChange(prev => ({ ...prev, [name]: e.target.value }))}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="px-1 py-1 font-bold text-text-primary">
          {options.find(o => String(o.value) === String(value))?.label || <span className="text-text-secondary/40 font-normal italic">Not provided</span>}
        </div>
      )}
    </div>
  );
}
