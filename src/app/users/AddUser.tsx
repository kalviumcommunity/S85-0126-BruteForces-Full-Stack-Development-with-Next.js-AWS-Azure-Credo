'use client';

import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { fetcher } from '@/lib/fetcher';
import { User } from './page';

interface AddUserProps {
  onSuccess: () => void;
}

export default function AddUser({ onSuccess }: AddUserProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser = { name, email, id: Date.now() };
    
    try {
      setIsLoading(true);
      
      // Optimistic update
      mutate(
        '/api/users',
        async (users: User[] = []) => [...users, newUser],
        false
      );

      // Reset form
      setName('');
      setEmail('');

      // Make API call
      await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      // Revalidate and refresh the data
      mutate('/api/users');
      onSuccess();
    } catch (error) {
      console.error('Failed to add user:', error);
      // Revert optimistic update on error
      mutate('/api/users');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter name"
          required
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter email"
          required
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Adding...' : 'Add User'}
        </button>
      </div>
    </form>
  );
}
