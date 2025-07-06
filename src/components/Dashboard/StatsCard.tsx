import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
  trend?: 'up' | 'down';
  trendValue?: string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeType,
  trend,
  trendValue,
  icon: Icon,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  const changeColor = changeType === 'increase' ? 'text-green-600' : 'text-red-600';
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${changeColor} mt-1`}>
              {changeType === 'increase' ? '↗' : '↘'} {change}
            </p>
          )}
          {trend && trendValue && (
            <p className={`text-sm ${trendColor} mt-1`}>
              {trend === 'up' ? '↗' : '↘'} {trendValue}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;