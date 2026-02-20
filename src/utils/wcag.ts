/**
 * Utility to calculate the relative luminance of a color
 * @param hex Hex color code
 */
function getLuminance(hex: string) {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    const a = [r, g, b].map(function (v) {
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Validates WCAG AA contrast ratio (4.5:1) for normal text
 * @param fgColor Hex color string for frontend
 * @param bgColor Hex color string for background
 * @returns boolean indicating if the contrast is accessible
 */
export function hasValidContrast(fgColor: string, bgColor: string): boolean {
    const lum1 = getLuminance(fgColor);
    const lum2 = getLuminance(bgColor);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    const contrastRatio = (brightest + 0.05) / (darkest + 0.05);

    return contrastRatio >= 4.5;
}
