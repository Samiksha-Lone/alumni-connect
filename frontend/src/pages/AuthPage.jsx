import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/useToast';
import { authService } from '../services/auth.service';
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Please enter a valid email address');
    if (password.length < 6) return showError('Password must be at least 6 characters');
    if (password.length > 72) return showError('Password is too long');
    if (role === 'student' && !yearOfStudy) return showError('Please enter your year of study');
    if (role === 'alumni' && !yearOfPassing) return showError('Please enter your year of passing');
    if (role === 'student' && !branch.trim()) return showError('Please enter your branch or course');
    if (role === 'alumni' && !branch.trim()) return showError('Please enter your course or specialization');
    if (role === 'alumni' && !company.trim()) return showError('Please enter your company name');

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Please enter a valid email address');
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
    setResetToken(''); // Clear any previous or stale code
    try {
      const response = await authService.forgotPassword(forgotEmail);
      showSuccess(response.message);
      setShowResetForm(true);
    } catch (err) {
      showError(err.message || 'Failed to request reset.');
    } finally {
      setForgotLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) return showError('Passwords do not match');
    setForgotLoading(true);
    try {
      await authService.resetPassword({ email: forgotEmail, resetCode: resetToken, newPassword });
      showSuccess('Password reset successful! Please login.');
      setTimeout(() => {
        setShowForgotModal(false);
        setShowResetForm(false);
        setMode('login');
      }, 1500);
    } catch (err) {
      showError(err.message || 'Invalid code or password reset failed.');
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="section-container min-h-[80vh] flex items-center justify-center py-16">
      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-1.5">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-text-secondary">
            {mode === 'login'
              ? 'Sign in to access alumni, opportunities, and events'
              : 'Join the network of students and alumni from your institution'}
          </p>
        </div>

        <Card className="p-6 md:p-8">
          {/* Mode Switcher */}
          <div className="flex p-1 mb-6 bg-gray-100 border rounded-xl dark:bg-gray-800/60 border-border">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-gray-900 shadow-sm text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
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
                  <label className="block mb-2 text-xs form-label text-text-secondary">I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['student', 'alumni'].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                          role === r
                            ? 'bg-primary-soft border-primary/30 text-primary'
                            : 'bg-transparent border-border text-text-secondary hover:border-primary/20 hover:text-text-primary'
                        }`}
                      >
                        {r === 'student' ? <BookOpen size={15} /> : <GraduationCap size={15} />}
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">Full Name</label>
                  <div className="relative">
                    <User className="absolute -translate-y-1/2 left-3 top-1/2 text-text-secondary" size={18} />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="pl-10 form-input"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute -translate-y-1/2 left-3 top-1/2 text-text-secondary" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 form-input"
                  placeholder="jane@college.edu"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="mb-0 form-label">Password</label>
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
                <Lock className="absolute z-10 -translate-y-1/2 left-3 top-1/2 text-text-secondary" size={18} />
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
              <div className="space-y-4 animate-fade-in">
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
                       <Building2 className="absolute -translate-y-1/2 left-3 top-1/2 text-text-secondary" size={18} />
                       <input
                          type="text"
                          placeholder="e.g. Google"
                          value={company}
                          onChange={e => setCompany(e.target.value)}
                          className="pl-10 form-input"
                       />
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="justify-between w-full mt-2 h-11 group"
            >
              <span>{loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Button>

            <p className="pt-1 text-xs text-center text-text-secondary">
              {mode === 'login' ? (
                <>New here?{' '}<button type="button" onClick={() => setMode('register')} className="font-semibold text-primary hover:underline">Create an account</button></>
              ) : (
                <>Already have an account?{' '}<button type="button" onClick={() => setMode('login')} className="font-semibold text-primary hover:underline">Sign in</button></>
              )}
            </p>
          </form>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="relative w-full max-w-sm p-8 animate-zoom-in">
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute p-2 top-4 right-4 text-text-secondary hover:text-text-primary"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h3 className="mb-2 heading-md">Reset Password</h3>
              <p className="text-sm text-text-secondary">
                We'll send a secure link to your email to reset your password.
              </p>
            </div>

            {!showResetForm ? (
              <form onSubmit={handleForgotPassword} className="space-y-4" autoComplete="off">
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                    className="form-input"
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                </div>
                <Button type="submit" disabled={forgotLoading} className="w-full">
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4" autoComplete="off">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-600 text-[11px] mb-4 font-medium leading-tight">
                  <AlertCircle size={14} className="shrink-0" />
                  Enter the 6-digit code we just sent to your email address.
                </div>
                <div>
                  <label className="form-label">Recovery Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={resetToken}
                    onChange={e => setResetToken(e.target.value)}
                    required
                    className="form-input text-center tracking-[0.5em] font-mono text-lg"
                    placeholder="000000"
                    autoComplete="one-time-code"
                  />
                </div>
                <div>
                  <label className="text-xs form-label">New Password</label>
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
