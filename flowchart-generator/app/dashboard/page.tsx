'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/Layout/AppLayout';

interface FlowChart {
  id: string;
  title: string;
  updatedAt: string;
  lastExported: string | null;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [flowCharts, setFlowCharts] = useState<FlowChart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    // Load user's flow charts
    if (status === 'authenticated') {
      // This would typically fetch from your API
      // For now, we'll use mock data
      const mockFlowCharts = [
        {
          id: '1',
          title: 'Project Workflow',
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          lastExported: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          title: 'User Registration Process',
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          lastExported: null,
        },
        {
          id: '3',
          title: 'API Integration Flow',
          updatedAt: new Date().toISOString(),
          lastExported: new Date().toISOString(),
        },
      ];
      
      setFlowCharts(mockFlowCharts);
      setIsLoading(false);
    }
  }, [status, router]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Flow Charts</h1>
          <Link href="/create" className="btn-primary">
            Create New
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : flowCharts.length > 0 ? (
          <div className="bg-light-darker dark:bg-dark-lighter rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead className="bg-light dark:bg-dark">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Exported
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-light-darker dark:bg-dark-lighter divide-y divide-gray-300 dark:divide-gray-700">
                {flowCharts.map((flowChart) => (
                  <tr key={flowChart.id} className="hover:bg-light dark:hover:bg-dark">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{flowChart.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(flowChart.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {flowChart.lastExported ? formatDate(flowChart.lastExported) : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link 
                        href={`/create/${flowChart.id}`}
                        className="text-primary-dark hover:text-primary inline-block mr-4"
                      >
                        Edit
                      </Link>
                      <button className="text-red-500 hover:text-red-700 inline-block">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-light-darker dark:bg-dark-lighter rounded-lg p-12 text-center">
            <h3 className="text-xl font-medium mb-2">No Flow Charts Yet</h3>
            <p className="text-dark-lighter dark:text-light-darker mb-6">
              Create your first flow chart to get started
            </p>
            <Link href="/create" className="btn-primary">
              Create Flow Chart
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}