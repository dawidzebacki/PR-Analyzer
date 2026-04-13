import type { Variants } from "framer-motion";

/**
 * Container that staggers its direct child sections.
 * Use on a parent motion element wrapping dashboard sections.
 */
export const sectionContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/**
 * Standard fade-in-up for a section. Pair with `sectionContainerVariants`
 * on the parent to inherit stagger.
 */
export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Stagger container for grids of small items (dimension cards, recommendations, authors).
 */
export const itemContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/**
 * Standard fade-in-up for grid items.
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};
