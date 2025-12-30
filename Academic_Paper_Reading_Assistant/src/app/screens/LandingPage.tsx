import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Check, Upload, Sparkles, Network, ArrowRight, Play, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to projects
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/projects');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-[#2563EB]" />
            <span className="font-semibold text-xl">PhD Reader</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Start Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Read Research Papers{' '}
            <span className="text-[#2563EB]">3x Faster</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-8"
          >
            AI-powered citation analysis and knowledge mapping for PhD candidates and researchers
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <Link to="/signup">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              <Play className="w-4 h-4 mr-2" />
              Watch Demo (2 min)
            </Button>
          </motion.div>
          
          {/* Feature bullets */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-700"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Instant citation summaries</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Knowledge trees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Project management</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Literature reviews</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758708536050-e911f468ea83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbml6ZWQlMjByZXNlYXJjaCUyMHdvcmtzcGFjZXxlbnwxfHx8fDE3NjcxMjM2MDB8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="PhD Reader Interface"
            className="w-full h-auto"
          />
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-center text-3xl font-bold mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Upload Papers</h3>
              <p className="text-gray-600">
                Drop your PDFs or import from your reference manager. Works with any paper format.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. AI Analyzes</h3>
              <p className="text-gray-600">
                Our AI extracts citations, builds knowledge graphs, and identifies key concepts automatically.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-6">
                <Network className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Build Knowledge</h3>
              <p className="text-gray-600">
                See your understanding grow as an interactive tree. Export literature reviews instantly.
              </p>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-700 italic">
              "Just upload your PDFs and start reading with instant context for every citation"
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-center text-3xl font-bold mb-12">Trusted by PhD Candidates</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl border border-gray-200 p-8"
            >
              <div className="flex items-start gap-4 mb-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758685734511-4f49ce9a382b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
                  alt="Sarah Chen"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-sm text-gray-600">Stanford CS PhD</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Reduced my literature review time from 3 months to 6 weeks. The knowledge tree feature is a game-changer for understanding how concepts connect across papers."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-8"
            >
              <div className="flex items-start gap-4 mb-4">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
                  alt="James Liu"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold">James Liu</div>
                  <div className="text-sm text-gray-600">MIT Biology PhD</div>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Finally understand citation networks in my field. The AI summaries save me hours of reading tangential papers just to understand one reference."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#2563EB] to-[#7C3AED] py-20">
        <div className="max-w-4xl mx-auto px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Free for 14 days, no credit card required
          </p>
          <Button size="lg" variant="secondary" className="h-12 px-8 text-base bg-white text-[#2563EB] hover:bg-gray-100" asChild>
            <Link to="/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">About</a>
            <a href="#" className="hover:text-gray-900">Features</a>
            <a href="#" className="hover:text-gray-900">Pricing</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Privacy</a>
          </div>
          <div className="text-center mt-8 text-sm text-gray-500">
            © 2025 PhD Reader. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}