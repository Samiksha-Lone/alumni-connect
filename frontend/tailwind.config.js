export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      /* ─────────────────────────────────────────
         COLOR SYSTEM - Comprehensive & Unified
         ───────────────────────────────────────── */
      colors: {
        /* Primary Actions */
        primary: 'rgb(var(--color-primary))',
        'primary-hover': 'rgb(var(--color-primary-hover))',
        'primary-soft': 'rgb(var(--color-primary-soft))',
        'primary-dark': 'rgb(var(--color-primary-dark))',

        /* Semantic Colors */
        success: 'rgb(var(--color-success))',
        'success-soft': 'rgb(var(--color-success-soft))',
        warning: 'rgb(var(--color-warning))',
        'warning-soft': 'rgb(var(--color-warning-soft))',
        danger: 'rgb(var(--color-danger))',
        'danger-soft': 'rgb(var(--color-danger-soft))',
        info: 'rgb(var(--color-info))',
        'info-soft': 'rgb(var(--color-info-soft))',

        /* Backgrounds & Surfaces */
        bg: 'rgb(var(--color-bg))',
        'bg-secondary': 'rgb(var(--color-bg-secondary))',
        card: 'rgb(var(--color-card))',
        'card-hover': 'rgb(var(--color-card-hover))',

        /* Text Hierarchy */
        'text-primary': 'rgb(var(--color-text-primary))',
        'text-secondary': 'rgb(var(--color-text-secondary))',
        'text-tertiary': 'rgb(var(--color-text-tertiary))',
        'text-muted': 'rgb(var(--color-text-muted))',

        /* Borders & Dividers */
        border: 'rgb(var(--color-border))',
        'border-soft': 'rgb(var(--color-border-soft))',
        divider: 'rgb(var(--color-divider))',
      },

      /* ─────────────────────────────────────────
         TYPOGRAPHY SCALE - Consistent Hierarchy
         ───────────────────────────────────────── */
      fontSize: {
        /* Display sizes for hero/landing */
        'display-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.03em', fontWeight: '800' }],

        /* Page heading sizes */
        'heading-xl': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', fontWeight: '700' }],
        'heading-sm': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],

        /* Body text */
        'body-lg': ['1.0625rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-base': ['0.9375rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-xs': ['0.8125rem', { lineHeight: '1.5', fontWeight: '400' }],

        /* Labels, captions, helpers */
        'label-sm': ['0.75rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.03em', textTransform: 'uppercase' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'caption-xs': ['0.7rem', { lineHeight: '1.3', fontWeight: '500' }],
      },

      /* ─────────────────────────────────────────
         SPACING SYSTEM - Consistent Rhythm
         ───────────────────────────────────────── */
      spacing: {
        /* Page/Section padding */
        'container-px': '1rem',  /* Mobile padding */
        'container-px-md': '1.5rem', /* Tablet */
        'container-px-lg': '2rem',  /* Desktop */

        /* Section gaps */
        'section-gap-sm': '1rem',
        'section-gap-md': '1.5rem',
        'section-gap-lg': '2rem',
        'section-gap-xl': '3rem',
      },

      /* ─────────────────────────────────────────
         RADIUS - Consistent Corners
         ───────────────────────────────────────── */
      borderRadius: {
        'xs': '0.375rem',
        'sm': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },

      /* ─────────────────────────────────────────
         SHADOWS - Subtle Depth
         ───────────────────────────────────────── */
      boxShadow: {
        'xs': '0 1px 2px rgb(0 0 0 / 0.04)',
        'sm': '0 1px 3px rgb(0 0 0 / 0.06), 0 1px 2px rgb(0 0 0 / 0.04)',
        'base': '0 2px 8px rgb(0 0 0 / 0.08), 0 1px 3px rgb(0 0 0 / 0.04)',
        'md': '0 4px 12px rgb(0 0 0 / 0.1), 0 2px 4px rgb(0 0 0 / 0.04)',
        'lg': '0 12px 24px rgb(0 0 0 / 0.12), 0 4px 8px rgb(0 0 0 / 0.06)',
        'premium': '0 10px 25px rgb(0 0 0 / 0.1), 0 8px 10px rgb(0 0 0 / 0.05)',
      },

      /* ─────────────────────────────────────────
         TRANSITIONS - Consistent Motion
         ───────────────────────────────────────── */
      transitionDuration: {
        'fast': '120ms',
        'base': '180ms',
        'slow': '300ms',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'slide-down': 'slideDown 0.35s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      /* ─────────────────────────────────────────
         CONTAINER WIDTHS & BREAKPOINTS
         ───────────────────────────────────────── */
      maxWidth: {
        'container-sm': '640px',
        'container-md': '768px',
        'container-lg': '1024px',
        'container-xl': '1280px',
        'container-2xl': '1400px',
      },
    },

    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
  },

  plugins: [],
};