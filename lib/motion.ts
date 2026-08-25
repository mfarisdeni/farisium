import type { Transition, Variants } from 'framer-motion'

/* ── Spring presets ── */
export const springSoft: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 20,
}
export const springStiff: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}
export const springGentle: Transition = {
  type: 'spring',
  stiffness: 150,
  damping: 25,
}

/* ── Easing curves ── */
export const easeEmphasized = [0.16, 1, 0.3, 1] as const
export const easeExit = [0.4, 0, 1, 1] as const
export const easeOut = [0.0, 0.0, 0.2, 1] as const

/* ── Stagger presets ── */
export const staggerQuick = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
export const staggerMedium = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
export const staggerSlow = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

/* ── Item reveal variants ── */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeEmphasized },
  },
}
export const fadeUpItemFast: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeEmphasized },
  },
}
export const fadeInItem: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: easeEmphasized },
  },
}

/* ── Page transition ── */
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}
