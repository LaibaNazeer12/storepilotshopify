// DEMO DATA — not from a connected Shopify store.
export const demoStore = {
  name: "Demo Store (sample data)",
  period: "Last 30 days",
  revenue: 48230,
  revenueChange: 12.4,
  orders: 612,
  ordersChange: 8.1,
  aov: 78.8,
  aovChange: 3.9,
  returningRate: 31,
  topProducts: [
    { name: "Organic Cotton Hoodie", units: 142, revenue: 9940 },
    { name: "Everyday Canvas Tote", units: 210, revenue: 6300 },
    { name: "Merino Crew Socks (3-pack)", units: 188, revenue: 4700 },
    { name: "Recycled Denim Jacket", units: 39, revenue: 4290 },
    { name: "Linen Bucket Hat", units: 96, revenue: 2880 },
  ],
  weekly: [
    { week: "W1", revenue: 9800, orders: 128 },
    { week: "W2", revenue: 10450, orders: 134 },
    { week: "W3", revenue: 11200, orders: 141 },
    { week: "W4", revenue: 12980, orders: 160 },
    { week: "W5", revenue: 3800, orders: 49 },
  ],
  daily: [
    3100, 2950, 3400, 3650, 3200, 2800, 3900, 4100, 3700, 3550, 3980, 4200, 3850, 4400,
  ],
  notes: [
    "Cart abandonment rate: 68%",
    "Mobile share of sessions: 74%, mobile conversion 1.6% vs desktop 3.1%",
    "Recycled Denim Jacket has the highest return rate (14%), reason: sizing",
  ],
};

export const demoRecommendations = [
  {
    priority: "High",
    title: "Fix mobile checkout friction",
    detail: "Mobile converts at about half the desktop rate while driving 74% of traffic. Test express checkout and a shorter form.",
  },
  {
    priority: "High",
    title: "Add a size guide to the Denim Jacket",
    detail: "14% return rate citing sizing. A fit chart and model measurements can cut returns and support costs.",
  },
  {
    priority: "Medium",
    title: "Bundle the Tote with the Hoodie",
    detail: "Your two best sellers pair well. A small bundle discount can lift average order value.",
  },
];

export function storeContextText() {
  const s = demoStore;
  return [
    `STORE DATA (DEMO SAMPLE, not a real connected Shopify store) — ${s.period}:`,
    `Revenue $${s.revenue} (${s.revenueChange}% vs prior), Orders ${s.orders}, AOV $${s.aov}, Returning customer rate ${s.returningRate}%.`,
    `Top products: ${s.topProducts.map((p) => `${p.name} (${p.units} units, $${p.revenue})`).join("; ")}.`,
    `Weekly revenue: ${s.weekly.map((w) => `${w.week} $${w.revenue}`).join(", ")} (W5 is partial).`,
    `Notes: ${s.notes.join("; ")}.`,
  ].join("\n");
}
