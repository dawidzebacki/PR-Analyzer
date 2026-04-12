"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";

const ARC_CIRCUMFERENCE = 2 * Math.PI * 60;

const BARS = [
  { x: 270, height: 50, fill: "url(#hero-grad-2)", opacity: 1, label: "IMP", delay: 0.9 },
  { x: 302, height: 80, fill: "url(#hero-grad-3)", opacity: 1, label: "AI", delay: 1.05 },
  { x: 334, height: 65, fill: "#0070F3", opacity: 0.6, label: "QAL", delay: 1.2 },
  { x: 366, height: 95, fill: "url(#hero-grad-2)", opacity: 1, label: "TOT", delay: 1.35 },
] as const;

const BAR_BOTTOM = 265;

interface AnimatedScoreProps {
  inView: boolean;
  scoreLabel: string;
}

function AnimatedScore({ inView, scoreLabel }: AnimatedScoreProps) {
  const scoreValue = useMotionValue(0);
  const [displayScore, setDisplayScore] = useState(0);

  const strokeOffset = useTransform(
    scoreValue,
    (v) => ARC_CIRCUMFERENCE * (1 - v / 100),
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(scoreValue, 82, {
      duration: 1.4,
      ease: "easeOut",
      delay: 0.5,
    });
    const unsubscribe = scoreValue.on("change", (v) =>
      setDisplayScore(Math.round(v)),
    );
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [inView, scoreValue]);

  return (
    <>
      <circle
        cx="160"
        cy="180"
        r="60"
        stroke="#E8ECFC"
        strokeWidth="8"
        fill="none"
      />
      <motion.circle
        cx="160"
        cy="180"
        r="60"
        stroke="url(#hero-grad-2)"
        strokeWidth="8"
        fill="none"
        strokeDasharray={ARC_CIRCUMFERENCE}
        style={{ strokeDashoffset: strokeOffset }}
        strokeLinecap="round"
        transform="rotate(-90 160 180)"
      />
      <text
        x="160"
        y="175"
        textAnchor="middle"
        fontSize="28"
        fontWeight="700"
        fill="#1D253B"
      >
        {displayScore}
      </text>
      <text
        x="160"
        y="198"
        textAnchor="middle"
        fontSize="12"
        fill="#6B6F85"
      >
        {scoreLabel}
      </text>
    </>
  );
}

interface HeroIllustrationProps {
  scoreLabel: string;
  prsAnalyzedLabel: string;
  qualityBadgeLabel: string;
}

export function HeroIllustration({ scoreLabel, prsAnalyzedLabel, qualityBadgeLabel }: HeroIllustrationProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-grad-1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4E43E1" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0070F3" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="hero-grad-2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4E43E1" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3B2FA0" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="hero-grad-3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#35BA80" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#35BA80" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <rect x="40" y="30" width="400" height="360" rx="16" fill="white" />
      <rect
        x="40"
        y="30"
        width="400"
        height="360"
        rx="16"
        stroke="#E8ECFC"
        strokeWidth="1"
      />

      <path
        d="M56,30 H424 A16,16 0 0,1 440,46 V78 H40 V46 A16,16 0 0,1 56,30 Z"
        fill="url(#hero-grad-1)"
      />
      <circle cx="68" cy="54" r="6" fill="#E04E6A" opacity="0.6" />
      <circle cx="88" cy="54" r="6" fill="#F5A623" opacity="0.6" />
      <circle cx="108" cy="54" r="6" fill="#35BA80" opacity="0.6" />

      <AnimatedScore inView={inView} scoreLabel={scoreLabel} />

      {BARS.map((bar, i) => (
        <g key={i}>
          <motion.rect
            x={bar.x}
            width="24"
            rx="4"
            fill={bar.fill}
            opacity={bar.opacity}
            initial={{ y: BAR_BOTTOM, height: 0 }}
            animate={
              inView
                ? { y: BAR_BOTTOM - bar.height, height: bar.height }
                : { y: BAR_BOTTOM, height: 0 }
            }
            transition={{
              duration: 0.6,
              ease: "easeOut" as const,
              delay: bar.delay,
            }}
          />
          <text
            x={bar.x + 12}
            y={280}
            textAnchor="middle"
            fontSize="10"
            fill="#6B6F85"
          >
            {bar.label}
          </text>
        </g>
      ))}

      <motion.g
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <rect x="270" y="120" width="140" height="40" rx="8" fill="#EFF6FA" />
        <text
          x="286"
          y="145"
          fontSize="11"
          fontWeight="600"
          fill="#1D253B"
        >
          {prsAnalyzedLabel}
        </text>
        <text
          x="390"
          y="145"
          textAnchor="end"
          fontSize="14"
          fontWeight="700"
          fill="#4E43E1"
        >
          18
        </text>
      </motion.g>

      {[
        { y: 290, fullW: 120, accentW: 40, accentFill: "#4E43E1", delay: 0.7 },
        { y: 306, fullW: 80, accentW: 28, accentFill: "#35BA80", delay: 0.8 },
        { y: 322, fullW: 100, accentW: 50, accentFill: "#0070F3", delay: 0.9 },
        { y: 338, fullW: 60, accentW: 0, accentFill: "none", delay: 1.0 },
      ].map((line) => (
        <g key={line.y}>
          <motion.rect
            x="80"
            y={line.y}
            height="8"
            rx="4"
            fill="#E8ECFC"
            initial={{ width: 0 }}
            animate={inView ? { width: line.fullW } : { width: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" as const, delay: line.delay }}
          />
          {line.accentW > 0 && (
            <motion.rect
              x="80"
              y={line.y}
              height="8"
              rx="4"
              fill={line.accentFill}
              opacity="0.3"
              initial={{ width: 0 }}
              animate={inView ? { width: line.accentW } : { width: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" as const, delay: line.delay + 0.2 }}
            />
          )}
        </g>
      ))}

      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4, ease: "easeOut" as const, delay: 1.6 }}
      >
        <rect
          x="310"
          y="300"
          width="100"
          height="32"
          rx="16"
          fill="#35BA80"
          opacity="0.15"
        />
        <circle cx="330" cy="316" r="6" fill="#35BA80" />
        <text
          x="345"
          y="320"
          fontSize="11"
          fontWeight="600"
          fill="#35BA80"
        >
          {qualityBadgeLabel}
        </text>
      </motion.g>
    </svg>
  );
}
