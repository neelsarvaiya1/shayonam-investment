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
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('id', { ascending: false });

      console.log('SUPABASE DATA:', data);
      console.log('SUPABASE ERROR:', error);

      if (error) {
        console.error(error);
        return;
      }

      setLeads(data || []);
      setLoading(false);
    }

    fetchLeads();
  }, []);
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
                    className="border-b border-[#EFE7DA] hover:bg-[#faf7f2]"
                  >
                    <td className="p-4 font-medium">
                      {lead.full_name}
                    </td>

                    <td className="p-4">
                      {lead.email}
                    </td>

                    <td className="p-4">
                      {lead.phone}
                    </td>

                    <td className="p-4">
                      {lead.consultation_type}
                    </td>

                    <td className="p-4">
                      {lead.financial_goal}
                    </td>

                    <td className="p-4">
                      {lead.investment_range}
                    </td>

                    <td className="p-4 max-w-xs">
                      {lead.message}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                        {lead.status || 'New'}
                      </span>
                    </td>

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

            {leads.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No leads found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}