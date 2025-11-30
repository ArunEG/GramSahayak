
import React, { useState } from 'react';
import { CalendarEvent, EventType, EventStatus, Grievance } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ScheduleManagerProps {
  events: CalendarEvent[];
  grievances?: Grievance[];
  addEvent: (e: CalendarEvent) => void;
  updateEventStatus: (id: string, status: EventStatus) => void;
  updateEventDate: (id: string, newDate: string, newTime: string) => void;
  deleteEvent: (id: string) => void;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({ 
  events, grievances = [], addEvent, updateEventStatus, updateEventDate, deleteEvent 
}) => {
  const { t } = useLanguage();
  const [view, setView] = useState<'DAY' | 'CALENDAR'>('DAY');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // New Event Form State
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    type: EventType.MEETING,
    date: selectedDate,
    time: '09:00',
    grievanceId: ''
  });

  const getFilteredEvents = () => {
    // Sort events by time
    const sorted = [...events].sort((a, b) => a.time.localeCompare(b.time));
    
    if (view === 'DAY') {
      return sorted.filter(e => e.date === selectedDate);
    }
    // In calendar view, we actually want to show the list for selected date below the grid
    return sorted.filter(e => e.date === selectedDate);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date!,
      time: newEvent.time!,
      type: newEvent.type as EventType,
      status: EventStatus.SCHEDULED,
      notes: newEvent.notes,
      grievanceId: newEvent.grievanceId || undefined
    };
    addEvent(event);
    setNewEvent({ type: EventType.MEETING, date: selectedDate, time: '09:00', title: '', notes: '', grievanceId: '' });
    setIsFormOpen(false);
  };

  const handlePostpone = (e: CalendarEvent) => {
    const nextDay = new Date(e.date);
    nextDay.setDate(nextDay.getDate() + 1);
    const dateStr = nextDay.toISOString().split('T')[0];
    updateEventDate(e.id, dateStr, e.time);
  };

  const getEventTypeColor = (type: EventType) => {
    switch(type) {
      case EventType.VISIT: return 'bg-blue-100 text-blue-800 border-blue-200';
      case EventType.SABHA: return 'bg-purple-100 text-purple-800 border-purple-200';
      case EventType.MEETING: return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const generateCalendarGrid = () => {
    const today = new Date();
    const [year, month] = selectedDate.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0 is Sunday

    const days = [];
    // Empty slots for start of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const hasEvent = events.some(e => e.date === dateStr);
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === today.toISOString().split('T')[0];

      days.push(
        <button 
          key={d} 
          onClick={() => setSelectedDate(dateStr)}
          className={`h-10 rounded-full flex items-center justify-center text-sm relative
            ${isSelected ? 'bg-orange-600 text-white font-bold' : 'hover:bg-gray-100 text-gray-700'}
            ${isToday && !isSelected ? 'border border-orange-500' : ''}
          `}
        >
          {d}
          {hasEvent && !isSelected && (
            <span className="absolute bottom-1 w-1 h-1 bg-orange-500 rounded-full"></span>
          )}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="space-y-4">
      {/* Header & Toggle */}
      <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex p-1">
        <button 
          onClick={() => setView('DAY')}
          className={`flex-1 py-2 text-xs font-bold rounded transition-all ${view === 'DAY' ? 'bg-orange-100 text-orange-700' : 'text-gray-500'}`}
        >
          {t('my_day')}
        </button>
        <button 
          onClick={() => setView('CALENDAR')}
          className={`flex-1 py-2 text-xs font-bold rounded transition-all ${view === 'CALENDAR' ? 'bg-orange-100 text-orange-700' : 'text-gray-500'}`}
        >
          {t('calendar')}
        </button>
      </div>

      {/* Calendar Grid View */}
      {view === 'CALENDAR' && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
             <input 
               type="month" 
               value={selectedDate.slice(0, 7)}
               onChange={(e) => setSelectedDate(`${e.target.value}-01`)}
               className="text-sm font-bold text-gray-700 bg-transparent outline-none"
             />
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S','M','T','W','T','F','S'].map((d,i) => (
              <div key={i} className="text-[10px] font-bold text-gray-400">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarGrid()}
          </div>
        </div>
      )}

      {/* Day Itinerary Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">
          {view === 'DAY' 
             ? (selectedDate === new Date().toISOString().split('T')[0] ? t('today') : selectedDate)
             : t('today')
          }
        </h3>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow hover:bg-orange-700"
        >
          {t('add_event')}
        </button>
      </div>

      {/* Add Event Form */}
      {isFormOpen && (
        <form onSubmit={handleSaveEvent} className="bg-white p-4 rounded-xl shadow-md border border-gray-200 animate-slide-in space-y-3">
          <input 
            type="text" 
            placeholder={t('event_title')}
            required
            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 outline-none"
            value={newEvent.title || ''}
            onChange={e => setNewEvent({...newEvent, title: e.target.value})}
          />
          <div className="flex gap-2">
             <select 
               className="flex-1 p-2 border border-gray-300 rounded text-sm bg-white"
               value={newEvent.type}
               onChange={e => setNewEvent({...newEvent, type: e.target.value as EventType})}
             >
               {Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}
             </select>
             <input 
               type="time" 
               required
               className="flex-1 p-2 border border-gray-300 rounded text-sm"
               value={newEvent.time}
               onChange={e => setNewEvent({...newEvent, time: e.target.value})}
             />
          </div>
          <input 
            type="date"
            required
            className="w-full p-2 border border-gray-300 rounded text-sm"
            value={newEvent.date}
            onChange={e => setNewEvent({...newEvent, date: e.target.value})}
          />
          
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{t('link_issue_opt')}</label>
            <select
               className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
               value={newEvent.grievanceId || ''}
               onChange={e => setNewEvent({...newEvent, grievanceId: e.target.value})}
            >
              <option value="">{t('select_issue')}</option>
              {grievances.map(g => (
                <option key={g.id} value={g.id}>
                  #{g.id.slice(-4)} - {g.citizenName} ({g.category})
                </option>
              ))}
            </select>
          </div>

          <textarea 
            placeholder={t('rough_notes')}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            value={newEvent.notes || ''}
            onChange={e => setNewEvent({...newEvent, notes: e.target.value})}
          />
          <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded font-bold text-sm">{t('save_btn')}</button>
        </form>
      )}

      {/* Timeline List */}
      <div className="space-y-4 relative pl-4 border-l-2 border-gray-200 ml-2">
        {getFilteredEvents().length === 0 ? (
          <p className="text-gray-400 text-sm italic pl-2">{t('no_events')}</p>
        ) : (
          getFilteredEvents().map(e => (
            <div key={e.id} className="relative pl-4 animate-fade-in">
              {/* Timeline Dot */}
              <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                 e.status === EventStatus.COMPLETED ? 'bg-green-500' : 'bg-orange-500'
              }`}></div>
              
              <div className={`bg-white p-3 rounded-lg shadow-sm border ${
                 e.status === EventStatus.CANCELLED ? 'opacity-50 grayscale' : ''
              }`}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="text-lg font-bold text-gray-800 block leading-tight">{e.time}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">{e.date}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${getEventTypeColor(e.type)}`}>
                    {e.type}
                  </span>
                </div>
                
                <h4 className={`font-semibold text-gray-800 ${e.status === EventStatus.COMPLETED ? 'line-through text-gray-400' : ''}`}>
                  {e.title}
                </h4>
                {e.notes && <p className="text-xs text-gray-500 mt-1">{e.notes}</p>}
                
                {e.grievanceId && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] bg-orange-50 text-orange-700 px-2 py-1 rounded border border-orange-100">
                    🔗 Linked to Issue #{e.grievanceId.slice(-4)}
                  </div>
                )}

                {e.status === EventStatus.SCHEDULED && (
                  <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => updateEventStatus(e.id, EventStatus.COMPLETED)}
                      className="flex-1 bg-green-50 text-green-700 text-xs py-1.5 rounded hover:bg-green-100 font-medium"
                    >
                      ✓ {t('mark_attended')}
                    </button>
                    <button 
                      onClick={() => handlePostpone(e)}
                      className="flex-1 bg-yellow-50 text-yellow-700 text-xs py-1.5 rounded hover:bg-yellow-100 font-medium"
                    >
                      → {t('postpone')}
                    </button>
                    <button 
                      onClick={() => updateEventStatus(e.id, EventStatus.CANCELLED)}
                      className="flex-1 bg-red-50 text-red-700 text-xs py-1.5 rounded hover:bg-red-100 font-medium"
                    >
                      ✕ {t('cancel')}
                    </button>
                  </div>
                )}
                {e.status !== EventStatus.SCHEDULED && (
                   <div className="mt-2 text-xs font-bold text-gray-400 uppercase">
                     {e.status}
                   </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScheduleManager;
