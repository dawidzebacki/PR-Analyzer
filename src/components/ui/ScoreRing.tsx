"use client";

import { motion } from "framer-motion";
import { getScoreColor, getScoreClasses } from "@/constants";
import { AnimatedNumber } from "./AnimatedNumber";

interface ScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  animated?: boolean;
}

const sizes = {
  sm: { dimension: 64, stroke: 5, fontSize: "text-base", labelSize: "text-xs" },
  md: { dimension: 96, stroke: 6, fontSize: "text-2xl", labelSize: "text-xs" },
  lg: { dimension: 128, stroke: 8, fontSize: "text-3xl", labelSize: "text-sm" },
};

export function ScoreRing({
  score,
  size = "md",
  label,
  animated = false,
}: ScoreRingProps) {
  const { dimension, stroke, fontSize, labelSize } = sizes[size];
  const radius = (dimension - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = dimension / 2;
  const colorToken = getScoreColor(score);
  const strokeColor = `var(--color-${colorToken})`;
  const { text: textColorClass } = getScoreClasses(score);

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${dimension} ${dimension}`}
          className="-rotate-90"
          role="img"
          aria-label={label ? `${label}: ${score}` : `Score: ${score}`}
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth={stroke}
          />
          {animated ? (
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          ) : (
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {animated ? (
            <AnimatedNumber
              value={score}
              className={`font-bold ${fontSize} ${textColorClass}`}
            />
          ) : (
            <span className={`font-bold ${fontSize} ${textColorClass}`}>
              {score}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className={`${labelSize} font-medium text-text-muted`}>
          {label}
        </span>
      )}
    </div>
  );
}
