
import React, { useState } from 'react';
import { Grievance, GrievanceStatus, CalendarEvent } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface GrievanceDetailsProps {
  grievance: Grievance;
  events: CalendarEvent[];
  onBack: () => void;
  updateStatus: (id: string, status: GrievanceStatus) => void;
  addNote: (id: string, note: string) => void;
  deleteGrievance?: (id: string) => void;
}

const GrievanceDetails: React.FC<GrievanceDetailsProps> = ({ grievance, events, onBack, updateStatus, addNote, deleteGrievance }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [noteText, setNoteText] = useState('');

  const isDark = theme !== 'light';
  const linkedEvents = events.filter(e => e.grievanceId === grievance.id);
  
  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    addNote(grievance.id, noteText);
    setNoteText('');
  };

  const getStatusColor = (s: GrievanceStatus) => {
    switch(s) {
      case GrievanceStatus.PENDING: 
        return isDark 
          ? 'bg-red-500/20 text-red-200 border border-red-800' 
          : 'bg-red-100 text-red-800';
      case GrievanceStatus.IN_PROGRESS: 
        return isDark 
          ? 'bg-amber-500/20 text-amber-200 border border-amber-800' 
          : 'bg-amber-100 text-amber-800';
      case GrievanceStatus.RESOLVED: 
        return isDark 
          ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-800' 
          : 'bg-emerald-100 text-emerald-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={onBack} 
            className="p-2 bg-[var(--bg-card)] rounded-full shadow-sm hover:bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] transition-colors"
          >
            ⬅
          </button>
          <h2 className="text-lg font-bold text-[var(--text-main)]">{t('details')}</h2>
        </div>
        
        {/* Optional Delete Button */}
        {deleteGrievance && (
           <button 
             onClick={() => {
               if(window.confirm(t('confirm_delete') || 'Delete this issue?')) {
                 deleteGrievance(grievance.id);
                 onBack();
               }
             }}
             className="text-xs text-red-500 font-bold px-3 py-1.5 border border-red-500/30 rounded hover:bg-red-500/10 transition-colors"
           >
             🗑️ {t('delete')}
           </button>
        )}
      </div>

      {/* Main Info Card */}
      <div className="bg-[var(--bg-card)] p-5 rounded-xl shadow-md border border-[var(--border-color)] relative overflow-hidden">
        <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${getStatusColor(grievance.status)}`}>
          {grievance.status}
        </div>
        
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-1">{grievance.citizenName}</h3>
        <p className="text-sm text-[var(--text-sub)] mb-4">{grievance.mobile}</p>

        <div className="bg-[var(--bg-input)] p-3 rounded-lg border border-[var(--border-color)] mb-4">
           <p className="text-xs text-[var(--text-sub)] font-bold uppercase mb-1">{grievance.category}</p>
           <p className="text-[var(--text-main)] text-sm leading-relaxed">{grievance.description}</p>
        </div>

        <div className="flex gap-2">
            {Object.values(GrievanceStatus).map((status) => (
              <button
                  key={status}
                  onClick={() => updateStatus(grievance.id, status)}
                  disabled={grievance.status === status}
                  className={`flex-1 text-xs py-2 rounded font-medium transition-colors border
                    ${grievance.status === status 
                      ? 'bg-[var(--text-main)] text-[var(--bg-card)] border-[var(--text-main)] font-bold' 
                      : 'bg-transparent border-[var(--border-color)] text-[var(--text-sub)] hover:bg-[var(--bg-main)]'
                    }`}
              >
                {status}
              </button>
            ))}
        </div>
      </div>

      {/* Linked Events */}
      <div className="bg-[var(--bg-card)] p-4 rounded-xl shadow-sm border border-[var(--border-color)]">
        <h3 className="font-bold text-[var(--text-main)] mb-3 flex items-center gap-2">
           📅 {t('linked_events')}
        </h3>
        {linkedEvents.length === 0 ? (
          <p className="text-[var(--text-sub)] text-xs italic opacity-70">{t('no_linked_events')}</p>
        ) : (
          <div className="space-y-2">
            {linkedEvents.map(e => (
              <div 
                key={e.id} 
                className={`text-sm p-2 rounded flex justify-between border ${
                  isDark 
                    ? 'bg-blue-900/20 border-blue-800 text-blue-100' 
                    : 'bg-blue-50 border-blue-100 text-blue-900'
                }`}
              >
                <span>{e.title}</span>
                <span className="font-bold">{e.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action History */}
      <div className="bg-[var(--bg-card)] p-4 rounded-xl shadow-sm border border-[var(--border-color)]">
        <h3 className="font-bold text-[var(--text-main)] mb-3 flex items-center gap-2">
           ⏱️ {t('actions_taken')}
        </h3>
        
        <div className="mb-4">
           <textarea 
             className="w-full p-2 border border-[var(--border-color)] rounded-lg text-sm mb-2 bg-[var(--bg-input)] text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-orange-500 placeholder-gray-500" 
             placeholder={t('note_placeholder')}
             rows={2}
             value={noteText}
             onChange={e => setNoteText(e.target.value)}
           />
           <button 
             onClick={handleSaveNote}
             disabled={!noteText.trim()}
             className="bg-[var(--text-main)] text-[var(--bg-card)] text-xs px-3 py-1.5 rounded font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
           >
             {t('save_note')}
           </button>
        </div>

        <div className="space-y-4 border-l-2 border-[var(--border-color)] pl-4 ml-1">
          {(!grievance.actions || grievance.actions.length === 0) && (
            <p className="text-[var(--text-sub)] text-xs italic opacity-70">{t('no_actions')}</p>
          )}
          {grievance.actions?.map((action) => (
            <div key={action.id} className="relative">
              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--text-sub)] border border-[var(--bg-card)]"></div>
              <p className="text-xs text-[var(--text-sub)] mb-0.5 opacity-80">
                {new Date(action.date).toLocaleString()}
              </p>
              <p className="text-sm text-[var(--text-main)]">
                {action.type === 'STATUS_CHANGE' && <strong>🔄 </strong>}
                {action.type === 'EVENT_LINKED' && <strong>📅 </strong>}
                {action.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrievanceDetails;
