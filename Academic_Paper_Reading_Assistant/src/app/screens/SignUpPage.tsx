import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { FormInput } from '../components/auth/FormInput';
import { PasswordStrengthMeter } from '../components/auth/PasswordStrengthMeter';
import { SocialLoginButton } from '../components/auth/SocialLoginButton';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function SignUpPage() {
  const navigate = useNavigate();
  const { signup, loginWithProvider, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'phd_candidate' as const,
    researchField: '',
    agreedToTerms: false,
    marketingOptIn: false,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // If user is already logged in, redirect to projects
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/projects', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email: string) => {
    const academicDomains = ['.edu', '.ac.uk', '.ac.', '.edu.'];
    const isAcademic = academicDomains.some(domain => email.toLowerCase().includes(domain));
    
    if (!email) return '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    if (!isAcademic) {
      return ''; // Will show warning instead
    }
    return '';
  };

  const getEmailWarning = (email: string) => {
    const academicDomains = ['.edu', '.ac.uk', '.ac.', '.edu.'];
    const isAcademic = academicDomains.some(domain => email.toLowerCase().includes(domain));
    
    if (email && !isAcademic && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Academic email recommended for full features';
    }
    return '';
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSocialLogin = async (provider: 'google-scholar' | 'orcid' | 'institution') => {
    setLoading(true);
    try {
      await loginWithProvider(provider);
      toast.success('Successfully connected!');
      navigate('/onboarding');
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
    
    // Validate
    const errors: Record<string, string> = {};
    if (!formData.fullName) errors.fullName = 'Full name is required';
    if (!formData.email) errors.email = 'Email is required';
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }
    if (!formData.agreedToTerms) {
      errors.terms = 'You must agree to the Terms of Service';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await signup(formData);
      toast.success('Account created successfully! Please check your email.');
      navigate('/email-verification');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
      toast.error(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <span className="text-sm text-gray-600">Already have an account?</span>
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
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
              <h1 className="text-2xl font-bold mb-2">Create Your Research Account</h1>
              <p className="text-gray-600">Start organizing your PhD reading</p>
            </div>

            <div className="h-px bg-gray-200 mb-8" />

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <p className="text-sm text-gray-700 mb-3">Quick sign up with:</p>
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
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Sarah Chen"
                required
                error={validationErrors.fullName}
                autoFocus
              />

              <FormInput
                label="Academic Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="you@university.edu"
                required
                error={validationErrors.email}
                warning={getEmailWarning(formData.email)}
                info="Use .edu or institutional email"
              />

              <div>
                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Create a strong password"
                  required
                  error={validationErrors.password}
                />
                {formData.password && (
                  <div className="mt-3">
                    <PasswordStrengthMeter password={formData.password} />
                  </div>
                )}
              </div>

              <FormInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Re-enter your password"
                required
                error={validationErrors.confirmPassword}
                success={formData.confirmPassword && formData.password === formData.confirmPassword ? 'Passwords match' : ''}
              />

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">I am a: *</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => handleInputChange('role', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phd_candidate" id="phd" />
                    <Label htmlFor="phd" className="font-normal cursor-pointer">PhD Candidate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="masters" id="masters" />
                    <Label htmlFor="masters" className="font-normal cursor-pointer">Master's Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="postdoc" id="postdoc" />
                    <Label htmlFor="postdoc" className="font-normal cursor-pointer">Postdoc Researcher</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="faculty" id="faculty" />
                    <Label htmlFor="faculty" className="font-normal cursor-pointer">Faculty / PI</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="font-normal cursor-pointer">Other Researcher</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="research-field" className="text-sm font-medium text-gray-700">
                  Research Field (optional)
                </Label>
                <Select value={formData.researchField} onValueChange={(value) => handleInputChange('researchField', value)}>
                  <SelectTrigger id="research-field">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="psychology">Psychology</SelectItem>
                    <SelectItem value="economics">Economics</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreedToTerms', checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
                    I agree to the{' '}
                    <a href="#" className="text-[#2563EB] hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-[#2563EB] hover:underline">Privacy Policy</a>
                  </Label>
                </div>
                {validationErrors.terms && (
                  <p className="text-sm text-red-600">{validationErrors.terms}</p>
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={formData.marketingOptIn}
                    onCheckedChange={(checked) => handleInputChange('marketingOptIn', checked as boolean)}
                  />
                  <Label htmlFor="marketing" className="text-sm font-normal leading-tight cursor-pointer">
                    Send me research tips & updates
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#2563EB] hover:underline font-medium">
                Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}