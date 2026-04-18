"use client";

import { 
  Bell, 
  Check,
  X,
  Film,
  User,
  CreditCard,
  AlertCircle,
  Info
} from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    { 
      type: "clip", 
      title: "New clip processed", 
      message: "Your clip 'Viral Moment #12' is ready for review",
      time: "5 min ago",
      read: false
    },
    { 
      type: "user", 
      title: "New team member", 
      message: "Sarah Johnson joined your workspace",
      time: "1 hour ago",
      read: false
    },
    { 
      type: "billing", 
      title: "Payment successful", 
      message: "Your subscription payment of $49.99 was successful",
      time: "2 hours ago",
      read: true
    },
    { 
      type: "alert", 
      title: "Storage limit warning", 
      message: "You've used 85% of your storage quota",
      time: "1 day ago",
      read: true
    },
    { 
      type: "info", 
      title: "New feature available", 
      message: "Try our new AI B-Roll feature for better videos",
      time: "2 days ago",
      read: true
    },
    { 
      type: "clip", 
      title: "Clip exported", 
      message: "Your video has been exported successfully",
      time: "3 days ago",
      read: true
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "clip": return Film;
      case "user": return User;
      case "billing": return CreditCard;
      case "alert": return AlertCircle;
      case "info": return Info;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "clip": return "#8B5CF6";
      case "user": return "#10B981";
      case "billing": return "#3B82F6";
      case "alert": return "#F59E0B";
      case "info": return "#6B7280";
      default: return "#6B7280";
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", marginBottom: "8px" }}>
            Notifications
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Manage your notification preferences
          </p>
        </div>
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "var(--surface)",
          color: "white",
          padding: "10px 16px",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          cursor: "pointer",
          fontWeight: 500
        }}>
          <Check size={18} />
          Mark all as read
        </button>
      </div>

      {/* Notification Settings */}
      <div style={{ 
        backgroundColor: "var(--surface)", 
        borderRadius: "12px", 
        border: "1px solid var(--border)",
        padding: "20px"
      }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "white", marginBottom: "16px" }}>
          Notification Settings
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { label: "Email notifications", description: "Receive email updates about your clips", enabled: true },
            { label: "Push notifications", description: "Get push notifications on your devices", enabled: true },
            { label: "Marketing emails", description: "Receive news and updates from OPusClip", enabled: false },
            { label: "Weekly digest", description: "Get a weekly summary of your activity", enabled: true },
          ].map((setting, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "white", fontSize: "14px", fontWeight: 500 }}>{setting.label}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{setting.description}</div>
              </div>
              <button style={{
                width: "48px",
                height: "24px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: setting.enabled ? "var(--primary)" : "var(--border)",
                cursor: "pointer",
                position: "relative"
              }}>
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "white",
                  position: "absolute",
                  top: "2px",
                  left: setting.enabled ? "26px" : "2px",
                  transition: "left 0.2s"
                }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ 
        backgroundColor: "var(--surface)", 
        borderRadius: "12px", 
        border: "1px solid var(--border)",
        overflow: "hidden"
      }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "white" }}>
            Recent Notifications
          </h3>
        </div>
        {notifications.map((notification, index) => {
          const Icon = getNotificationIcon(notification.type);
          const color = getNotificationColor(notification.type);
          
          return (
            <div 
              key={index}
              style={{ 
                display: "flex", 
                alignItems: "flex-start", 
                gap: "16px",
                padding: "16px 20px",
                backgroundColor: notification.read ? "transparent" : "rgba(139, 92, 246, 0.1)",
                borderBottom: index < notifications.length - 1 ? "1px solid var(--border)" : "none"
              }}
            >
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: `${color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Icon size={18} style={{ color }} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ color: "white", fontSize: "14px", fontWeight: notification.read ? 400 : 600 }}>
                  {notification.title}
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>
                  {notification.message}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "8px" }}>
                  {notification.time}
                </div>
              </div>
              
              {!notification.read && (
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary)",
                  flexShrink: 0,
                  marginTop: "6px"
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
