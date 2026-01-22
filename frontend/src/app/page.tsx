import type { Metadata } from 'next';
import Link from 'next/link';
import { TrendingUp, PieChart, Shield, BarChart3, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'WOXA Wealth Tracker - Grow Your Wealth Faster',
  description:
    'Track your investment portfolio, monitor profit/loss in real-time, and visualize your asset allocation. Start managing your wealth smarter today.',
};

// Feature data
const features = [
  {
    icon: TrendingUp,
    title: 'Real-time Tracking',
    description:
      'Monitor your portfolio performance with live price updates and instant profit/loss calculations.',
  },
  {
    icon: PieChart,
    title: 'Asset Allocation',
    description:
      'Visualize your investment distribution with interactive charts to maintain a balanced portfolio.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Your financial data is protected with industry-standard security measures and encryption.',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description:
      'Get detailed insights into your investment performance with comprehensive analytics.',
  },
];

// Testimonials data
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Individual Investor',
    content:
      'WOXA has transformed how I track my investments. The real-time updates and beautiful charts make portfolio management a breeze.',
  },
  {
    name: 'Michael Chen',
    role: 'Day Trader',
    content:
      'Finally, a wealth tracker that is both powerful and easy to use. I can see all my assets in one place.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Financial Advisor',
    content:
      'I recommend WOXA to all my clients. It helps them stay on top of their investments effortlessly.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">WOXA</span>
              <span className="ml-2 text-gray-600">Wealth Tracker</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Grow Your Wealth{' '}
              <span className="text-primary-600">Faster with WOXA</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Track your investment portfolio, monitor profit and loss in real-time,
              and make smarter financial decisions with our powerful wealth tracking platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="btn-primary text-lg px-8 py-3"
              >
                Start Tracking Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/auth/login"
                className="btn-secondary text-lg px-8 py-3"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Manage Your Income, Simply
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to track and grow your investment portfolio in one place.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <article key={index} className="card text-center hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-600 mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of investors who trust WOXA for their portfolio tracking.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <article key={index} className="card">
                <p className="text-gray-600 mb-4 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Have Questions? Get Started Today
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join WOXA and take control of your financial future.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Create Free Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-2xl font-bold text-white">WOXA</span>
              <span className="ml-2">Wealth Tracker</span>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} WOXA Wealth Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
