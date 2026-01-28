'use client';

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import AddUser from './AddUser';

export interface User {
  id: number;
  name: string;
  email: string;
}

export default function UsersPage() {
  const { data, error, isLoading, mutate } = useSWR<User[]>('/api/users', fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 10000, // 10 seconds
  });

  if (error) return <div className="text-red-600 p-4">Failed to load users.</div>;
  if (isLoading) return <div className="p-4">Loading users...</div>;

  return (
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <AddUser onSuccess={() => mutate()} />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          {data?.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <div className="space-y-4">
              {data?.map((user) => (
                <div key={user.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className="text-sm text-gray-500">ID: {user.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}