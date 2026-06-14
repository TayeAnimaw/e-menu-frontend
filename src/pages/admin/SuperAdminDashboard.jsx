import { useEffect, useState } from 'react'
import apiClient from '../../api/client'
import { PageSpinner } from '../../components/Spinner'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1']
const PLAN_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981']

export default function SuperAdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    apiClient
      .get('/super-admin/analytics')
      .then(({ data }) => setData(data))
      .catch(() => setError('Failed to load analytics.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />
  if (error) return <p className="p-6 text-red-600">{error}</p>
  if (!data) return null

  const { overview, revenue_by_month, users_by_month, subscription_breakdown, plan_distribution, latest_activities, top_cafes } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-600 p-6 text-white shadow-xl sm:p-8">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Super Admin Analytics</h1>
        <p className="mt-1 text-sm text-white/70">Platform overview — all cafes &amp; revenue</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Total Owners" value={overview.total_owners} color="indigo" icon={<UsersIcon />} />
        <KpiCard label="Pending" value={overview.pending_approvals} color="amber" icon={<ClockIcon />} urgent={overview.pending_approvals > 0} />
        <KpiCard label="Active" value={overview.active_subscribers} color="emerald" icon={<CheckIcon />} />
        <KpiCard label="On Trial" value={overview.trial_users} color="sky" icon={<TrialIcon />} />
        <KpiCard label="Expired" value={overview.expired_users} color="red" icon={<XIcon />} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <RevenueCard label="Total Revenue" value={overview.total_revenue} sub="All time (ETB)" color="emerald" />
        <RevenueCard label="This Month" value={overview.revenue_this_month} sub="Revenue (ETB)" color="brand" />
        <RevenueCard label="New This Month" value={overview.new_users_this_month} sub="New registrations" color="indigo" plain />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue line chart */}
        <ChartCard title="Revenue (Last 6 Months)" sub="ETB earned per month">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenue_by_month} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={v => [`ETB ${Number(v).toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="amount" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: '#7c3aed' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* User growth bar chart */}
        <ChartCard title="New Registrations (Last 6 Months)" sub="Menu owners per month">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={users_by_month} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={v => [v, 'Users']} />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Donut + Bar row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Subscription breakdown donut */}
        <ChartCard title="Subscription Breakdown" sub="Status distribution of all owners">
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie
                  data={subscription_breakdown}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {subscription_breakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name) => [v, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {subscription_breakdown.map((item, i) => (
                <div key={item.status} className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-ink-600">{item.status}</span>
                  <span className="ml-auto font-semibold text-ink-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Plan distribution bar chart */}
        <ChartCard title="Plan Distribution" sub="Successful payments by plan">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={plan_distribution} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="plan" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={v => [v, 'Payments']} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {plan_distribution.map((_, i) => (
                  <Cell key={i} fill={PLAN_COLORS[i % PLAN_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Activity + Top cafes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Latest activity */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink-100">
          <h2 className="font-display text-base font-semibold text-ink-900">Latest Activity</h2>
          <p className="mt-0.5 text-xs text-ink-500">Recent registrations &amp; payments</p>
          <ul className="mt-4 space-y-3">
            {latest_activities.map((act, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${act.type === 'payment' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  {act.type === 'payment' ? '₿' : 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink-800">{act.message}</p>
                  <p className="text-xs text-ink-400">{act.time}</p>
                </div>
                <BadgePill status={act.badge} />
              </li>
            ))}
          </ul>
        </div>

        {/* Top cafes table */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink-100">
          <h2 className="font-display text-base font-semibold text-ink-900">Top Cafes</h2>
          <p className="mt-0.5 text-xs text-ink-500">By number of menu items</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
                  <th className="pb-2 pr-4">Cafe</th>
                  <th className="pb-2 pr-4">Items</th>
                  <th className="pb-2 pr-4">Plan</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {top_cafes.map((cafe, i) => (
                  <tr key={i} className="text-ink-700 hover:bg-ink-50">
                    <td className="py-2 pr-4">
                      <p className="font-medium">{cafe.cafe_name || '—'}</p>
                      <p className="text-xs text-ink-400">{cafe.subdomain}</p>
                    </td>
                    <td className="py-2 pr-4 font-semibold text-brand-700">{cafe.menu_items_count}</td>
                    <td className="py-2 pr-4 capitalize text-ink-500">{cafe.subscription_plan || '—'}</td>
                    <td className="py-2">
                      <BadgePill status={cafe.subscription_status} />
                    </td>
                  </tr>
                ))}
                {top_cafes.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-xs text-ink-400">No data yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom summary bar */}
      <div className="rounded-2xl bg-ink-900 px-6 py-4 text-white shadow-lg">
        <div className="flex flex-wrap gap-6 text-sm">
          <span><span className="text-ink-400">Total Items:</span> <strong>{overview.total_menu_items}</strong></span>
          <span><span className="text-ink-400">Total Categories:</span> <strong>{overview.total_categories}</strong></span>
          <span><span className="text-ink-400">Active Rate:</span> <strong>{overview.total_owners > 0 ? Math.round((overview.active_subscribers / overview.total_owners) * 100) : 0}%</strong></span>
          <span><span className="text-ink-400">Trial Conversion:</span> <strong>{(overview.trial_users + overview.active_subscribers) > 0 ? Math.round((overview.active_subscribers / (overview.trial_users + overview.active_subscribers)) * 100) : 0}%</strong></span>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value, color, icon, urgent }) {
  const colors = {
    indigo:  'from-indigo-50 to-indigo-100 text-indigo-700',
    amber:   'from-amber-50 to-amber-100 text-amber-700',
    emerald: 'from-emerald-50 to-emerald-100 text-emerald-700',
    sky:     'from-sky-50 to-sky-100 text-sky-700',
    red:     'from-red-50 to-red-100 text-red-700',
  }
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-100 transition hover:shadow-md ${urgent ? 'ring-amber-300' : ''}`}>
      {urgent && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-400 animate-pulse" />}
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${colors[color]}`}>
        {icon}
      </div>
      <p className="font-display text-2xl font-bold text-ink-900">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-ink-500">{label}</p>
    </div>
  )
}

function RevenueCard({ label, value, sub, color, plain }) {
  const gradients = {
    emerald: 'from-emerald-600 to-emerald-500',
    brand:   'from-brand-700 to-brand-500',
    indigo:  'from-indigo-600 to-indigo-500',
  }
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${gradients[color]} p-5 text-white shadow-md`}>
      <p className="text-sm font-medium text-white/70">{label}</p>
      <p className="font-display mt-1 text-3xl font-bold">
        {plain ? value : `${Number(value).toLocaleString()}`}
      </p>
      <p className="mt-1 text-xs text-white/60">{sub}</p>
    </div>
  )
}

function ChartCard({ title, sub, children }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink-100">
      <h2 className="font-display text-base font-semibold text-ink-900">{title}</h2>
      {sub && <p className="mt-0.5 text-xs text-ink-500">{sub}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

function BadgePill({ status }) {
  const map = {
    active:   'bg-emerald-100 text-emerald-700',
    trial:    'bg-sky-100 text-sky-700',
    expired:  'bg-red-100 text-red-700',
    pending:  'bg-amber-100 text-amber-700',
    success:  'bg-emerald-100 text-emerald-700',
    approved: 'bg-emerald-100 text-emerald-700',
  }
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${map[status] ?? 'bg-ink-100 text-ink-600'}`}>
      {status}
    </span>
  )
}

function UsersIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-5-3.87M9 20H4v-2a4 4 0 0 1 5-3.87M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6 8v-2a4 4 0 0 0-3-3.87M6 18v-2a4 4 0 0 1 3-3.87" /></svg>
}
function ClockIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
}
function CheckIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" /></svg>
}
function TrialIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016Z" /></svg>
}
function XIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
}
