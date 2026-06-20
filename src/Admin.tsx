import React, { useState, useEffect } from 'react';
import { Copy, Link as LinkIcon, Trash2, CheckCircle2 } from 'lucide-react';

interface GeneratedLink {
  id: string;
  name: string;
  url: string;
  date: string;
}

export default function Admin() {
  const [prefix, setPrefix] = useState('Mr. & Mrs.');
  const [guestName, setGuestName] = useState('');
  const [links, setLinks] = useState<GeneratedLink[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const savedLinks = localStorage.getItem('wedding_generated_links');
    if (savedLinks) {
      try {
        setLinks(JSON.parse(savedLinks));
      } catch (e) {
        console.error("Failed to parse links from localStorage");
      }
    }
  }, []);

  const saveLinks = (newLinks: GeneratedLink[]) => {
    setLinks(newLinks);
    localStorage.setItem('wedding_generated_links', JSON.stringify(newLinks));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const fullName = `${prefix} ${guestName.trim()}`;
    const baseUrl = window.location.origin;
    const generatedUrl = `${baseUrl}/?guest=${encodeURIComponent(fullName)}`;
    
    const newLink: GeneratedLink = {
      id: Date.now().toString(),
      name: fullName,
      url: generatedUrl,
      date: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedLinks = [newLink, ...links];
    saveLinks(updatedLinks);
    setGuestName('');
  };

  const copyToClipboard = (id: string, url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const deleteLink = (id: string) => {
    const updatedLinks = links.filter(link => link.id !== id);
    saveLinks(updatedLinks);
  };

  const prefixes = [
    'Mr. & Mrs.',
    'Mr.',
    'Mrs.',
    'Miss.',
    'Rev.',
    'Dr.',
    'Family'
  ];

  return (
    <div className="min-h-screen bg-[#fdfaf5] font-montserrat p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-playball text-4xl md:text-5xl text-theme-900">Link Generator</h1>
          <p className="text-theme-600 font-cinzel tracking-widest uppercase text-sm">Admin Dashboard</p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* Generator Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-theme-200">
              <h2 className="text-lg font-bold text-theme-800 mb-6 flex items-center gap-2 uppercase tracking-wide text-sm">
                <LinkIcon className="w-4 h-4" />
                Create New Link
              </h2>
              
              <form onSubmit={handleGenerate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-stone-500">Select Prefix</label>
                  <select 
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    className="w-full bg-stone-50 border border-theme-200 rounded-lg px-4 py-3 text-stone-700 focus:outline-none focus:border-theme-400 transition-colors appearance-none cursor-pointer"
                  >
                    {prefixes.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-stone-500">Guest Name</label>
                  <input 
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-stone-50 border border-theme-200 rounded-lg px-4 py-3 text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-theme-400 transition-colors"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-theme-800 text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-theme-900 hover:shadow-lg transition-all duration-300 mt-4"
                >
                  Generate Link
                </button>
              </form>
            </div>
          </div>

          {/* Generated Links List */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-theme-200 min-h-[400px]">
              <h2 className="text-lg font-bold text-theme-800 mb-6 uppercase tracking-wide text-sm">
                Recently Generated Links
              </h2>

              <div className="space-y-4">
                {links.length === 0 ? (
                  <div className="text-center py-12 text-stone-400">
                    <p className="text-sm">No links generated yet.</p>
                  </div>
                ) : (
                  links.map((link) => (
                    <div key={link.id} className="border border-theme-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-theme-300 transition-colors group">
                      <div className="space-y-1 overflow-hidden">
                        <p className="font-bold text-theme-900 truncate text-lg font-cinzel">{link.name}</p>
                        <p className="text-xs text-stone-400 font-medium tracking-wide">{link.date}</p>
                        <p className="text-xs text-theme-600 truncate opacity-70 group-hover:opacity-100 transition-opacity">
                          {link.url}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => copyToClipboard(link.id, link.url)}
                          className="flex items-center justify-center w-10 h-10 rounded-lg bg-theme-50 text-theme-700 hover:bg-theme-100 hover:text-theme-900 transition-colors"
                          title="Copy Link"
                        >
                          {copiedId === link.id ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                          title="Delete Link"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
