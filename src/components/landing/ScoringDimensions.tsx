"use client";

import { useTranslations } from "next-intl";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { Zap, Sparkles, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CIRCUMFERENCE = 2 * Math.PI * 40;

interface ScoreRingProps {
  score: number;
  color: string;
  inView: boolean;
}

function ScoreRing({ score, color, inView }: ScoreRingProps) {
  const value = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  const offset = useTransform(value, (v) => CIRCUMFERENCE * (1 - v / 100));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, score, {
      duration: 1.2,
      ease: "easeOut",
      delay: 0.3,
    });
    const unsub = value.on("change", (v) => setDisplay(Math.round(v)));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, score, value]);

  return (
    <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
      <circle cx="48" cy="48" r="40" stroke="#E8ECFC" strokeWidth="6" fill="none" />
      <motion.circle
        cx="48"
        cy="48"
        r="40"
        stroke={color}
        strokeWidth="6"
        fill="none"
        strokeDasharray={CIRCUMFERENCE}
        style={{ strokeDashoffset: offset }}
        strokeLinecap="round"
        transform="rotate(-90 48 48)"
      />
      <text
        x="48"
        y="46"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill="#1D253B"
        dominantBaseline="central"
      >
        {display}
      </text>
    </svg>
  );
}

const DIMENSIONS = [
  {
    icon: Zap,
    key: "impact",
    score: 85,
    color: "#D97706",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Sparkles,
    key: "aiLeverage",
    score: 72,
    color: "#7C3AED",
    bgColor: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: Shield,
    key: "quality",
    score: 91,
    color: "#35BA80",
    bgColor: "bg-emerald-50",
    iconColor: "text-accent-green",
  },
] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function ScoringDimensions() {
  const t = useTranslations("scoring");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[1110px] px-[18px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="font-heading text-[2rem] font-bold leading-[2.375rem] tracking-[-0.0625rem] text-navy lg:text-[3rem] lg:leading-[3.375rem] lg:tracking-[-0.1125rem]">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-text-muted">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {DIMENSIONS.map((dim) => {
            const Icon = dim.icon;

            return (
              <motion.div
                key={dim.key}
                variants={fadeInUp}
                className="flex flex-col items-center rounded-xl border border-border bg-background p-8 text-center"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl ${dim.bgColor}`}
                >
                  <Icon className={`h-7 w-7 ${dim.iconColor}`} />
                </div>

                <h3 className="mt-5 font-heading text-[1.5rem] font-bold leading-[1.875rem] tracking-[-0.0625rem] text-navy">
                  {t(`${dim.key}.title`)}
                </h3>

                <p className="mt-3 text-base leading-6 text-text-muted">
                  {t(`${dim.key}.description`)}
                </p>

                <div className="mt-6">
                  <ScoreRing score={dim.score} color={dim.color} inView={inView} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
