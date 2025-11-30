
import React, { useState } from 'react';
import { Grievance, GrievanceCategory, GrievanceStatus, GrievancePriority, CalendarEvent, EventType, EventStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import GrievanceDetails from './GrievanceDetails';

interface GrievanceLogProps {
  grievances: Grievance[];
  events: CalendarEvent[];
  addGrievance: (g: Grievance) => void;
  updateStatus: (id: string, status: GrievanceStatus) => void;
  addEvent: (e: CalendarEvent) => void;
  switchToSchedule: () => void;
  addNote: (id: string, note: string) => void;
}

const GrievanceLog: React.FC<GrievanceLogProps> = ({ 
  grievances, events, addGrievance, updateStatus, addEvent, switchToSchedule, addNote 
}) => {
  const { t } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string | null>(null);
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState<GrievanceStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<GrievancePriority | 'ALL'>('ALL');

  const [newGrievance, setNewGrievance] = useState<Partial<Grievance>>({
    category: GrievanceCategory.OTHER,
    status: GrievanceStatus.PENDING,
    priority: GrievancePriority.MEDIUM,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrievance.citizenName || !newGrievance.description) return;

    // Use current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    const g: Grievance = {
      id: Date.now().toString(),
      citizenName: newGrievance.citizenName,
      mobile: newGrievance.mobile || '',
      category: newGrievance.category as GrievanceCategory,
      description: newGrievance.description,
      status: GrievanceStatus.PENDING,
      priority: newGrievance.priority as GrievancePriority,
      dateLogged: today,
      wardNumber: '4', // Defaulting for demo
      actions: []
    };

    addGrievance(g);
    setNewGrievance({ 
      category: GrievanceCategory.OTHER, 
      status: GrievanceStatus.PENDING,
      priority: GrievancePriority.MEDIUM,
    });
    setIsFormOpen(false);
  };

  const handleScheduleVisit = (e: React.MouseEvent, g: Grievance) => {
    e.stopPropagation(); // Prevent opening details
    const today = new Date().toISOString().split('T')[0];
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: `Visit: ${g.citizenName}`,
      date: today,
      time: '10:00',
      type: EventType.VISIT,
      grievanceId: g.id,
      status: EventStatus.SCHEDULED,
      notes: `Addressing issue: ${g.description}`
    };
    addEvent(newEvent);
    switchToSchedule();
  };

  const getDaysAgo = (dateString: string) => {
    const past = new Date(dateString);
    const now = new Date();
    // Normalize time to midnight for accurate day calculation
    past.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    
    const diffTime = Math.abs(now.getTime() - past.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  };

  const getPriorityColor = (p: GrievancePriority) => {
    switch (p) {
      case GrievancePriority.URGENT: return 'bg-red-100 text-red-800 border-red-200';
      case GrievancePriority.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
      case GrievancePriority.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case GrievancePriority.LOW: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (p: GrievancePriority) => {
    switch (p) {
      case GrievancePriority.URGENT: return t('p_urgent');
      case GrievancePriority.HIGH: return t('p_high');
      case GrievancePriority.MEDIUM: return t('p_medium');
      case GrievancePriority.LOW: return t('p_low');
      default: return p;
    }
  };

  // If a grievance is selected, show details view
  if (selectedGrievanceId) {
    const g = grievances.find(i => i.id === selectedGrievanceId);
    if (g) {
      return (
        <GrievanceDetails 
          grievance={g} 
          events={events}
          onBack={() => setSelectedGrievanceId(null)} 
          updateStatus={updateStatus}
          addNote={addNote}
        />
      );
    }
  }

  // Filter Logic
  const filteredGrievances = grievances.filter(g => {
    const statusMatch = statusFilter === 'ALL' || g.status === statusFilter;
    const priorityMatch = priorityFilter === 'ALL' || g.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-gray-800">{t('log_title')}</h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-orange-700 transition-colors"
        >
          {isFormOpen ? t('close') : t('new_complaint')}
        </button>
      </div>

      {/* Filters Section */}
      {!isFormOpen && (
        <div className="flex gap-2 mb-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm overflow-x-auto">
          <div className="flex-1 min-w-[120px]">
             <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{t('filter_status')}</label>
             <select 
               className="w-full text-xs p-1.5 border border-gray-300 rounded bg-gray-50 text-gray-700"
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value as any)}
             >
               <option value="ALL">{t('all')}</option>
               {Object.values(GrievanceStatus).map(s => <option key={s} value={s}>{s}</option>)}
             </select>
          </div>
          <div className="flex-1 min-w-[120px]">
             <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">{t('filter_priority')}</label>
             <select 
               className="w-full text-xs p-1.5 border border-gray-300 rounded bg-gray-50 text-gray-700"
               value={priorityFilter}
               onChange={(e) => setPriorityFilter(e.target.value as any)}
             >
               <option value="ALL">{t('all')}</option>
               {Object.values(GrievancePriority).map(p => (
                 <option key={p} value={p}>{getPriorityLabel(p)}</option>
               ))}
             </select>
          </div>
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 space-y-3 animate-slide-in">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t('villager_name')}</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Ram Lal"
              value={newGrievance.citizenName || ''}
              onChange={(e) => setNewGrievance({ ...newGrievance, citizenName: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1">{t('mobile')}</label>
              <input
                type="tel"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="9876543210"
                value={newGrievance.mobile || ''}
                onChange={(e) => setNewGrievance({ ...newGrievance, mobile: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1">{t('priority')}</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                value={newGrievance.priority}
                onChange={(e) => setNewGrievance({ ...newGrievance, priority: e.target.value as GrievancePriority })}
              >
                {Object.values(GrievancePriority).map((p) => (
                  <option key={p} value={p}>{getPriorityLabel(p)}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t('category')}</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              value={newGrievance.category}
              onChange={(e) => setNewGrievance({ ...newGrievance, category: e.target.value as GrievanceCategory })}
            >
              {Object.values(GrievanceCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t('details')}</label>
            <textarea
              required
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Describe the issue..."
              value={newGrievance.description || ''}
              onChange={(e) => setNewGrievance({ ...newGrievance, description: e.target.value })}
            />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md font-medium text-sm">
            {t('save_btn')}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {filteredGrievances.length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-10">{t('no_complaints')}</p>
        )}
        {filteredGrievances.map((g) => {
          const daysAgo = getDaysAgo(g.dateLogged);
          const isLate = daysAgo > 30 && g.status !== GrievanceStatus.RESOLVED;

          return (
            <div 
              key={g.id} 
              onClick={() => setSelectedGrievanceId(g.id)}
              className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-l-orange-500 flex flex-col gap-2 relative cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{g.citizenName}</h3>
                  <p className="text-xs text-gray-500">{g.mobile}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${getPriorityColor(g.priority)}`}>
                     {getPriorityLabel(g.priority)}
                   </span>
                   <span className={`text-[10px] font-medium ${isLate ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                      {daysAgo === 0 ? t('today') : `${daysAgo} ${t('days_ago')}`}
                   </span>
                </div>
              </div>
              
              <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                <div className="flex justify-between mb-1">
                   <span className="font-semibold text-xs text-gray-500">{g.category}</span>
                   <span className="text-[10px] text-gray-400">{g.dateLogged}</span>
                </div>
                <div className="line-clamp-2">{g.description}</div>
              </div>

              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                  <span 
                    className={`flex-1 text-center text-xs py-1.5 rounded border bg-gray-800 text-white border-gray-800`}
                  >
                    {g.status}
                  </span>
                  <button 
                    className="flex-1 text-center text-xs py-1.5 rounded border bg-white text-gray-600 border-gray-200"
                  >
                    {t('view_details')}
                  </button>
              </div>
              <button 
                onClick={(e) => handleScheduleVisit(e, g)}
                className="mt-1 w-full text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 py-2 rounded border border-orange-200 flex items-center justify-center gap-1"
              >
                📅 {t('schedule_visit')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GrievanceLog;
