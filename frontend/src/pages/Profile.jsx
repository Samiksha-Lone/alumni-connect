import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/useToast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PasswordInput from '../components/ui/PasswordInput';
import { User, Mail, GraduationCap, Building2, BookOpen, FileText, Upload, LogOut, Settings, Plus, ShieldCheck } from 'lucide-react';
import { ProfileSkeleton } from '../components/ui/Skeleton';

export default function Profile() {
  const { user, logout, users, fetchAllUsers } = useAuth();
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
      success('Profile updated successfully! ✅');
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
      await axios.post(`/users/${user._id}/upload-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      success('Resume uploaded successfully! 📄');
      setResumeFile(null);
      fetchAllUsers();
    } catch (err) {
      error(err.response?.data?.message || 'Upload failed');
    } finally {
      setResumeUploading(false);
    }
  };

  return (
    <div className="section-container max-w-5xl">
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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5">
            <h2 className="heading-md mb-4 flex items-center gap-2">
              <User size={18} className="text-primary" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ProfileField icon={<User size={14} />} label="Full Name" name="name" value={form.name} editing={editing} onChange={setForm} />
              <ProfileField icon={<Mail size={14} />} label="Email Address" name="email" value={form.email} editing={editing} onChange={setForm} type="email" />

              {user.role === 'student' && (
                <>
                  <ProfileSelectField
                    icon={<GraduationCap size={14} />}
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
                  <ProfileField icon={<BookOpen size={14} />} label="Course Name" name="course" value={form.course} editing={editing} onChange={setForm} />
                </>
              )}

              {user.role === 'alumni' && (
                <>
                  <ProfileField icon={<GraduationCap size={14} />} label="Graduation Year" name="graduationYear" value={form.graduationYear} editing={editing} onChange={setForm} type="number" />
                  <ProfileField icon={<Building2 size={14} />} label="Current Company" name="company" value={form.company} editing={editing} onChange={setForm} />
                  <ProfileField icon={<BookOpen size={14} />} label="Course Studied" name="courseStudied" value={form.courseStudied} editing={editing} onChange={setForm} className="sm:col-span-2" />
                </>
              )}
            </div>

            {editing && (
              <Button onClick={handleSave} disabled={updating} className="w-full mt-8 h-10 text-xs font-bold">
                {updating ? 'Saving...' : 'Save Profile Changes'}
              </Button>
            )}
          </Card>

          {user.role === 'admin' && (
            <AdminPanel fetchAllUsers={fetchAllUsers} />  
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="heading-md mb-6 flex items-center gap-2">
              <FileText size={18} className="text-primary" /> Career Assets
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-dashed border-border flex flex-col items-center text-center">
                <Upload size={24} className="text-text-secondary mb-3 opacity-50" />
                <p className="text-[10px] text-text-secondary mb-3 uppercase tracking-wider font-bold">Upload Resume (PDF/DOCX)</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  id="resume-upload"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="hidden"
                />
                <label 
                  htmlFor="resume-upload"
                  className="w-full py-2 px-3 rounded-lg border border-border bg-card hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-xs font-bold truncate"
                >
                  {resumeFile ? resumeFile.name : 'Choose file...'}
                </label>
              </div>

              <Button 
                onClick={handleResumeUpload} 
                disabled={!resumeFile || resumeUploading}
                className="w-full h-10 text-xs font-bold"
              >
                {resumeUploading ? 'Uploading...' : 'Upload Resume'}
              </Button>

              {user.resumeUrl && (
                <a 
                  href={user.resumeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-primary-soft text-primary font-bold text-xs hover:bg-primary/10 transition-all border border-primary/10"
                >
                  <FileText size={16} /> View Current Resume
                </a>
              )}
            </div>
          </Card>

          <Card className="p-5 bg-primary-soft/20 border-primary/10">
             <h3 className="text-sm font-bold mb-2">Privacy Tip</h3>
             <p className="text-[11px] text-text-secondary leading-relaxed">
               Keeping your profile updated helps alumni find you for the right opportunities.
             </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ fetchAllUsers }) {
  const { success, error } = useToast();
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

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

  return (
    <Card className="mt-8 p-8 border-primary/20 bg-primary-soft/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h2 className="heading-md flex items-center gap-2">
          <ShieldCheck size={24} className="text-primary" /> Admin Controls
        </h2>
        <Button 
          onClick={() => setShowAddAdmin(!showAddAdmin)} 
          variant={showAddAdmin ? 'secondary' : 'primary'}
          className="h-10 px-6 text-sm"
        >
          {showAddAdmin ? <X size={18} /> : <span className="flex items-center gap-2"><Plus size={18} /> Add Admin</span>}
        </Button>
      </div>
      
      {showAddAdmin && (
        <form onSubmit={handleAddAdmin} className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
               <label className="form-label">Full Name</label>
               <input
                 type="text"
                 placeholder="Admin Name"
                 value={newAdmin.name}
                 onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                 className="form-input"
                 required
               />
            </div>
            <div>
               <label className="form-label">Email</label>
               <input
                 type="email"
                 placeholder="admin@college.edu"
                 value={newAdmin.email}
                 onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                 className="form-input"
                 required
               />
            </div>
            <div>
               <label className="form-label">Password</label>
               <PasswordInput
                 placeholder="••••••••"
                 value={newAdmin.password}
                 onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                 required
               />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12">
            {loading ? 'Creating Account...' : 'Confirm & Create Admin Account'}
          </Button>
        </form>
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
