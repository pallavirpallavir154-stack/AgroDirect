// ⚠️ MOCK DATA (Master Prompt §7, §25). Replace with real API calls once
// Member 1's backend exposes /admin/stats. Keep this isolated so swapping
// to real data means changing only this file + the hook that calls it.
export const MOCK_STATS = {
  totalUsers: 482,
  totalFarmers: 311,
  totalBuyers: 171,
  totalProducts: 926,
  totalOrders: 254,
  pendingOrders: 38,
  completedOrders: 189,
}

export const MOCK_USER_GROWTH = [
  { month: 'Mar', farmers: 40, buyers: 22 },
  { month: 'Apr', farmers: 62, buyers: 35 },
  { month: 'May', farmers: 98, buyers: 58 },
  { month: 'Jun', farmers: 150, buyers: 89 },
  { month: 'Jul', farmers: 231, buyers: 128 },
  { month: 'Aug', farmers: 311, buyers: 171 },
]

export const MOCK_RECENT_ACTIVITY = [
  { id: 1, text: 'Farmer Ravi Kumar listed 200kg of tomatoes', time: '12 min ago' },
  { id: 2, text: 'Order #1042 marked as Delivered', time: '38 min ago' },
  { id: 3, text: 'New buyer registration: Green Leaf Retailers', time: '1 hr ago' },
  { id: 4, text: 'Product listing "Basmati Rice — 500kg" pending approval', time: '2 hr ago' },
  { id: 5, text: 'Order #1039 cancelled by buyer', time: '3 hr ago' },
]
