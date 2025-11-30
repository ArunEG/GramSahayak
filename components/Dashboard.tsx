

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Grievance, GrievanceStatus, UserProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  grievances: Grievance[];
  userProfile?: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ grievances, userProfile }) => {
  const { t } = useLanguage();
  const pendingCount = grievances.filter(g => g.status === GrievanceStatus.PENDING).length;
  const progressCount = grievances.filter(g => g.status === GrievanceStatus.IN_PROGRESS).length;
  const resolvedCount = grievances.filter(g => g.status === GrievanceStatus.RESOLVED).length;

  const data = [
    { name: t('pending'), value: pendingCount, color: '#EF4444' },
    { name: t('active'), value: progressCount, color: '#F59E0B' },
    { name: t('resolved'), value: resolvedCount, color: '#10B981' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {t('welcome')} {userProfile?.name ? `, ${userProfile.name}` : ''}
        </h2>
        <p className="text-sm text-gray-600">
          {t('status_msg_prefix')} <span className="font-bold text-orange-600">{userProfile?.wardNumber || '4'}</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center">
          <div className="text-2xl font-bold text-red-600">{pendingCount}</div>
          <div className="text-xs text-red-800 font-medium">{t('pending')}</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-center">
          <div className="text-2xl font-bold text-yellow-600">{progressCount}</div>
          <div className="text-xs text-yellow-800 font-medium">{t('active')}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
          <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
          <div className="text-xs text-green-800 font-medium">{t('resolved')}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-72">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">{t('grievance_overview')}</h3>
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
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            {t('no_complaints')}
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <h3 className="text-sm font-bold text-blue-800 mb-2">{t('quick_actions')}</h3>
        <div className="text-xs text-blue-700 space-y-1">
          <p>• {t('gram_sabha')}: <strong>24th Oct</strong></p>
          <p>• {t('deadline')}: <strong>30th Oct</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;