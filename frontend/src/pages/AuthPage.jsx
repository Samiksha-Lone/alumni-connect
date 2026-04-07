import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/useToast';
import axios from 'axios';
import PasswordInput from '../components/ui/PasswordInput';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Mail, Lock, User, GraduationCap, Building2, BookOpen, ArrowRight, X, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const { register, login, loading } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const nav = useNavigate();

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [branch, setBranch] = useState('');
  const [yearOfPassing, setYearOfPassing] = useState('');
  const [company, setCompany] = useState('');
  const [jobRole] = useState('');

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();

    if (!name.trim()) return showError('Please enter your full name');
    if (!email.trim()) return showError('Please enter your email address');
    if (password.length < 6) return showError('Password must be at least 6 characters');
    if (role === 'student' && !yearOfStudy) return showError('Please enter your year of study');
    if (role === 'alumni' && !yearOfPassing) return showError('Please enter your year of passing');

    const payload = { name, email, password, role };
    if (role === 'student') {
      payload.yearOfStudy = yearOfStudy;
      payload.course = branch;
    } else if (role === 'alumni') {
      payload.graduationYear = yearOfPassing;
      payload.courseStudied = branch;
      payload.company = company;
      payload.jobRole = jobRole;
    }

    const res = await register(payload);
    if (!res.ok) {
      showError(res.error || 'Registration failed. Please try again.');
    } else {
      showSuccess('Account created successfully! Welcome');
      setTimeout(() => nav('/profile'), 1500);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!email.trim()) return showError('Please enter your email address');
    if (!password) return showError('Please enter your password');

    const res = await login({ email, password });
    if (!res.ok) {
      showError(res.error || 'Login failed. Please check your credentials.');
    } else {
      showSuccess('Login successful! Redirecting...');
      setTimeout(() => nav('/profile'), 1500);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setForgotLoading(true);
    if (!forgotEmail.trim()) {
      showError('Please enter your email address');
      setForgotLoading(false);
      return;
    }
    try {
      const response = await axios.post('/auth/forgot-password', { email: forgotEmail });
      showSuccess('Reset link sent if account exists');
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
        setShowResetForm(true);
        setForgotEmail('');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setForgotLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) return showError('Passwords do not match');
    if (newPassword.length < 6) return showError('Password must be at least 6 characters');
    setForgotLoading(true);
    try {
      await axios.post(`/auth/reset-password/${resetToken}`, { newPassword, confirmPassword });
      showSuccess('Password reset successful! login now.');
      setTimeout(() => {
        setShowForgotModal(false);
        setShowResetForm(false);
        setResetToken('');
        setMode('login');
      }, 1500);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="section-container min-h-[80vh] flex items-center justify-center py-16">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="heading-lg mb-2">
            {mode === 'login' ? 'Welcome back' : 'Join the community'}
          </h1>
          <p className="text-text-secondary">
            {mode === 'login' 
              ? 'Enter your credentials to access your account' 
              : 'Register to connect with your alma mater'}
          </p>
        </div>

        <Card className="p-8">
          {/* Mode Switcher */}
          <div className="flex p-1 mb-8 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-border">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                mode === 'login' 
                  ? 'bg-white dark:bg-gray-900 shadow-sm text-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${
                mode === 'register' 
                  ? 'bg-white dark:bg-gray-900 shadow-sm text-primary' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="form-label">Are you a...</label>
                  <div className="grid grid-cols-2 gap-3">
                     {['student', 'alumni'].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                            role === r 
                              ? 'bg-primary-soft border-primary/20 text-primary' 
                              : 'bg-transparent border-border text-text-secondary hover:border-primary/20'
                          }`}
                        >
                          {r === 'student' ? <BookOpen size={16} /> : <GraduationCap size={16} />}
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                     ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="form-input pl-10"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="jane@college.edu"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="form-label mb-0">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-bold text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary z-10" size={18} />
                <PasswordInput
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="[&>input]:pl-10"
                />
              </div>
            </div>

            {/* Role-specific fields */}
            {mode === 'register' && (
              <div className="animate-fade-in space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">
                       {role === 'student' ? 'Year of Admission' : 'Year of Passing'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2024"
                      value={role === 'student' ? yearOfStudy : yearOfPassing}
                      onChange={e => role === 'student' ? setYearOfStudy(e.target.value) : setYearOfPassing(e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Branch/Course</label>
                    <input
                      type="text"
                      placeholder="e.g. CSE"
                      value={branch}
                      onChange={e => setBranch(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
                
                {role === 'alumni' && (
                  <div>
                    <label className="form-label">Current Company</label>
                    <div className="relative">
                       <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                       <input
                          type="text"
                          placeholder="e.g. Google"
                          value={company}
                          onChange={e => setCompany(e.target.value)}
                          className="form-input pl-10"
                       />
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 justify-between group mt-4"
            >
              <span>{loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-sm p-8 animate-zoom-in relative">
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-2"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h3 className="heading-md mb-2">Reset Password</h3>
              <p className="text-sm text-text-secondary">
                We'll send a secure link to your email to reset your password.
              </p>
            </div>

            {!showResetForm ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                    className="form-input"
                    placeholder="name@example.com"
                  />
                </div>
                <Button type="submit" disabled={forgotLoading} className="w-full">
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-600 text-xs mb-4 font-medium">
                  <AlertCircle size={16} /> Check your email for the reset code and paste it below.
                </div>
                <div>
                  <label className="form-label">New Password</label>
                  <PasswordInput
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Confirm Password</label>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={forgotLoading} className="w-full">
                  {forgotLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
