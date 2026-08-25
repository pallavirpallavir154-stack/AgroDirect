import { Users, Sprout, ClipboardList, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Card from '../../components/ui/Card'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorState from '../../components/ui/ErrorState'
import { useMockQuery, delayed } from '../../lib/useMockQuery'
import { MOCK_STATS, MOCK_USER_GROWTH, MOCK_RECENT_ACTIVITY } from '../../mock/dashboard'

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-canopy-800/10 text-canopy-800">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-soil-500">{label}</p>
          <p className="font-display text-2xl font-semibold text-soil-900">{value}</p>
        </div>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const { data, loading, error, refetch } = useMockQuery(() => delayed(MOCK_STATS, 500), [])

  if (loading) return <LoadingSpinner label="Loading dashboard…" />
  if (error) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-harvest-500/15 px-4 py-2 text-xs font-medium text-harvest-600">
        Demo data — connect the backend at <code>/admin/stats</code> to replace these figures.
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={data.totalUsers} />
        <StatCard icon={Sprout} label="Farmers" value={data.totalFarmers} />
        <StatCard icon={Users} label="Buyers" value={data.totalBuyers} />
        <StatCard icon={Sprout} label="Products" value={data.totalProducts} />
        <StatCard icon={ClipboardList} label="Total Orders" value={data.totalOrders} />
        <StatCard icon={Clock} label="Pending Orders" value={data.pendingOrders} />
        <StatCard icon={ClipboardList} label="Completed Orders" value={data.completedOrders} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-display text-base font-semibold text-soil-900">User growth</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_USER_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E2D9" />
                <XAxis dataKey="month" stroke="#6B6455" fontSize={12} />
                <YAxis stroke="#6B6455" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#E5E2D9', fontSize: 12 }} />
                <Line type="monotone" dataKey="farmers" stroke="#1B4D3C" strokeWidth={2} dot={false} name="Farmers" />
                <Line type="monotone" dataKey="buyers" stroke="#D9A22E" strokeWidth={2} dot={false} name="Buyers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-display text-base font-semibold text-soil-900">Recent activity</h2>
          <ul className="space-y-3">
            {MOCK_RECENT_ACTIVITY.map((item) => (
              <li key={item.id} className="text-sm">
                <p className="text-soil-800">{item.text}</p>
                <p className="text-xs text-soil-500">{item.time}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
