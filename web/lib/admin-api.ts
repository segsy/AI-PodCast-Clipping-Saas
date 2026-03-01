// Admin API client library
// Used by admin pages to fetch and manage data

const API_BASE = "/api/admin";

// Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  avatarUrl?: string;
  emailVerified?: Date | string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
  role?: string;
  status?: string;
  isAdmin?: boolean;
  workspaceCount?: number;
}

export interface AdminClip {
  id: string;
  title: string;
  description?: string;
  status: string;
  duration?: number;
  thumbnailUrl?: string;
  videoUrl?: string;
  projectId?: string;
  workspaceId?: string;
  jobId?: string;
  score?: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
  project?: {
    id: string;
    name: string;
  };
  workspace?: {
    id: string;
    name: string;
  };
}

export interface AdminWorkspace {
  id: string;
  name: string;
  slug: string;
  createdBy: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  memberCount?: number;
  ownerName?: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  subscription?: {
    id: string;
    status: string;
    plan: string;
    planId?: string;
  };
  credits?: number;
}

export interface AdminBilling {
  id: string;
  workspaceId: string;
  status: string;
  plan: string;
  currentPeriodStart: Date | string;
  currentPeriodEnd: Date | string;
  cancelAtPeriodEnd: boolean;
  createdAt: Date | string;
  workspace?: {
    id: string;
    name: string;
    slug: string;
  };
  credits?: number;
}

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ListResponse<T> {
  users?: T[];
  clips?: T[];
  workspaces?: T[];
  subscriptions?: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statusCounts?: Record<string, number>;
}

// Helper function for API calls
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `Failed to fetch ${endpoint}`);
  }

  return response.json();
}

// Admin Users API
export const adminUsers = {
  list: async (params: ListParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const query = searchParams.toString();
    return fetchAPI<{ users: AdminUser[]; total: number; page: number; limit: number; totalPages: number }>(
      `/users${query ? `?${query}` : ""}`
    );
  },

  get: async (id: string) => {
    return fetchAPI<AdminUser>(`/users/${id}`);
  },

  create: async (data: { email: string; name?: string; password: string; role?: string }) => {
    return fetchAPI<AdminUser>(`/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: { role?: string }) => {
    return fetchAPI<AdminUser>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchAPI<void>(`/users/${id}`, {
      method: "DELETE",
    });
  },

  export: async (params: ListParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const query = searchParams.toString();
    // For export, we'll fetch all users
    const response = await fetchAPI<{ users: AdminUser[]; total: number }>(
      `/users${query ? `?${query}` : ""}&limit=10000`
    );
    return response;
  },
};

// Admin Clips API
export const adminClips = {
  list: async (params: ListParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.status) searchParams.set("status", params.status);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const query = searchParams.toString();
    return fetchAPI<{ clips: AdminClip[]; total: number; page: number; limit: number; totalPages: number; statusCounts: Record<string, number> }>(
      `/clips${query ? `?${query}` : ""}`
    );
  },

  get: async (id: string) => {
    return fetchAPI<AdminClip>(`/clips/${id}`);
  },

  updateStatus: async (clipId: string, status: string) => {
    return fetchAPI<AdminClip>(`/clips`, {
      method: "PATCH",
      body: JSON.stringify({ clipId, status }),
    });
  },

  delete: async (id: string) => {
    return fetchAPI<void>(`/clips/${id}`, {
      method: "DELETE",
    });
  },
};

// Admin Billing API
export const adminBilling = {
  list: async (params: ListParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.status) searchParams.set("status", params.status);

    const query = searchParams.toString();
    return fetchAPI<{
      subscriptions: AdminBilling[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      stats: {
        activeCount: number;
        trialCount: number;
        pastDueCount: number;
        cancelledCount: number;
        totalCredits: number;
      };
    }>(`/billing${query ? `?${query}` : ""}`);
  },

  get: async (id: string) => {
    return fetchAPI<AdminBilling>(`/billing/${id}`);
  },

  create: async (data: { workspaceId: string; planId: string; interval?: string; status?: string; stripeSubscriptionId?: string }) => {
    return fetchAPI<{ subscription: AdminBilling }>(`/billing`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: { status?: string; planId?: string; interval?: string }) => {
    return fetchAPI<{ subscription: AdminBilling }>(`/billing`, {
      method: "PATCH",
      body: JSON.stringify({ subscriptionId: id, ...data }),
    });
  },

  delete: async (id: string) => {
    return fetchAPI<{ message: string; subscription: AdminBilling }>(`/billing?id=${id}`, {
      method: "DELETE",
    });
  },
};

// Admin Workspaces API
export const adminWorkspaces = {
  list: async (params: ListParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const query = searchParams.toString();
    return fetchAPI<{ workspaces: AdminWorkspace[]; total: number; page: number; limit: number; totalPages: number }>(
      `/workspaces${query ? `?${query}` : ""}`
    );
  },

  get: async (id: string) => {
    return fetchAPI<AdminWorkspace>(`/workspaces/${id}`);
  },

  update: async (id: string, data: { name?: string; slug?: string }) => {
    return fetchAPI<AdminWorkspace>(`/workspaces/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchAPI<void>(`/workspaces/${id}`, {
      method: "DELETE",
    });
  },
};

// Grant admin role (using the endpoint we created earlier)
export const adminUtils = {
  grantRole: async (userId: string, role: string = "ADMIN") => {
    return fetchAPI<{ success: boolean; message: string }>("/grant-role", {
      method: "POST",
      body: JSON.stringify({ userId, role }),
    });
  },
};

// Admin Analytics API
export const adminAnalytics = {
  get: async (params: { period?: string } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.period) searchParams.set("period", params.period);
    
    const query = searchParams.toString();
    return fetchAPI<{
      totalUsers: number;
      totalClips: number;
      totalWorkspaces: number;
      totalSubscriptions: number;
      activeUsers: number;
      newUsers: number;
      newClips: number;
      newWorkspaces: number;
      userGrowth: number;
      clipGrowth: number;
      workspaceGrowth: number;
      subscriptionGrowth: number;
      period: string;
      userTrend: Array<{ date: string; count: number }>;
      clipTrend: Array<{ date: string; count: number }>;
      workspaceTrend: Array<{ date: string; count: number }>;
      subscriptionTrend: Array<{ date: string; count: number }>;
      topWorkspaces: Array<{ id: string; name: string; clipCount: number }>;
      topUsers: Array<{ id: string; name: string; email: string; clipCount: number }>;
    }>(`/analytics${query ? `?${query}` : ""}`);
  },
};

// Admin Activity API
export const adminActivity = {
  list: async (params: ListParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());

    const query = searchParams.toString();
    return fetchAPI<{
      events: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      summary: {
        byType: Array<{ type: string; count: number }>;
      };
      recentActivity: Array<{ date: string; count: number }>;
    }>(`/activity${query ? `?${query}` : ""}`);
  },
};
