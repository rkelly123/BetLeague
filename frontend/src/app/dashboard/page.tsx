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
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
        >
          Logout
        </button>
      </div>

      {/* Join League */}
      <section className="bg-zinc-800 p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Join a League</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 w-full"
            placeholder="Enter League ID"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
          />
          <button
            onClick={handleJoin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Join
          </button>
        </div>
        {joinError && <p className="text-red-400 text-sm">{joinError}</p>}
        {joinMessage && <p className="text-green-400 text-sm">{joinMessage}</p>}
      </section>

      {/* Create League */}
      <section className="bg-zinc-800 p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Create a League</h2>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            Create New League
          </button>
        ) : (
          <div className="space-y-3">
            <input
              className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 w-full"
              placeholder="League Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              className="bg-zinc-700 border border-zinc-600 rounded-lg px-4 py-2 w-full"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                Create
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      {/* My Leagues */}
      <section className="bg-zinc-800 p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-xl font-semibold">My Leagues</h2>
        {leagues.length > 0 ? (
          <ul className="space-y-2">
            {leagues.map((league) => (
              <li
                key={league.id}
                onClick={() => router.push(`/dashboard/leagues/${league.id}`)}
                className="cursor-pointer hover:bg-zinc-700 transition px-4 py-2 rounded-lg"
              >
                <span className="font-medium">{league.name}</span>
                <span className="text-zinc-400 ml-2 text-sm">[ID: {league.id}]</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-400">You haven't joined any leagues yet.</p>
        )}
      </section>
    </main>
  );
}