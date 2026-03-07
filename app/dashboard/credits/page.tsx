"use client";

import { useState, useEffect } from "react";
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
  Plus,
  RefreshCw,
  AlertCircle,
  Check,
  X
} from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
}

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  bonus: number;
}

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
  const [credits, setCredits] = useState(0);
  const [monthlyUsed, setMonthlyUsed] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(0);
  const [nextBillingDate, setNextBillingDate] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/credits');
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits || 0);
        setMonthlyUsed(data.monthlyUsed || 0);
        setMonthlyLimit(data.monthlyLimit || 0);
        setNextBillingDate(data.nextBillingDate);
        setTransactions(data.transactions || []);
        setPackages(data.packages || []);
      }
    } catch (err) {
      console.error("Error fetching credits:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCredits = async (pkg: CreditPackage) => {
    try {
      setPurchasing(pkg.id);
      setError(null);

      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkg.id })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create checkout session');
        return;
      }

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError('Failed to purchase credits');
    } finally {
      setPurchasing(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const formatNextBilling = () => {
    if (!nextBillingDate) return "N/A";
    const date = new Date(nextBillingDate);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const filteredTransactions = transactions.filter(t => {
    // Time filter
    if (timeFilter !== "all") {
      const date = new Date(t.date);
      const now = new Date();
      
      if (timeFilter === "today") {
        if (date.toDateString() !== now.toDateString()) return false;
      } else if (timeFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (date < weekAgo) return false;
      } else if (timeFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (date < monthAgo) return false;
      }
    }

    // Type filter
    if (typeFilter !== "all" && t.type !== typeFilter) {
      return false;
    }

    return true;
  });

  const usagePercentage = monthlyLimit > 0 ? Math.min((monthlyUsed / monthlyLimit) * 100, 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>Credit Usage History</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Track your credit usage and purchases</p>
        </div>
        <button 
          onClick={() => setShowPurchaseModal(true)}
          style={{
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
          }}
        >
          <Plus size={18} />
          Buy Credits
        </button>
      </div>

      {error && (
        <div style={{
          padding: "12px",
          backgroundColor: "var(--error)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "white"
        }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Credit Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={20} style={{ color: "white" }} />
            </div>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Available</span>
          </div>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{loading ? "..." : credits.toLocaleString()}</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>credits remaining</p>
        </div>

        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--error)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingDown size={20} style={{ color: "white" }} />
            </div>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>This Month</span>
          </div>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{loading ? "..." : monthlyUsed.toLocaleString()}</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>credits used</p>
        </div>

        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--success)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={20} style={{ color: "white" }} />
            </div>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Monthly Limit</span>
          </div>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{loading ? "..." : monthlyLimit.toLocaleString()}</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>credits / month</p>
        </div>

        <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "var(--warning)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CreditCard size={20} style={{ color: "white" }} />
            </div>
            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Next Billing</span>
          </div>
          <p style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{loading ? "..." : formatNextBilling()}</p>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>days remaining</p>
        </div>
      </div>

      {/* Usage Progress */}
      <div style={{ backgroundColor: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>Monthly Usage</h2>
          <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            {monthlyUsed.toLocaleString()} / {monthlyLimit.toLocaleString()} credits ({Math.round(usagePercentage)}%)
          </span>
        </div>
        <div style={{ width: "100%", height: "12px", backgroundColor: "var(--surface-hover)", borderRadius: "6px", overflow: "hidden" }}>
          <div 
            style={{ 
              width: `${usagePercentage}%`, 
              height: "100%", 
              backgroundColor: usagePercentage > 80 ? "var(--error)" : usagePercentage > 50 ? "var(--warning)" : "var(--primary)",
              borderRadius: "6px",
              transition: "width 0.3s"
            }} 
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>0</span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{monthlyLimit.toLocaleString()}</span>
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
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto" }} />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            No transactions yet
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredTransactions.map((transaction) => {
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
                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{formatDate(transaction.date)}</span>
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: "var(--surface)",
            borderRadius: "16px",
            border: "1px solid var(--border)",
            width: "100%",
            maxWidth: "560px",
            padding: "24px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "white" }}>Buy Credits</h2>
              <button
                onClick={() => setShowPurchaseModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
              {packages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => handleBuyCredits(pkg)}
                  disabled={purchasing === pkg.id}
                  style={{
                    padding: "20px",
                    backgroundColor: "var(--surface-hover)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    cursor: purchasing === pkg.id ? "not-allowed" : "pointer",
                    textAlign: "left"
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "white", marginBottom: "8px" }}>
                    {pkg.name}
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "4px" }}>
                    {pkg.credits.toLocaleString()}
                  </div>
                  {pkg.bonus > 0 && (
                    <div style={{ fontSize: "12px", color: "var(--success)", marginBottom: "8px" }}>
                      +{pkg.bonus} bonus credits
                    </div>
                  )}
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--primary)" }}>
                    ${pkg.price}
                  </div>
                  {purchasing === pkg.id && (
                    <div style={{ marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", color: "var(--text-muted)" }}>
                      <RefreshCw size={16} className="animate-spin" />
                      Processing...
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
