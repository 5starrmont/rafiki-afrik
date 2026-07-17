import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-heading font-black text-primary mb-2">Welcome back, Ian</h1>
        <p className="text-base text-gray-500 font-medium">Here is an overview of what is happening across Rafiki Afrik today.</p>
      </div>

      {/* ── High-Level Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Publications</h3>
          <p className="text-4xl font-black text-primary">0</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Active Documentaries</h3>
          <p className="text-4xl font-black text-secondary">0</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Platform Views</h3>
          <p className="text-4xl font-black text-gray-900">0</p>
        </div>
      </div>

      {/* ── Quick Jump Section ── */}
      <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-heading font-bold text-primary mb-2">Ready to make an impact?</h2>
        <p className="text-gray-600 mb-6">Head over to your content hubs to start publishing your grassroots stories and documentaries.</p>
        <div className="flex justify-center gap-4">
          <Link to="/admin/impact-pulse" className="bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm">
            Open Impact Pulse
          </Link>
          <Link to="/admin/hadithi-afrika" className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm">
            Open Hadithi Afrika
          </Link>
        </div>
      </div>
    </div>
  )
}