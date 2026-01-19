                                                                                                                        import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  CartesianChart,
  Bar,
  BarGroup,
  Line,
  Pie,
  PieSliceData,
  PolarChart,
} from "victory-native";
import { Colors, Typography, Spacing, BorderRadius } from "@/constants";
import { DailyActivity, CategoryBreakdown, BalancePoint } from "@/utils/calculations/analytics";

interface ChartProps<T> {
  data: T[];
  title: string;
}

export const ActivityBarChart = ({ data, title }: ChartProps<DailyActivity>) => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={{ height: 220 }}>
        <CartesianChart
          data={data}
          xKey="date"
          yKeys={["earned", "spent"]}
          domainPadding={{ left: 20, right: 20, top: 20 }}
          axisOptions={{
            tickCount: 5,
            labelOffset: 10,
            lineColor: Colors.border.light,
            labelColor: Colors.text.tertiary,
          }}
        >
          {({ points, chartBounds }) => (
            <BarGroup
              chartBounds={chartBounds}
              betweenGroupPadding={0.3}
              withinGroupPadding={0.1}
              roundedCorners={{ topLeft: 4, topRight: 4 }}
            >
              <BarGroup.Bar
                points={points.earned}
                color={Colors.success[500]}
              />
              <BarGroup.Bar
                 points={points.spent}
                 color={Colors.error[500]}
              />
            </BarGroup>
          )}
        </CartesianChart>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.success[500] }]} />
          <Text style={styles.legendText}>Earned</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.error[500] }]} />
          <Text style={styles.legendText}>Spent</Text>
        </View>
      </View>
    </View>
  );
};

export const BalanceLineChart = ({ data, title }: ChartProps<BalancePoint>) => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={{ height: 220 }}>
        <CartesianChart
          data={data}
          xKey="date"
          yKeys={["balance"]}
          axisOptions={{
            tickCount: 5,
            labelOffset: 10,
            lineColor: Colors.border.light,
            labelColor: Colors.text.tertiary,
          }}
        >
          {({ points }) => (
            <Line
              points={points.balance}
              color={Colors.primary[500]}
              strokeWidth={3}
            />
          )}
        </CartesianChart>
      </View>
    </View>
  );
};

export const CategoryPieChart = ({ data, title }: ChartProps<CategoryBreakdown>) => {
  const chartColors = [
    Colors.primary[500],
    Colors.success[500],
    Colors.accent[500],
    Colors.warning[500],
    Colors.error[500],
  ];

  const pieData = data.map((item, index) => ({
    value: item.count,
    color: chartColors[index % chartColors.length],
    label: item.category,
  }));

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.pieWrapper}>
        <View style={{ width: 150, height: 150 }}>
          <PolarChart
            data={pieData}
            colorKey="color"
            valueKey="value"
            labelKey="label"
          >
            <Pie.Chart>
              {({ slice }: { slice: PieSliceData }) => (
                <Pie.Slice />
              )}
            </Pie.Chart>
          </PolarChart>
        </View>
        <View style={styles.pieLegend}>
          {pieData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label} ({item.value})</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  chartTitle: {
    fontFamily: Typography.fontFamily.brandBold,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: Typography.fontFamily.brandMedium,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  pieWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.sm,
  },
  pieLegend: {
    flex: 1,
    marginLeft: Spacing.xl,
    gap: Spacing.xs,
  },
});
