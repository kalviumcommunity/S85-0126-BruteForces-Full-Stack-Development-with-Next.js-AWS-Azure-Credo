'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface DatabaseInfo {
  server_time: string;
  version: string;
  current_database: string;
  current_user: string;
  userCount?: number;
}

export default function DatabaseStatusPage() {
  const { data, error, isLoading, mutate } = useSWR<DatabaseInfo>('/api/test-db', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateOnFocus: true,
  });

  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  useEffect(() => {
    setLastChecked(new Date());
  }, [data]);

  const handleRefresh = () => {
    mutate();
  };

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Database Status</h1>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Testing database connection...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h2 className="text-red-800 font-semibold mb-2">❌ Connection Failed</h2>
            <p className="text-red-600">{error.message || 'Failed to connect to database'}</p>
          </div>
        )}

        {data && !error && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h2 className="text-green-800 font-semibold mb-2">✅ Connected Successfully</h2>
              <p className="text-green-600">Database is accessible and responding</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="font-semibold text-gray-700 mb-2">Database Information</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Database Name:</dt>
                    <dd className="text-sm text-gray-900">{data.current_database || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Current User:</dt>
                    <dd className="text-sm text-gray-900">{data.current_user || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Server Time:</dt>
                    <dd className="text-sm text-gray-900">
                      {data.server_time ? new Date(data.server_time).toLocaleString() : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="font-semibold text-gray-700 mb-2">System Information</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">PostgreSQL Version:</dt>
                    <dd className="text-sm text-gray-900 truncate" title={data.version}>
                      {data.version ? data.version.split(' ')[0] : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">User Count:</dt>
                    <dd className="text-sm text-gray-900">{data.userCount || 0} users</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Checked:</dt>
                    <dd className="text-sm text-gray-900">{lastChecked.toLocaleString()}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-semibold text-blue-800 mb-2">📊 Connection Details</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Auto-refresh every 30 seconds</p>
                <p>• Revalidates on window focus</p>
                <p>• Using SWR for efficient caching</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
