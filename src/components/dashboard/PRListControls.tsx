"use client";

import { useTranslations } from "next-intl";
import { Search, ArrowUpDown } from "lucide-react";

export type SortField =
  | "total"
  | "impact"
  | "aiLeverage"
  | "quality"
  | "size"
  | "date";

export type SortDirection = "asc" | "desc";

interface PRListControlsProps {
  sortField: SortField;
  sortDirection: SortDirection;
  authorFilter: string;
  searchQuery: string;
  authors: string[];
  onSortFieldChange: (field: SortField) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
  onAuthorFilterChange: (author: string) => void;
  onSearchQueryChange: (query: string) => void;
}

const SORT_OPTIONS: { value: SortField; labelKey: string }[] = [
  { value: "total", labelKey: "sortTotal" },
  { value: "impact", labelKey: "sortImpact" },
  { value: "aiLeverage", labelKey: "sortAiLeverage" },
  { value: "quality", labelKey: "sortQuality" },
  { value: "size", labelKey: "sortSize" },
  { value: "date", labelKey: "sortDate" },
];

export function PRListControls({
  sortField,
  sortDirection,
  authorFilter,
  searchQuery,
  authors,
  onSortFieldChange,
  onSortDirectionChange,
  onAuthorFilterChange,
  onSearchQueryChange,
}: PRListControlsProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder={t("searchPrs")}
          className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-4 text-sm text-text placeholder:text-text-muted outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <label htmlFor="sort-field" className="text-sm font-medium text-text-muted whitespace-nowrap">
          {t("sortBy")}
        </label>
        <select
          id="sort-field"
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value as SortField)}
          className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() =>
            onSortDirectionChange(sortDirection === "asc" ? "desc" : "asc")
          }
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text transition-colors hover:border-primary hover:text-primary"
          aria-label={
            sortDirection === "asc" ? t("ascending") : t("descending")
          }
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">
            {sortDirection === "asc" ? t("ascending") : t("descending")}
          </span>
        </button>
      </div>

      {/* Author filter */}
      <select
        value={authorFilter}
        onChange={(e) => onAuthorFilterChange(e.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
      >
        <option value="">{t("allAuthors")}</option>
        {authors.map((author) => (
          <option key={author} value={author}>
            {author}
          </option>
        ))}
      </select>
    </div>
  );
}
