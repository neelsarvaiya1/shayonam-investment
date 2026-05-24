'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Lead = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  consultation_type: string;
  financial_goal: string;
  investment_range: string;
  message: string;
  status: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('id', { ascending: false });

      if (!error) {
        setLeads(data || []);
        setLoading(false);
      }
    }

    if (authorized) {
      fetchLeads();
    }
  }, [authorized]);
  function handleLogin() {
    if (password === 'Shayonam2026') {
      setAuthorized(true);
    } else {
      alert('Wrong password');
    }
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5ef]">
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-[#EFE7DA] w-full max-w-md">
          <h1 className="text-3xl font-serif text-[#162033] mb-6">
            Admin Access
          </h1>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border border-[#EFE7DA] rounded-xl px-4 py-3 mb-4"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-[#162033] text-white py-3 rounded-xl font-medium"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-serif font-bold text-[#162033] mb-8">
          Client Leads
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-3xl shadow-lg border border-[#EFE7DA]">
            <table className="w-full text-left">

              <thead className="bg-[#162033] text-white">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Consultation</th>
                  <th className="p-4">Goal</th>
                  <th className="p-4">Range</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-[#EFE7DA]"
                  >
                    <td className="p-4">{lead.full_name}</td>
                    <td className="p-4">{lead.email}</td>
                    <td className="p-4">{lead.phone}</td>
                    <td className="p-4">{lead.consultation_type}</td>
                    <td className="p-4">{lead.financial_goal}</td>
                    <td className="p-4">{lead.investment_range}</td>
                    <td className="p-4">{lead.message}</td>
                    <td className="p-4">{lead.status}</td>
                    <td className="p-4">
  <div className="flex gap-2">
    <a
      href={`https://wa.me/91${lead.phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
    >
      WhatsApp
    </a>

    <a
      href={`tel:${lead.phone}`}
      className="bg-[#162033] hover:bg-[#0f1728] text-white px-3 py-2 rounded-lg text-sm font-medium transition"
    >
      Call
    </a>
  </div>
</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}