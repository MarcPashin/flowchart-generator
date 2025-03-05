import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';

export default function Home() {
  return (
    <AppLayout>
      <div className="relative min-h-screen">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-[30%] -right-[20%] w-[70%] h-[70%] rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Create Beautiful Flow Charts with Ease
            </h1>
            
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our intuitive flow chart generator simplifies the process of visualizing workflows, 
              algorithms, and business processes. Just select a path, add information, and 
              let our platform handle the layout automatically.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/80 backdrop-blur-sm dark:bg-dark-lighter/80 p-8 rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Button-Driven Interface
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Create flow charts effortlessly with our intuitive button interface.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm dark:bg-dark-lighter/80 p-8 rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Customizable Colors
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Match your brand with custom color schemes and styles.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm dark:bg-dark-lighter/80 p-8 rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Automated Layout
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Smart auto-arrangement for clean, readable flow charts.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm dark:bg-dark-lighter/80 p-8 rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 transform hover:-translate-y-1">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Export Options
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Download as high-quality PNG images with transparent backgrounds.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link 
              href="/create" 
              className="inline-flex items-center px-8 py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              Start Creating
            </Link>
            <Link 
              href="/login" 
              className="inline-flex items-center px-8 py-4 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}