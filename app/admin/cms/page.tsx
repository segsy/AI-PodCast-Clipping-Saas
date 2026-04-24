"use client";

import Link from "next/link";
import { FileText, ArrowRight, Menu } from "lucide-react";

const cmsSections = [
  {
    name: "Pages",
    description: "Manage static pages and content",
    href: "/admin/cms/pages",
    icon: FileText,
  },
  {
    name: "Menus",
    description: "Manage navigation menus and links",
    href: "/admin/cms/menus",
    icon: Menu,
  },
];

export default function CMSPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Content Management System</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cmsSections.map((section) => (
          <Link
            key={section.name}
            href={section.href}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}