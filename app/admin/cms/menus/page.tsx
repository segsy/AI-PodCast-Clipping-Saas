"use client";

import { useState, useEffect } from "react";
import { Loader2, Edit, Eye, Plus, Trash2 } from "lucide-react";

interface Menu {
  id: string;
  category: string;
  name: string;
  href: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CMSMenusPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/menus');
      if (!response.ok) {
        throw new Error('Failed to fetch menus');
      }

      const data = await response.json();
      setMenus(data.menus);
    } catch (err: any) {
      console.error('Failed to fetch menus:', err);
      setError(err.message || 'Failed to fetch menus');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenu = async (menuData: Omit<Menu, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/admin/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData),
      });
      if (!response.ok) {
        throw new Error('Failed to create menu');
      }
      await fetchMenus();
      setShowCreateForm(false);
    } catch (err: any) {
      console.error('Failed to create menu:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Menu Item
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-background/50">
            <tr>
              <th className="text-left p-4 font-medium">Category</th>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Href</th>
              <th className="text-left p-4 font-medium">Description</th>
              <th className="text-left p-4 font-medium">Icon</th>
              <th className="text-left p-4 font-medium">Order</th>
              <th className="text-left p-4 font-medium">Active</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu.id} className="border-t border-border">
                <td className="p-4">{menu.category}</td>
                <td className="p-4">{menu.name}</td>
                <td className="p-4">{menu.href}</td>
                <td className="p-4">{menu.description}</td>
                <td className="p-4">{menu.icon}</td>
                <td className="p-4">{menu.sortOrder}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${menu.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {menu.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingMenu(menu)}
                      className="p-1 hover:bg-background rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 hover:bg-background rounded text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Form Modal would go here */}
    </div>
  );
}