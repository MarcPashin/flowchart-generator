'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      router.push('/login?registered=true');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto bg-light-darker dark:bg-dark-lighter p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-dark dark:text-white">Create an Account</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark dark:text-light mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-darker text-dark dark:text-white"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark dark:text-light mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-darker text-dark dark:text-white"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark dark:text-light mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-darker text-dark dark:text-white"
              required
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark dark:text-light mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-dark-darker text-dark dark:text-white"
              required
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`btn-primary w-full ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-dark-lighter dark:text-light-darker">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-primary-dark hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}