export default function handler(req, res) {
  res.status(200).json({
    source: "none",
    message: "No integrations connected yet. KPIs unavailable.",
    kpis: null
  });
}
