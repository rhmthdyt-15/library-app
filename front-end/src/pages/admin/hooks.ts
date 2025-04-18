import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { DashboardResponse } from "../../services/reports/interface";
import { getDashboardReportService } from "../../services/reports/http";

export const useDashboardData = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const data = await getDashboardReportService(token);
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  return { dashboardData, loading, error };
};
