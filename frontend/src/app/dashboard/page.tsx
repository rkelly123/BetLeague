'use client'; 

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { League } from '@/types';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [joinId, setJoinId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [joinMessage, setJoinMessage] = useState('');
  const [joinError, setJoinError] = useState('');

  // If no user, push to /login.
  useEffect(() => {
    if (!user) router.replace('/login');
    else fetchLeagues();
  }, [user, router]);

  const fetchLeagues = async () => {
    const res = await axios.get('/leagues');
    setLeagues(res.data);
  };

  const handleJoin = async () => {
    setJoinError('');
    setJoinMessage('');

    try {
      await axios.post(`/leagues/${joinId}/join`);
      setJoinMessage('Successfully joined the league!');
      setJoinId('');
      fetchLeagues();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response) {
        const detail = err.response.data.detail;

        if (detail === 'League not found') {
          setJoinError('League not found.');
        } else if (detail === 'Already in league') {
          setJoinError('You are already a member of this league.');
        } else if (detail === 'Not allowed to join this league') {
          setJoinError('You are not allowed to join this league.');
        } else {
          setJoinError('Failed to join league.');
        }
      } else {
        setJoinError('Network or server error.');
      }
    }
  };

  const handleCreate = async () => {
    await axios.post('/leagues', formData);
    setShowForm(false);
    setFormData({ name: '', description: '' });
    fetchLeagues();
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>

      <div className="border p-3 rounded">
        <h2 className="text-lg font-semibold mb-2">Join League</h2>
        <input
          className="border p-1 mr-2"
          value={joinId}
          onChange={(e) => setJoinId(e.target.value)}
          placeholder="League ID"
        />
        <button onClick={handleJoin} className="bg-blue-500 text-white px-3 py-1 rounded">Join</button>

        {joinError && <p className="text-red-500 mt-2">{joinError}</p>}
        {joinMessage && <p className="text-green-600 mt-2">{joinMessage}</p>}
      </div>

      <div className="border p-3 rounded">
        <h2 className="text-lg font-semibold mb-2">Create League</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="bg-green-500 text-white px-3 py-1 rounded">Create League</button>
        )}
        {showForm && (
          <div className="space-y-2">
            <input
              className="border p-1 w-full"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              className="border p-1 w-full"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="space-x-2">
              <button onClick={handleCreate} className="bg-green-500 text-white px-3 py-1 rounded">Create</button>
              <button onClick={() => setShowForm(false)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="border p-3 rounded">
        <h2 className="text-lg font-semibold mb-2">My Leagues</h2>
        {leagues.map((league) => (
          <div
            key={league.id}
            className="cursor-pointer hover:underline"
            onClick={() => router.push(`/dashboard/leagues/${league.id}`)}
          >
            {league.name}
          </div>
        ))}
      </div>
    </div>
  );
}

