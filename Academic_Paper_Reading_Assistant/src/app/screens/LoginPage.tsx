import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { FormInput } from '../components/auth/FormInput';
import { SocialLoginButton } from '../components/auth/SocialLoginButton';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithProvider, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // If user is already logged in, redirect to projects
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/projects';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSocialLogin = async (provider: 'google-scholar' | 'orcid' | 'institution') => {
    setLoading(true);
    setError('');
    try {
      await loginWithProvider(provider);
      toast.success('Successfully logged in!');
      const from = (location.state as any)?.from?.pathname || '/projects';
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to connect. Please try again.');
      toast.error('Failed to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (loginAttempts >= 5) {
      setError('Too many failed attempts. Please try again in 15 minutes or reset your password.');
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      toast.success('Welcome back!');
      const from = (location.state as any)?.from?.pathname || '/projects';
      navigate(from, { replace: true });
    } catch (err: any) {
      setLoginAttempts(prev => prev + 1);
      const attemptsLeft = 5 - (loginAttempts + 1);
      
      if (attemptsLeft <= 0) {
        setError('Too many failed attempts. Account temporarily locked. Try again in 15 minutes.');
      } else if (attemptsLeft <= 2) {
        setError(`Email or password incorrect. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining.`);
      } else {
        setError('Email or password incorrect. Please try again.');
      }
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Show demo credentials hint
  const showDemoHint = formData.email === '' && formData.password === '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-[#2563EB]" />
            <span className="font-semibold text-xl">PhD Reader</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Don't have an account?</span>
            <Button variant="ghost" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
              <p className="text-gray-600">Continue your research</p>
            </div>

            <div className="h-px bg-gray-200 mb-8" />

            {/* Demo credentials hint */}
            {showDemoHint && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Demo Credentials</p>
                    <p className="text-blue-700">
                      Email: <code className="bg-blue-100 px-1 rounded">demo@stanford.edu</code>
                      <br />
                      Password: <code className="bg-blue-100 px-1 rounded">password</code>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-700 mb-3">Continue with:</p>
              <SocialLoginButton
                provider="google-scholar"
                onClick={() => handleSocialLogin('google-scholar')}
                disabled={loading}
              />
              <SocialLoginButton
                provider="orcid"
                onClick={() => handleSocialLogin('orcid')}
                disabled={loading}
              />
              <SocialLoginButton
                provider="institution"
                onClick={() => handleSocialLogin('institution')}
                disabled={loading}
              />
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="you@university.edu"
                required
                autoFocus
                disabled={loading || loginAttempts >= 5}
              />

              <FormInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading || loginAttempts >= 5}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm text-[#2563EB] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11" 
                disabled={loading || loginAttempts >= 5}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#2563EB] hover:underline font-medium">
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}