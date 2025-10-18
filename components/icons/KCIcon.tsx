import React from 'react'
import { LucideIcon } from 'lucide-react'

export type IconVariant =
  | 'primary'      // Pink for public, Navy for internal
  | 'secondary'    // Muted version
  | 'gradient'     // Gradient effect (via CSS)
  | 'success'      // Green
  | 'warning'      // Orange/Yellow
  | 'error'        // Red
  | 'neutral'      // Gray

export type IconSize = 16 | 20 | 24 | 32 | 40

interface KCIconProps {
  icon: LucideIcon
  variant?: IconVariant
  size?: IconSize
  className?: string
  'aria-label'?: string
}

/**
 * KCIcon - Kroescontrol Icon Wrapper Component
 *
 * Wraps Lucide React icons with consistent styling and color scheme.
 *
 * Color Strategy:
 * - Public docs: Primary = Pink (#E4007C)
 * - Internal docs: Primary = Navy (#222b5b)
 * - Operations docs: Primary = Navy (#222b5b)
 *
 * @example
 * ```tsx
 * import { Rocket } from 'lucide-react'
 * import { KCIcon } from '@/components/icons/KCIcon'
 *
 * <KCIcon icon={Rocket} variant="primary" size={24} />
 * ```
 */
export function KCIcon({
  icon: Icon,
  variant = 'primary',
  size = 24,
  className = '',
  'aria-label': ariaLabel
}: KCIconProps) {
  const colorClass = getColorClass(variant)

  return (
    <Icon
      size={size}
      className={`${colorClass} ${className}`.trim()}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    />
  )
}

function getColorClass(variant: IconVariant): string {
  const colors: Record<IconVariant, string> = {
    primary: 'text-[var(--kc-color-primary-500)]',      // Pink #E4007C (public) or Navy #222b5b (internal)
    secondary: 'text-[var(--kc-color-navy-600)]',       // Navy muted
    gradient: 'kc-gradient-icon',                       // Custom gradient class
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-orange-500 dark:text-orange-400',
    error: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }

  return colors[variant]
}

/**
 * Gradient Icon Support
 *
 * For gradient icons, use the 'gradient' variant and ensure the CSS class
 * kc-gradient-icon is defined in your stylesheets.
 *
 * @example
 * ```tsx
 * <KCIcon icon={Sparkles} variant="gradient" size={32} />
 * ```
 */
