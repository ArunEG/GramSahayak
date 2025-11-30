

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import GrievanceLog from './components/GrievanceLog';
import LetterDrafter from './components/LetterDrafter';
import SchemeExplorer from './components/SchemeExplorer';
import BroadcastManager from './components/BroadcastManager';
import ScheduleManager from './components/ScheduleManager';
import Registration from './components/Registration';
import Settings from './components/Settings';
import AppLock from './components/AppLock';
import { LanguageProvider } from './contexts/LanguageContext';
import { SecurityProvider, useSecurity } from './contexts/SecurityContext';
import { Grievance, GrievanceStatus, GrievanceCategory, TabView, GrievancePriority, CalendarEvent, EventType, EventStatus, GrievanceAction, UserProfile } from './types';

// Mock Data
const initialGrievances: Grievance[] = [
  {
    id: '1',
    citizenName: 'Ramesh Gupta',
    mobile: '9822098220',
    category: GrievanceCategory.WATER,
    description: 'Handpump in Lane 3 is not working properly. Water is muddy.',
    status: GrievanceStatus.PENDING,
    priority: GrievancePriority.URGENT,
    dateLogged: '2025-01-20',
    wardNumber: '4',
    actions: [
        { id: 'a1', type: 'NOTE', description: 'Initial complaint received.', date: '2025-01-20T10:00:00Z' }
    ]
  },
  {
    id: '2',
    citizenName: 'Sunita Devi',
    mobile: '8877665544',
    category: GrievanceCategory.PENSION,
    description: 'Widow pension application submitted 3 months ago, no update.',
    status: GrievanceStatus.IN_PROGRESS,
    priority: GrievancePriority.HIGH,
    dateLogged: '2025-01-10',
    wardNumber: '4',
    actions: [
        { id: 'a2', type: 'STATUS_CHANGE', description: 'Status changed to In Progress', date: '2025-01-12T14:30:00Z' }
    ]
  },
  {
    id: '3',
    citizenName: 'Mohan Singh',
    mobile: '9988776655',
    category: GrievanceCategory.ROADS,
    description: 'Pothole near primary school causing accidents.',
    status: GrievanceStatus.RESOLVED,
    priority: GrievancePriority.MEDIUM,
    dateLogged: '2024-12-15',
    wardNumber: '4',
    actions: [
        { id: 'a3', type: 'STATUS_CHANGE', description: 'Status changed to Resolved', date: '2024-12-20T11:00:00Z' }
    ]
  }
];

const todayStr = new Date().toISOString().split('T')[0];

