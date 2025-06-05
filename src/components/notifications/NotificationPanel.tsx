
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, TrendingUp, MapPin, CheckCircle, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  location?: string;
  timestamp: string;
  isRead: boolean;
}

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      title: 'Peningkatan Kasus Stunting',
      message: 'Terdeteksi 3 kasus baru stunting di Kelurahan Mawar dalam 2 minggu terakhir',
      location: 'Kelurahan Mawar',
      timestamp: '2 jam yang lalu',
      isRead: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Tren Mengkhawatirkan',
      message: 'Prevalensi stunting di Desa Sukamaju meningkat 2% dibanding bulan lalu',
      location: 'Desa Sukamaju',
      timestamp: '5 jam yang lalu',
      isRead: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Reminder Kunjungan',
      message: 'Jadwal kunjungan posyandu di Desa Sejahtera besok pagi',
      location: 'Desa Sejahtera',
      timestamp: '1 hari yang lalu',
      isRead: true
    },
    {
      id: '4',
      type: 'success',
      title: 'Target Tercapai',
      message: 'Desa Harapan berhasil menurunkan prevalensi stunting menjadi 4.2%',
      location: 'Desa Harapan',
      timestamp: '2 hari yang lalu',
      isRead: true
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <TrendingUp className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Bell className="h-5 w-5 text-blue-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifikasi & Alert</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
          >
            Tandai Semua Dibaca
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Tidak ada notifikasi saat ini</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
                notification.isRead 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-semibold ${
                        notification.isRead ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h4>
                      <Badge className={getNotificationBadge(notification.type)}>
                        {notification.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className={`text-sm ${
                      notification.isRead ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      {notification.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{notification.location}</span>
                        </div>
                      )}
                      <span>{notification.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      Tandai Dibaca
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}

        {notifications.length > 0 && (
          <div className="text-center pt-4">
            <Button variant="outline" className="text-sm">
              Lihat Semua Notifikasi
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
