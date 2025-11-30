
import React, { useState } from 'react';
import { Grievance, GrievanceStatus, CalendarEvent, GrievanceAction } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface GrievanceDetailsProps {
  grievance: Grievance;
  events: CalendarEvent[];
  onBack: () => void;
  updateStatus: (id: string, status: GrievanceStatus) => void;
  addNote: (id: string, note: string) => void;
}

const GrievanceDetails: React.FC<GrievanceDetailsProps> = ({ grievance, events, onBack, updateStatus, addNote }) => {
  const { t } = useLanguage();
  const [noteText, setNoteText] = useState('');

  const linkedEvents = events.filter(e => e.grievanceId === grievance.id);
  
  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    addNote(grievance.id, noteText);
    setNoteText('');
  };

  const getStatusColor = (s: GrievanceStatus) => {
    switch(s) {
      case GrievanceStatus.PENDING: return 'bg-red-100 text-red-700';
      case GrievanceStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-700';
      case GrievanceStatus.RESOLVED: return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100">
          ⬅
        </button>
        <h2 className="text-lg font-bold text-gray-800">{t('details')}</h2>
      </div>

      {/* Main Info Card */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 relative overflow-hidden">
        <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${getStatusColor(grievance.status)}`}>
          {grievance.status}
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-1">{grievance.citizenName}</h3>
        <p className="text-sm text-gray-500 mb-4">{grievance.mobile}</p>

        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
           <p className="text-xs text-gray-400 font-bold uppercase mb-1">{grievance.category}</p>
           <p className="text-gray-800 text-sm leading-relaxed">{grievance.description}</p>
        </div>

        <div className="flex gap-2">
            {Object.values(GrievanceStatus).map((status) => (
              <button
                  key={status}
                  onClick={() => updateStatus(grievance.id, status)}
                  disabled={grievance.status === status}
                  className={`flex-1 text-xs py-2 rounded font-medium transition-colors
                    ${grievance.status === status 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
              >
                {status}
              </button>
            ))}
        </div>
      </div>

      {/* Linked Events */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
           📅 {t('linked_events')}
        </h3>
        {linkedEvents.length === 0 ? (
          <p className="text-gray-400 text-xs italic">{t('no_linked_events')}</p>
        ) : (
          <div className="space-y-2">
            {linkedEvents.map(e => (
              <div key={e.id} className="text-sm p-2 bg-blue-50 border border-blue-100 rounded flex justify-between">
                <span>{e.title}</span>
                <span className="font-bold text-blue-700">{e.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action History */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
           ⏱️ {t('actions_taken')}
        </h3>
        
        <div className="mb-4">
           <textarea 
             className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-2" 
             placeholder={t('note_placeholder')}
             rows={2}
             value={noteText}
             onChange={e => setNoteText(e.target.value)}
           />
           <button 
             onClick={handleSaveNote}
             disabled={!noteText.trim()}
             className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded disabled:opacity-50"
           >
             {t('save_note')}
           </button>
        </div>

        <div className="space-y-4 border-l-2 border-gray-200 pl-4 ml-1">
          {(!grievance.actions || grievance.actions.length === 0) && (
            <p className="text-gray-400 text-xs italic">{t('no_actions')}</p>
          )}
          {grievance.actions?.map((action) => (
            <div key={action.id} className="relative">
              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-gray-300 border border-white"></div>
              <p className="text-xs text-gray-400 mb-0.5">
                {new Date(action.date).toLocaleString()}
              </p>
              <p className="text-sm text-gray-800">
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
