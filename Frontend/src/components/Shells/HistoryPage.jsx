import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Clock,
  RefreshCw,
  LayoutGrid,
  List,
  Calendar,
  MoreVertical,
  ExternalLink,
  Copy,
  Check,
  Globe,
  ArrowUpRight,
  X,
  SlidersHorizontal,
  Sparkles,
  Layers,
} from 'lucide-react';

import { useProjects } from '../../hooks/useProjects';

// --- Helpers ---
function timeAgo(dateStr) {
  if (!dateStr) return 'Unknown';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function cleanDomain(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0];
  }
}

export default function HistoryPage() {
  const { projects, loading, error, fetchProjects } = useProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'alphabetical'

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Filter & Sort
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    
    return projects
      .filter((project) => project.deploymentStatus === 'deployed')
      .filter((project) =>
        project.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.deployedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.deployedAt || b.createdAt || 0).getTime();

        if (sortBy === 'newest') return dateB - dateA;
        if (sortBy === 'oldest') return dateA - dateB;
        if (sortBy === 'alphabetical') {
          return (a.title || '').localeCompare(b.title || '');
        }
        return 0;
      });
  }, [projects, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-40 min-h-screen">
      
      {/* --- Page Header & Stats --- */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#A35100]/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF3E4] border border-[#A35100]/15 mb-3">
              <Sparkles size={13} className="text-[#A35100]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#A35100]">
                Deployment Registry
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif italic text-[#34170A] tracking-tight">
              Project Archive
            </h1>
            <p className="mt-2 text-sm text-[#A35100]/70 max-w-lg leading-relaxed">
              Explore, preview, and access all live web applications and services deployed to production.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-5 py-3 rounded-2xl bg-white/60 border border-[#A35100]/10 shadow-sm backdrop-blur-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A35100]/60 block">
                Live Sites
              </span>
              <span className="text-2xl font-serif text-[#34170A] font-semibold">
                {projects?.filter(p => p.deploymentStatus === 'deployed').length || 0}
              </span>
            </div>
            
            <button
              onClick={fetchProjects}
              title="Refresh projects"
              disabled={loading}
              className="p-3.5 rounded-2xl border border-[#A35100]/15 hover:bg-white bg-white/40 text-[#A35100] transition-all active:scale-95 shadow-sm hover:shadow hover:border-[#A35100]/30 disabled:opacity-50"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* --- Search, Filter & View Mode Controls --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A35100]/40 pointer-events-none"
            size={18}
          />
          <input
            type="text"
            placeholder="Search deployments by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/70 border border-[#A35100]/15 rounded-2xl py-3.5 pl-11 pr-10 focus:outline-none focus:ring-4 focus:ring-[#A35100]/10 focus:border-[#A35100]/40 focus:bg-white transition-all placeholder:text-[#A35100]/35 text-sm text-[#34170A] shadow-sm backdrop-blur-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#A35100]/40 hover:text-[#34170A] hover:bg-[#A35100]/10 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort & View Mode Switcher */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* Sort Dropdown */}
          <div className="relative flex items-center bg-white/60 border border-[#A35100]/15 rounded-2xl px-3 py-2 text-xs text-[#34170A] shadow-sm hover:border-[#A35100]/30 transition-all">
            <SlidersHorizontal size={14} className="text-[#A35100]/60 mr-2 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-xs font-medium text-[#34170A] focus:outline-none cursor-pointer pr-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical (A-Z)</option>
            </select>
          </div>

          {/* Grid / List Pill Toggle */}
          <div className="relative flex items-center bg-white/60 p-1.5 rounded-2xl border border-[#A35100]/15 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`relative z-10 p-2 rounded-xl transition-colors ${
                viewMode === 'grid' ? 'text-[#A35100]' : 'text-[#34170A]/40 hover:text-[#34170A]'
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List View"
              className={`relative z-10 p-2 rounded-xl transition-colors ${
                viewMode === 'list' ? 'text-[#A35100]' : 'text-[#34170A]/40 hover:text-[#34170A]'
              }`}
            >
              <List size={18} />
            </button>

            {/* Sliding Pill Indicator */}
            <motion.div
              layoutId="viewToggle"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              className={`absolute top-1.5 bottom-1.5 w-[34px] rounded-xl bg-white shadow-sm border border-[#A35100]/10 ${
                viewMode === 'grid' ? 'left-1.5' : 'left-[45px]'
              }`}
            />
          </div>

        </div>
      </div>

      {/* --- Content Area --- */}
      {loading ? (
        <LoadingSkeleton viewMode={viewMode} />
      ) : error ? (
        <div className="text-center py-20 px-6 bg-red-50/60 rounded-3xl border border-red-200/80 max-w-lg mx-auto shadow-sm">
          <p className="text-red-900 font-serif italic text-lg mb-2">
            Failed to retrieve deployment history
          </p>
          <p className="text-xs text-red-700/80 mb-6">
            An issue occurred while fetching your projects from the server.
          </p>
          <button
            onClick={fetchProjects}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 active:scale-95 transition-all shadow-sm"
          >
            <RefreshCw size={14} /> Retry Connection
          </button>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-3'
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project._id || project.id || idx}
                project={project}
                index={idx}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-28 px-4 border-2 border-dashed border-[#A35100]/15 rounded-[36px] bg-white/20 backdrop-blur-sm max-w-xl mx-auto"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#FDF3E4] border border-[#A35100]/15 flex items-center justify-center mx-auto mb-4 text-[#A35100]">
            <Search size={24} />
          </div>
          <h3 className="text-xl font-serif italic text-[#34170A] font-medium">
            No matching deployments found
          </h3>
          <p className="text-xs text-[#A35100]/60 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `We couldn't find any projects matching "${searchQuery}".`
              : 'You have not deployed any projects yet.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-6 px-4 py-2 rounded-xl bg-white border border-[#A35100]/20 text-xs font-bold uppercase tracking-wider text-[#A35100] hover:bg-[#FDF3E4] transition-all shadow-sm"
            >
              Clear Search Query
            </button>
          )}
        </motion.div>
      )}

    </div>
  );
}

