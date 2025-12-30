import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Check, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';

export function EmailVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, verifyEmail, resendVerification } = useAuth();
  const [resendCountdown, setResendCountdown] = useState(60);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    // If there's a token in URL, auto-verify
    if (token) {
      handleVerify(token);
    }
  }, [token]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleVerify = async (verifyToken: string) => {
    setVerifying(true);
    setError('');
    try {
      await verifyEmail(verifyToken);
      setVerified(true);
      setTimeout(() => {
        navigate('/onboarding');
      }, 2000);
    } catch (err) {
      setError('Verification link is invalid or expired. Please request a new one.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification();
      setResendSuccess(true);
      setResendCountdown(60);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      setError('Failed to resend email. Please try again.');
    }
  };

  const handleChangeEmail = () => {
    // In a real app, would show a modal to change email
    navigate('/signup');
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Email Verified Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Welcome to PhD Reader, {user?.fullName}!
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Your account is now fully activated.
          </p>
          <Button asChild className="w-full">
            <Link to="/onboarding">
              Continue to Dashboard →
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 max-w-md w-full"
      >
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-[#2563EB]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We sent a verification link to:
          </p>
          <p className="font-medium text-gray-900 mt-2">
            {user?.email || 'your email address'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {resendSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-start gap-2">
            <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Verification email sent! Check your inbox.</span>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 mb-3">
            Check your inbox and click the link to activate your account.
          </p>
          <p className="text-sm text-gray-600 font-medium mb-1">Didn't receive it?</p>
          <ul className="text-sm text-gray-600 space-y-1 ml-4">
            <li>• Check spam/junk folder</li>
            <li>• Wait 2-3 minutes for delivery</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={resendCountdown > 0}
          >
            {resendCountdown > 0
              ? `Resend available in ${resendCountdown}s`
              : 'Resend Verification Email'}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={handleChangeEmail}
          >
            Wrong email? Change Email Address
          </Button>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-3">
              (Some features limited until verified)
            </p>
            <Button
              variant="ghost"
              className="w-full text-[#2563EB]"
              asChild
            >
              <Link to="/projects">
                I'll Verify Later - Continue to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
