import { brandTokens } from './tokens';
export const tailwindConfig = {
    theme: {
        extend: {
            colors: {
                // Public Docs - Navy + Magenta primary colors
                primary: brandTokens.colors.primary, // Magenta
                navy: brandTokens.colors.navy,
                magenta: brandTokens.colors.magenta,
                pink: brandTokens.colors.pink, // Kroescontrol pink
                gray: brandTokens.colors.gray,
            },
            fontFamily: {
                // Kroescontrol Typography System
                heading: brandTokens.fonts.heading, // Poppins for H1-H6
                sans: brandTokens.fonts.sans, // Noto Sans for body
                mono: brandTokens.fonts.mono,
            },
            backgroundImage: {
                // Public Docs - Navy to Magenta gradient
                'gradient-primary': brandTokens.gradients.primary,
                'gradient-primary-vertical': brandTokens.gradients.primaryVertical,
                'gradient-subtle': brandTokens.gradients.subtle,
            },
            fontSize: brandTokens.fontSize,
            spacing: brandTokens.spacing,
            borderRadius: brandTokens.borderRadius,
            boxShadow: brandTokens.boxShadow,
        },
    },
};
//# sourceMappingURL=tailwind.js.map