const initialEvents: CalendarEvent[] = [
  {
    id: '101',
    title: 'Gram Sabha Preparation',
    date: todayStr,
    time: '14:00',
    type: EventType.MEETING,
    status: EventStatus.SCHEDULED,
    notes: 'Discuss agenda for next week.'
  },
  {
    id: '102',
    title: 'Visit PMAY Site',
    date: todayStr,
    time: '16:30',
    type: EventType.VISIT,
    status: EventStatus.SCHEDULED,
    notes: 'Verify construction progress.'
  }
];

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabView>('DASHBOARD');
  const [grievances, setGrievances] = useState<Grievance[]>(initialGrievances);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  // Security Context
  const { isAuthenticated } = useSecurity();

  // Load User Profile
  useEffect(() => {
    const storedUser = localStorage.getItem('gramSahayak_user');
    if (storedUser) {
      setUserProfile(JSON.parse(storedUser));
    }
    setIsCheckingUser(false);
  }, []);

  const handleRegister = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('gramSahayak_user', JSON.stringify(profile));
  };

  // --- Notification Logic ---
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    const checkEvents = setInterval(() => {
      const now = new Date();
      events.forEach(event => {
        if (event.status !== EventStatus.SCHEDULED) return;

        const eventTime = new Date(`${event.date}T${event.time}`);
        const diffMs = eventTime.getTime() - now.getTime();
        const diffMins = Math.round(diffMs / 60000);

        if (diffMins === 15) {
          if (Notification.permission === "granted") {
            new Notification(`Upcoming Event: ${event.title}`, {
              body: `Starts at ${event.time}. Prepare to attend.`,
              icon: 'https://cdn-icons-png.flaticon.com/512/2983/2983804.png'
            });
          }
        }
      });
    }, 60000);

    return () => clearInterval(checkEvents);
  }, [events]);

  // --- Grievance Logic ---
  const addGrievance = (g: Grievance) => {
    setGrievances([g, ...grievances]);
  };

  const updateStatus = (id: string, status: GrievanceStatus) => {
    setGrievances(prev => prev.map(g => {
        if (g.id === id) {
            const action: GrievanceAction = {
                id: Date.now().toString(),
                type: 'STATUS_CHANGE',
                description: `Status changed to ${status}`,
                date: new Date().toISOString()
            };
            return { 
                ...g, 
                status, 
                actions: [action, ...(g.actions || [])]
            };
        }
        return g;
    }));
  };

  const addGrievanceNote = (id: string, note: string) => {
    setGrievances(prev => prev.map(g => {
        if (g.id === id) {
             const action: GrievanceAction = {
                id: Date.now().toString(),
                type: 'NOTE',
                description: note,
                date: new Date().toISOString()
            };
            return {
                ...g,
                actions: [action, ...(g.actions || [])]
            }
        }
        return g;
    }));
  }

  // --- Event Logic ---
  const addEvent = (e: CalendarEvent) => {
    setEvents(prev => [...prev, e]);
    if (e.grievanceId) {
        setGrievances(prev => prev.map(g => {
            if (g.id === e.grievanceId) {
                const action: GrievanceAction = {
                    id: Date.now().toString(),
                    type: 'EVENT_LINKED',
                    description: `Event scheduled: ${e.title} on ${e.date}`,
                    date: new Date().toISOString()
                };
                return { ...g, actions: [action, ...(g.actions || [])] };
            }
            return g;
        }));
    }
  };

  const updateEventStatus = (id: string, status: EventStatus) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const updateEventDate = (id: string, newDate: string, newTime: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, date: newDate, time: newTime, status: EventStatus.SCHEDULED } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  if (isCheckingUser) return null; // Or a loading spinner

  // Logic: 
  // 1. If Locked -> Show Lock Screen (AppLock)
  // 2. If Not Registered -> Show Registration
  // 3. Show App Content

  if (!isAuthenticated) {
    return <AppLock />;
  }

  if (!userProfile) {
    return <Registration onRegister={handleRegister} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'DASHBOARD':
        return <Dashboard grievances={grievances} userProfile={userProfile} />;
      case 'GRIEVANCES':
        return (
          <GrievanceLog 
            grievances={grievances} 
            events={events}
            addGrievance={addGrievance} 
            updateStatus={updateStatus} 
            addEvent={addEvent}
            switchToSchedule={() => setActiveTab('SCHEDULE')}
            addNote={addGrievanceNote}
          />
        );
      case 'SCHEDULE':
        return (
          <ScheduleManager 
            events={events} 
            grievances={grievances}
            addEvent={addEvent} 
            updateEventStatus={updateEventStatus}
            updateEventDate={updateEventDate}
            deleteEvent={deleteEvent}
          />
        );
      case 'DRAFTER':
        return <LetterDrafter userProfile={userProfile} />;
      case 'SCHEMES':
        return <SchemeExplorer />;
      case 'CONNECT':
        return <BroadcastManager userProfile={userProfile} />;
      case 'SETTINGS':
        return <Settings />;
      default:
        return <Dashboard grievances={grievances} userProfile={userProfile} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} userProfile={userProfile}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <SecurityProvider>
        <MainContent />
      </SecurityProvider>
    </LanguageProvider>
  );
};

export default App;