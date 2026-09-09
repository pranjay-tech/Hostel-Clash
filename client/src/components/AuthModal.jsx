import React, { useState } from 'react';
import { X, Lock, Key, Shield, UserCheck, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'member',
  onMemberSuccess,
  onAdminSuccess,
  loginMemberFn,
  verifyAdminPasskeyFn
}) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(initialMode);
  const [accessKey, setAccessKey] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupMemberName, setSetupMemberName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    if (!accessKey.trim()) {
      setError('Please enter your Member Access Key.');
      return;
    }

    if (needsSetup) {
      if (!password || password.length < 3) {
        setError('Password must be at least 3 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify.');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');

      const res = await loginMemberFn(accessKey.trim(), password);

      if (!res.success) {
        setError(res.error || 'Authentication failed');
        return;
      }

      if (res.needsPasswordSetup) {
        setNeedsSetup(true);
        setSetupMemberName(res.member?.name || 'Member');
        setSuccessMsg(res.message);
        return;
      }

      setSuccessMsg(res.message || 'Logged in successfully.');
      setTimeout(() => {
        onMemberSuccess(res.member);
        onClose();
      }, 500);

    } catch (err) {
      setError(err.message || 'Network error during login');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setError('Please enter the Admin Passkey.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMsg('');

      const res = await verifyAdminPasskeyFn(adminKey.trim());

      if (!res.success) {
        setError(res.error || 'Invalid Admin Passkey. Access Denied.');
        return;
      }

      setSuccessMsg('Admin mode active. Full edit access granted.');
      setTimeout(() => {
        onAdminSuccess(adminKey.trim());
        onClose();
      }, 500);

    } catch (err) {
      setError(err.message || 'Verification error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div className="modal-container p-6 sm:p-7 w-full max-w-sm animate-fade-in">
        
        {/* Header with Switcher Tabs */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#242B36]">
          <div className="flex items-center gap-1 bg-[#080A0F] p-1 rounded-lg border border-[#242B36] text-xs">
            <button
              onClick={() => { setMode('member'); setError(''); setSuccessMsg(''); }}
              className={`px-3 py-1 rounded font-medium transition ${
                mode === 'member' ? 'bg-[#151A23] text-[#F3F5F7]' : 'text-[#8B96A8] hover:text-[#F3F5F7]'
              }`}
            >
              Member Sign In
            </button>
            <button
              onClick={() => { setMode('admin'); setError(''); setSuccessMsg(''); }}
              className={`px-3 py-1 rounded font-medium transition ${
                mode === 'admin' ? 'bg-[#151A23] text-[#F59E0B]' : 'text-[#8B96A8] hover:text-[#F59E0B]'
              }`}
            >
              Admin Unlock
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-[#8B96A8] hover:text-[#F3F5F7] p-1 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {mode === 'member' ? (
          <form onSubmit={handleMemberSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-[#8B96A8] font-medium mb-1">
                Member Access Key
              </label>
              <input
                id="input-member-key"
                type="text"
                placeholder="e.g. pranjay154, abhishek154, salil264..."
                value={accessKey}
                disabled={needsSetup}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full bg-[#151A23] border border-[#242B36] rounded-lg px-3 py-2 text-sm text-[#F3F5F7] font-mono focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            {needsSetup ? (
              <div className="p-3 rounded-lg bg-[#151A23] border border-[#242B36] space-y-3">
                <div className="text-xs font-semibold text-[#38BDF8]">
                  First-time password setup for {setupMemberName}
                </div>
                <div>
                  <label className="block text-[#8B96A8] font-medium mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#080A0F] border border-[#242B36] rounded-lg px-3 py-2 text-sm text-[#F3F5F7] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
                <div>
                  <label className="block text-[#8B96A8] font-medium mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm password..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#080A0F] border border-[#242B36] rounded-lg px-3 py-2 text-sm text-[#F3F5F7] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[#8B96A8] font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="input-member-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter personal password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#151A23] border border-[#242B36] rounded-lg px-3 py-2 text-sm text-[#F3F5F7] focus:outline-none focus:border-[#38BDF8] pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F6A7A] hover:text-[#F3F5F7]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              id="btn-submit-member-login"
              type="submit"
              disabled={loading}
              className="w-full btn-cyan justify-center mt-3"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{loading ? 'Verifying...' : needsSetup ? 'Save Password & Enter' : 'Sign In'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleAdminSubmit} className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-[#151A23] border border-[#242B36] text-[#8B96A8]">
              <div className="font-semibold text-[#F59E0B] flex items-center gap-1.5 mb-0.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Passkey</span>
              </div>
              <p className="text-[11px]">
                Exclusive upload and edit privileges for Pranjay.
              </p>
            </div>

            <div>
              <label className="block text-[#8B96A8] font-medium mb-1">
                Passkey
              </label>
              <div className="relative">
                <input
                  id="input-admin-passkey"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin passkey..."
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full bg-[#151A23] border border-[#242B36] rounded-lg px-3 py-2 text-sm text-[#F3F5F7] font-mono focus:outline-none focus:border-[#F59E0B] pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5F6A7A] hover:text-[#F3F5F7]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              id="btn-submit-admin-unlock"
              type="submit"
              disabled={loading}
              className="w-full btn-cyan justify-center mt-3"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{loading ? 'Authenticating...' : 'Unlock Admin'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
