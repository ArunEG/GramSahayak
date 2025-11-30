
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Grievance, GrievanceStatus, UserProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  grievances: Grievance[];
  userProfile?: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ grievances, userProfile }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  const pendingCount = grievances.filter(g => g.status === GrievanceStatus.PENDING).length;
  const progressCount = grievances.filter(g => g.status === GrievanceStatus.IN_PROGRESS).length;
  const resolvedCount = grievances.filter(g => g.status === GrievanceStatus.RESOLVED).length;

  const data = [
    { name: t('pending'), value: pendingCount, color: '#EF4444' },
    { name: t('active'), value: progressCount, color: '#F59E0B' },
    { name: t('resolved'), value: resolvedCount, color: '#10B981' },
  ];

  // Helper for dynamic styles based on theme
  const getCardStyle = (type: 'pending' | 'active' | 'resolved' | 'info') => {
    const isDark = theme !== 'light';
    
    switch (type) {
      case 'pending':
        return isDark 
          ? 'bg-red-500/20 border-red-800 text-red-200' 
          : 'bg-red-100 border-red-200 text-red-900';
      case 'active':
        return isDark 
          ? 'bg-amber-500/20 border-amber-800 text-amber-200' 
          : 'bg-amber-100 border-amber-200 text-amber-900';
      case 'resolved':
        return isDark 
          ? 'bg-emerald-500/20 border-emerald-800 text-emerald-200' 
          : 'bg-emerald-100 border-emerald-200 text-emerald-900';
      case 'info':
        return isDark 
          ? 'bg-blue-500/20 border-blue-800 text-blue-200' 
          : 'bg-blue-100 border-blue-200 text-blue-900';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[var(--bg-card)] p-4 rounded-xl shadow-sm border border-[var(--border-color)]">
        <h2 className="text-lg font-semibold text-[var(--text-main)] mb-1">
          {t('welcome')} {userProfile?.name ? `, ${userProfile.name}` : ''}
        </h2>
        <p className="text-sm text-[var(--text-sub)]">
          {t('status_msg_prefix')} <span className="font-bold text-orange-600">{userProfile?.wardNumber || '4'}</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className={`p-3 rounded-lg border text-center ${getCardStyle('pending')}`}>
          <div className="text-2xl font-bold">{pendingCount}</div>
          <div className="text-xs font-bold uppercase opacity-80">{t('pending')}</div>
        </div>
        <div className={`p-3 rounded-lg border text-center ${getCardStyle('active')}`}>
          <div className="text-2xl font-bold">{progressCount}</div>
          <div className="text-xs font-bold uppercase opacity-80">{t('active')}</div>
        </div>
        <div className={`p-3 rounded-lg border text-center ${getCardStyle('resolved')}`}>
          <div className="text-2xl font-bold">{resolvedCount}</div>
          <div className="text-xs font-bold uppercase opacity-80">{t('resolved')}</div>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] p-4 rounded-xl shadow-sm border border-[var(--border-color)] h-72">
        <h3 className="text-sm font-semibold text-[var(--text-main)] mb-4">{t('grievance_overview')}</h3>
        {grievances.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  backgroundColor: 'var(--bg-card)', 
                  color: 'var(--text-main)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                }} 
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-[var(--text-sub)] text-sm">
            {t('no_complaints')}
          </div>
        )}
      </div>

      <div className={`p-4 rounded-xl border ${getCardStyle('info')}`}>
        <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
          <span>⚡</span> {t('quick_actions')}
        </h3>
        <div className="text-xs font-medium space-y-2 opacity-90">
          <p className="flex justify-between border-b border-current pb-1 border-opacity-20">
            <span>{t('gram_sabha')}:</span> 
            <strong>24th Oct</strong>
          </p>
          <p className="flex justify-between border-b border-current pb-1 border-opacity-20">
            <span>{t('deadline')}:</span> 
            <strong>30th Oct</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
