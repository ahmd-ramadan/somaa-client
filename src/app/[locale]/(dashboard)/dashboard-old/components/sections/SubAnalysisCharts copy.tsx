"use client";

import { AnalysisClassifyEnum, IAnalysis } from "@/interfaces/analysis.types";
import { motion } from "framer-motion";
import { BarChart as BarChartIcon, LineChart, TrendingUp } from "lucide-react";
import { IDashboardSubAnalysis } from "./types";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getTotalStatistics } from "@/utils/numbers";

interface ISubAnalysischarts {
  allAnalysis: IAnalysis[];
}

const SubAnalysisCharts = ({ allAnalysis }: ISubAnalysischarts) => {
  const [maxClassificationsType, setMaxClassificationsType] =
    useState<AnalysisClassifyEnum>(AnalysisClassifyEnum.POSITIVE);
  const [allSubAnalysis, setAllSubAnalysis] = useState<IDashboardSubAnalysis[]>(
    [],
  );

  useEffect(() => {
    if (allAnalysis) {
      setMaxClassificationsType(deriveClassifications(allAnalysis));
      setAllSubAnalysis(deriveSubAnalysis(allAnalysis));
    }
  }, [allAnalysis]);

  const deriveClassifications = (
    analysisData: IAnalysis[],
  ): AnalysisClassifyEnum => {
    const positiveAnalysis = analysisData.filter(
      (a) => a.classify === AnalysisClassifyEnum.POSITIVE,
    ).length;
    const nuetralAnalysis = analysisData.filter(
      (a) => a.classify === AnalysisClassifyEnum.NEUTRAL,
    ).length;
    const negativeAnalysis = analysisData.filter(
      (a) => a.classify === AnalysisClassifyEnum.NEGATIVE,
    ).length;

    if (
      positiveAnalysis >= negativeAnalysis &&
      positiveAnalysis >= nuetralAnalysis
    )
      return AnalysisClassifyEnum.POSITIVE;
    if (
      nuetralAnalysis >= negativeAnalysis &&
      nuetralAnalysis >= positiveAnalysis
    )
      return AnalysisClassifyEnum.NEUTRAL;
    if (
      negativeAnalysis >= nuetralAnalysis &&
      negativeAnalysis >= positiveAnalysis
    )
      return AnalysisClassifyEnum.NEGATIVE;
    return AnalysisClassifyEnum.POSITIVE;
  };

  const deriveSubAnalysis = (
    analysisData: IAnalysis[],
  ): IDashboardSubAnalysis[] => {
    const analysisMap = new Map<
      string,
      { count: number; classifications: Map<AnalysisClassifyEnum, number> }
    >();

    analysisData.forEach((analysis) => {
      const name = analysis.subAnalysisData.body;
      if (!name) return;

      if (!analysisMap.has(name)) {
        analysisMap.set(name, {
          count: 0,
          classifications: new Map<AnalysisClassifyEnum, number>(),
        });
      }

      const current = analysisMap.get(name)!;
      current.count++;

      // Update classifications count
      if (analysis.classify) {
        const currentCount =
          current.classifications.get(analysis.classify) || 0;
        current.classifications.set(analysis.classify, currentCount + 1);
      }
    });

    return Array.from(analysisMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      classifications: Array.from(data.classifications.entries()).map(
        ([type, count]) => ({
          type,
          count,
        }),
      ),
    }));
  };

  const getAreaChartData = () => {
    // Sort sub-analyses by total count
    const sortedAnalysis = [...allSubAnalysis].sort((a, b) => {
      const totalA = a.classifications.reduce((sum, c) => sum + c.count, 0);
      const totalB = b.classifications.reduce((sum, c) => sum + c.count, 0);
      return totalB - totalA;
    });

    // Get top 5 sub-analyses
    const top5 = sortedAnalysis.slice(0, 5);

    // Transform data for the chart
    return top5.map((item) => {
      // Get counts for each classification type
      const positive =
        item.classifications.find(
          (c) => c.type === AnalysisClassifyEnum.POSITIVE,
        )?.count || 0;
      const neutral =
        item.classifications.find(
          (c) => c.type === AnalysisClassifyEnum.NEUTRAL,
        )?.count || 0;
      const negative =
        item.classifications.find(
          (c) => c.type === AnalysisClassifyEnum.NEGATIVE,
        )?.count || 0;

      // Calculate total for this item
      const total = positive + neutral + negative;

      // Debug log to check values
      // console.log('SubAnalysis:', item.name, {
      //     positive,
      //     neutral,
      //     negative,
      //     total,
      //     classifications: item.classifications
      // });

      return {
        name:
          item.name.length > 20
            ? item.name.substring(0, 20) + "..."
            : item.name,
        positive,
        neutral,
        negative,
        total,
        // Add percentage calculations
        positivePercentage: total > 0 ? (positive / total) * 100 : 0,
        neutralPercentage: total > 0 ? (neutral / total) * 100 : 0,
        negativePercentage: total > 0 ? (negative / total) * 100 : 0,
      };
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-gray-700/50 p-1 over:shadow-xl transition-all duration-300">
      {/* Statistics Row */}
      <div className="flex justify-between items-center mb-1">
        <motion.div
          className="flex items-center gap-2 bg-gray-700/30 backdrop-blur-sm p-1 rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <BarChartIcon className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-300">إجمالي الرصد</span>
          <span className="text-sm font-semibold text-gray-300">
            {allAnalysis.length}
          </span>
        </motion.div>
        <motion.div
          className={`flex items-center gap-1 bg-gray-700/30 backdrop-blur-sm p-1 rounded-lg 
                        ${maxClassificationsType === AnalysisClassifyEnum.POSITIVE ? "text-green-400" : maxClassificationsType === AnalysisClassifyEnum.NEUTRAL ? "text-gray-400" : "text-red-400"}`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <TrendingUp className={`w-4 h-4`} />
          <span className="text-sm text-gray-300">إجمالي التفاعل</span>
          <span className={`text-sm`}>
            {allAnalysis
              .reduce(
                (acc, curr) => acc + getTotalStatistics(curr?.statistics),
                0,
              )
              .toLocaleString()}
          </span>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="w-full">
        {/* Classification Trend Chart */}
        <div className="bg-gray-700/30 backdrop-blur-sm p-2 rounded-lg w-full">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-blue-400" />
              اتجاه التحليلات
            </h4>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-gray-400">إيجابي</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <span className="text-xs text-gray-400">محايد</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs text-gray-400">سلبي</span>
              </div>
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={getAreaChartData()}
                margin={{ top: 10, right: 0, left: -30, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorPositive"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d1d5db" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d1d5db" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorNegative"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  padding={{ left: 0, right: 0 }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  axisLine={{ stroke: "#4B5563" }}
                  tickLine={{ stroke: "#4B5563" }}
                  padding={{ top: 10, bottom: 10 }}
                  tickMargin={24}
                  orientation="left"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(17, 24, 39, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#9CA3AF" }}
                  formatter={(value: number, name: string) => {
                    const data = getAreaChartData().find(
                      (d) => d.name === name,
                    );
                    if (!data) return [value, name];
                    const percentage =
                      name === "positive"
                        ? data.positivePercentage
                        : name === "neutral"
                          ? data.neutralPercentage
                          : data.negativePercentage;
                    return [`${value} (${percentage.toFixed(1)}%)`, name];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="positive"
                  stackId="1"
                  stroke="#22c55e"
                  fill="url(#colorPositive)"
                  name="إيجابي"
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  stackId="1"
                  stroke="#d1d5db"
                  fill="url(#colorNeutral)"
                  name="محايد"
                />
                <Area
                  type="monotone"
                  dataKey="negative"
                  stackId="1"
                  stroke="#ef4444"
                  fill="url(#colorNegative)"
                  name="سلبي"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAnalysisCharts;
