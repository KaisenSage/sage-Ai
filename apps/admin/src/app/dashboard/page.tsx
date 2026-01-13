'use client';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Products</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">-</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Categories</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">-</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Branches</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">-</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Orders</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">-</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/categories"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="text-2xl mb-2">📁</div>
            <div className="font-medium">Manage Categories</div>
            <div className="text-sm text-gray-500">Create and organize product categories</div>
          </a>
          <a
            href="/dashboard/products"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="text-2xl mb-2">🛍️</div>
            <div className="font-medium">Manage Products</div>
            <div className="text-sm text-gray-500">Add and update your menu items</div>
          </a>
          <a
            href="/dashboard/branches"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="text-2xl mb-2">🏢</div>
            <div className="font-medium">Manage Branches</div>
            <div className="text-sm text-gray-500">Set up your business locations</div>
          </a>
        </div>
      </div>
    </div>
  );
}