// ======================================================
// Project Card (Grid & List View)
// ======================================================
function ProjectCard({ project, index, viewMode }) {
  const title = project.title || 'Untitled Project';
  const initial = title.charAt(0).toUpperCase();
  const productionUrl = project.productionUrl;
  const deploymentDate = project.deployedAt || project.createdAt;
  const domain = cleanDomain(productionUrl);

  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleCopyLink = (e) => {
    e.stopPropagation();
    if (!productionUrl) return;
    navigator.clipboard.writeText(productionUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // ==================================================
  // LIST VIEW COMPONENT
  // ==================================================
  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ delay: index * 0.02, duration: 0.2 }}
        className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white/70 hover:bg-white rounded-2xl border border-[#A35100]/10 hover:border-[#A35100]/25 transition-all shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Avatar Monogram */}
          <div className="w-11 h-11 rounded-xl bg-[#C18C28] flex items-center justify-center text-white text-base font-bold shrink-0 shadow-sm shadow-[#C18C28]/20 group-hover:scale-105 transition-transform">
            {initial}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <h3 className="font-serif italic text-[#34170A] font-semibold text-base truncate group-hover:text-[#A35100] transition-colors">
                {title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#A35100]/60">
              {domain && (
                <span className="inline-flex items-center gap-1 font-mono text-[#34170A]/70 truncate max-w-[200px]">
                  <Globe size={11} className="text-[#A35100]/70 shrink-0" />
                  {domain}
                </span>
              )}
              <span className="text-[#A35100]/30">•</span>
              <span className="inline-flex items-center gap-1 font-medium">
                <Clock size={11} />
                {timeAgo(deploymentDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#A35100]/5">
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-[#34170A]/40">
            <Calendar size={12} />
            {deploymentDate ? new Date(deploymentDate).toLocaleDateString() : 'N/A'}
          </span>

          <div className="flex items-center gap-2">
            {productionUrl && (
              <button
                onClick={handleCopyLink}
                title="Copy URL"
                className="p-2 rounded-xl text-[#34170A]/40 hover:text-[#A35100] hover:bg-[#FDF3E4] transition-colors"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              </button>
            )}

            {productionUrl ? (
              <a
                href={productionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FDF3E4] hover:bg-[#A35100] text-[#A35100] hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm group/btn"
              >
                <span>Live Site</span>
                <ArrowUpRight size={13} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            ) : (
              <span className="text-xs text-[#34170A]/30 italic px-2">Unlinked</span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // ==================================================
  // GRID VIEW COMPONENT
  // ==================================================
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white/80 hover:bg-white rounded-[28px] p-6 transition-all border border-[#A35100]/10 hover:border-[#A35100]/25 shadow-sm hover:shadow-xl hover:shadow-[#A35100]/10 flex flex-col justify-between overflow-hidden min-h-[300px]"
    >
      {/* Subtle Warm Background Glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#FDF3E4] rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none opacity-80" />

      {/* Top Section */}
      <div className="relative z-10">
        
        {/* Monogram, Status & Options */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C18C28] flex items-center justify-center text-white text-lg font-bold shadow-md shadow-[#C18C28]/25 group-hover:scale-105 transition-transform">
              {initial}
            </div>

            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                Active
              </span>
            </div>
          </div>

          {/* Context Menu Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              aria-label="Options"
              className="p-2 rounded-xl text-[#34170A]/30 hover:text-[#34170A] hover:bg-[#FDF3E4] transition-colors"
            >
              <MoreVertical size={18} />
            </button>

            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-[#A35100]/15 py-1.5 z-30"
              >
                {productionUrl && (
                  <>
                    <button
                      onClick={handleCopyLink}
                      className="w-full px-3.5 py-2 text-left text-xs text-[#34170A] hover:bg-[#FDF3E4] flex items-center gap-2 transition-colors"
                    >
                      {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-[#A35100]" />}
                      <span>{copied ? 'Copied URL!' : 'Copy Site URL'}</span>
                    </button>
                    <a
                      href={productionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowMenu(false)}
                      className="w-full px-3.5 py-2 text-left text-xs text-[#34170A] hover:bg-[#FDF3E4] flex items-center gap-2 transition-colors"
                    >
                      <ExternalLink size={14} className="text-[#A35100]" />
                      <span>Open in New Tab</span>
                    </a>
                  </>
                )}
                <div className="border-t border-[#A35100]/10 my-1" />
                <div className="px-3.5 py-1 text-[10px] font-mono text-[#34170A]/40 uppercase tracking-wider">
                  ID: {(project._id || project.id || 'N/A').toString().slice(-6)}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Project Title */}
        <h3
          className="font-serif italic text-[#34170A] font-semibold text-lg line-clamp-2 leading-snug mb-2 group-hover:text-[#A35100] transition-colors"
          title={title}
        >
          {title}
        </h3>

        {/* Domain Badge */}
        {domain ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/5 text-[#34170A]/80 font-mono text-[11px] mb-4 max-w-full">
            <Globe size={12} className="text-[#A35100]/80 shrink-0" />
            <span className="truncate">{domain}</span>
          </div>
        ) : (
          <div className="h-6 mb-4" />
        )}

      </div>

      {/* Card Footer */}
      <div className="relative z-10 pt-4 border-t border-[#A35100]/10 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[#A35100]/70 text-[10px] font-bold uppercase tracking-wider">
            <Clock size={12} />
            <span>{timeAgo(deploymentDate)}</span>
          </div>
          <span className="text-[11px] font-mono text-[#34170A]/40 mt-0.5">
            {deploymentDate ? new Date(deploymentDate).toLocaleDateString() : 'N/A'}
          </span>
        </div>

        {/* Action Button */}
        {productionUrl ? (
          <a
            href={productionUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#FDF3E4] group-hover:bg-[#A35100] text-[#A35100] group-hover:text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm group/btn"
            title="Launch live site"
          >
            <span>Visit</span>
            <ArrowUpRight size={14} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </a>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#34170A]/20">
            <ArrowUpRight size={14} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ======================================================
// Loading Skeleton Component
// ======================================================
function LoadingSkeleton({ viewMode }) {
  const skeletons = Array.from({ length: 6 });

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-3 animate-pulse">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className="h-20 bg-white/50 border border-[#A35100]/10 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#A35100]/10" />
              <div className="space-y-2">
                <div className="w-48 h-4 rounded bg-[#A35100]/10" />
                <div className="w-24 h-3 rounded bg-[#A35100]/5" />
              </div>
            </div>
            <div className="w-24 h-8 rounded-xl bg-[#A35100]/10" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {skeletons.map((_, i) => (
        <div
          key={i}
          className="h-[300px] bg-white/50 border border-[#A35100]/10 rounded-[28px] p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#A35100]/10" />
              <div className="w-14 h-5 rounded-full bg-[#A35100]/10" />
            </div>
            <div className="w-3/4 h-5 rounded bg-[#A35100]/10 mb-3" />
            <div className="w-1/2 h-4 rounded bg-[#A35100]/5" />
          </div>
          <div className="pt-4 border-t border-[#A35100]/5 flex justify-between items-center">
            <div className="w-20 h-4 rounded bg-[#A35100]/10" />
            <div className="w-16 h-8 rounded-xl bg-[#A35100]/10" />
          </div>
        </div>
      ))}
    </div>
  );
}