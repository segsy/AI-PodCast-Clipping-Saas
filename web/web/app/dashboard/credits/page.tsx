"use client";

import { useState } from "react";
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Download,
  Filter,
  Calendar,
  Zap,
  Film,
  Image,
  FileText,
  Plus
} from "lucide-react";

const creditTransactions = [
  { id: 1, type: "clip_generation", amount: -50, description: "Generated 10 clips from video", date: "2 hours ago", remaining: 1250 },
  { id: 2, type: "caption_generation", amount: -25, description: "Generated captions for 5 minutes", date: "5 hours ago", remaining: 1300 },
  { id: 3, type: "thumbnail_generation", amount: -30, description: "Generated 3 thumbnails", date: "1 day ago", remaining: 1325 },
  { id: 4, type: "purchase", amount: 500, description: "Purchased credits", date: "2 days ago", remaining: 1355 },
  { id: 5, type: "clip_generation", amount: -80, description: "Generated 16 clips from video", date: "3 days ago", remaining: 855 },
  { id: 6, type: "caption_generation", amount: -45, description: "Generated captions for 9 minutes", date: "4 days ago", remaining: 935 },
  { id: 7, type: "thumbnail_generation", amount: -20, description: "Generated 2 thumbnails", date: "5 days ago", remaining: 980 },
  { id: 8, type: "purchase", amount: 1000, description: "Purchased credits (bonus 100)", date: "1 week ago", remaining: 1000 },
];

const typeIcons: Record<string, any> = {
  clip_generation: Film,
  caption_generation: FileText,
  thumbnail_generation: Image,
  purchase: CreditCard,
};

const typeColors: Record<string, string> = {
  clip_generation: "var(--primary)",
  caption_generation: "var(--accent)",
  thumbnail_generation: "var(--success)",
  purchase: "var(--warning)",
};

export default function CreditsPage() {
  const [timeFilter, setTimeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const totalCredits = 1250;
  const monthlyUsed = 750;
  const monthlyLimit = 2000;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Credit Usage History</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Track your credit usage and purchases</p>
        </div>
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          backgroundColor: "var(--primary)",
          border: "none",
          borderRadius: "8px",
          color: "white",
          fontWeight: 500,
          cursor: "pointer"
        }}>
          <Plus size={18} />
          Buy Credits
        </button>
      </div>

      {/* Credit Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={20} style={{ color: "white" }} />
            </div>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Available</span>
          </div>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{totalCredits.toLocaleString()}</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>credits remaining</p>
        </div>

        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--error)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingDown size={20} style={{ color: "white" }} />
            </div>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>This Month</span>
          </div>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{monthlyUsed.toLocaleString()}</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>credits used</p>
        </div>

        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--success)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={20} style={{ color: "white" }} />
            </div>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Monthly Limit</span>
          </div>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{monthlyLimit.toLocaleString()}</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>credits / month</p>
        </div>

        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--warning)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CreditCard size={20} style={{ color: "white" }} />
            </div>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Next Billing</span>
          </div>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>15</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>days remaining</p>
        </div>
      </div>

      {/* Usage Progress */}
      <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Monthly Usage</h2>
          <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            {monthlyUsed} / {monthlyLimit} credits ({Math.round((monthlyUsed / monthlyLimit) * 100)}%)
          </span>
        </div>
        <div style={{ width: "100%", height: "12px", backgroundColor: "var(--surface-hover)", borderRadius: "6px", overflow: "hidden" }}>
          <div 
            style={{ 
              width: `${(monthlyUsed / monthlyLimit) * 100}%`, 
              height: "100%", 
              backgroundColor: (monthlyUsed / monthlyLimit) > 0.8 ? "var(--error)" : (monthlyUsed / monthlyLimit) > 0.5 ? "var(--warning)" : "var(--primary)",
              borderRadius: "6px",
              transition: "width 0.3s"
            }} 
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>0</span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{monthlyLimit}</span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Calendar size={18} style={{ color: "var(--text-muted)" }} />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "white",
              fontSize: "14px"
            }}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Filter size={18} style={{ color: "var(--text-muted)" }} />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: "8px 12px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "white",
              fontSize: "14px"
            }}
          >
            <option value="all">All Types</option>
            <option value="clip_generation">Clip Generation</option>
            <option value="caption_generation">Caption Generation</option>
            <option value="thumbnail_generation">Thumbnail Generation</option>
            <option value="purchase">Purchases</option>
          </select>
        </div>
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          color: "white",
          fontSize: "14px",
          cursor: "pointer",
          marginLeft: "auto"
        }}>
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Transactions */}
      <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Transaction History</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {creditTransactions.map((transaction) => {
            const Icon = typeIcons[transaction.type] || CreditCard;
            const color = typeColors[transaction.type] || "var(--primary)";
            const isPurchase = transaction.amount > 0;
            
            return (
              <div
                key={transaction.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--border)",
                  transition: "background-color 0.2s"
                }}
                className="hover:bg-surface-hover"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: color + "20",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, color: "white" }}>{transaction.description}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                      <Clock size={12} style={{ color: "var(--text-muted)" }} />
                      <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{transaction.date}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ 
                      fontSize: "16px", 
                      fontWeight: 600, 
                      color: isPurchase ? "var(--success)" : "var(--error)" 
                    }}>
                      {isPurchase ? "+" : ""}{transaction.amount}
                    </p>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {transaction.remaining} remaining
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
