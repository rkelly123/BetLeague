'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { League } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function LeagueDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [league, setLeague] = useState<League | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else {
      fetchLeague();
    }
  }, [user]);

  const fetchLeague = async () => {
    try {
      const res = await axios.get(`/leagues/${id}`);
      setLeague(res.data);
    } catch (err) {
      alert('Failed to fetch league: ' + err);
    }
  };

  const handleLeave = async () => {
    try {
      await axios.post(`/leagues/${id}/leave`);
      router.replace('/dashboard');
    } catch (err) {
      alert('Failed to leave league: ' + err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/leagues/${id}`);
      router.replace('/dashboard');
    } catch (err) {
      alert('Failed to delete league: ' + err);
    }
  };

  if (!league) return <div>Loading...</div>;

  const isOwner = user?.id === league.owner.id;

  return (
    <div>
      <h1>{league.name}</h1>
      <h2>League ID: {league.id}</h2>
      <p>{league.description}</p>
      <p><strong>Owner:</strong> {league.owner.username}</p>

      <h3>Members:</h3>
      <ul>
        {league.members.map((member) => (
          <li key={member.id}>{member.username}</li>
        ))}
      </ul>

      {!isOwner && <button onClick={handleLeave}>Leave League</button>}
      {isOwner && <button onClick={handleDelete}>Delete League</button>}
    </div>
  );
}
