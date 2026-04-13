"use client";

import { Container } from "@/components/ui/Container";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer rounded-md ${className}`}
      aria-hidden="true"
    />
  );
}

function SkeletonCard({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-surface rounded-xl shadow-sm border border-border p-6 ${className}`}
    >
      <div className="skeleton-shimmer h-full w-full rounded-md" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <Container className="py-12 lg:py-16">
      <div className="space-y-10" role="status" aria-busy="true" aria-label="Loading dashboard">
        {/* Repo header */}
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 lg:h-12 lg:w-96" />
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Total score */}
        <div className="bg-surface rounded-xl shadow-sm border border-border p-6 flex flex-col items-center gap-4 py-10">
          <div className="skeleton-shimmer rounded-full" style={{ width: 128, height: 128 }} />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Score breakdown */}
        <div className="space-y-6">
          <Skeleton className="h-7 w-56 lg:h-9 lg:w-72" />
          <div className="grid gap-6 lg:grid-cols-2">
            <SkeletonCard className="h-[296px]" />
            <SkeletonCard className="h-[296px]" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <SkeletonCard className="h-48" />
            <SkeletonCard className="h-48" />
            <SkeletonCard className="h-48" />
          </div>
        </div>

        {/* PR list */}
        <div className="space-y-6">
          <Skeleton className="h-7 w-44 lg:h-9 lg:w-56" />
          <div className="space-y-4">
            <SkeletonCard className="h-44" />
            <SkeletonCard className="h-44" />
            <SkeletonCard className="h-44" />
          </div>
        </div>

        {/* Authors */}
        <div className="space-y-6">
          <Skeleton className="h-7 w-32 lg:h-9 lg:w-40" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <SkeletonCard className="h-64" />
            <SkeletonCard className="h-64" />
            <SkeletonCard className="h-64" />
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-7 w-56 lg:h-9 lg:w-64" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonCard className="h-28" />
            <SkeletonCard className="h-28" />
            <SkeletonCard className="h-28" />
            <SkeletonCard className="h-28" />
          </div>
        </div>
      </div>
    </Container>
  );
}
