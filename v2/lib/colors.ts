export const CHART_COLORS = [
    '#3B82F6', // Blue
    '#10B981', // Green  
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280', // Gray
    '#14B8A6', // Teal
    '#F472B6', // Pink Light
    '#A78BFA', // Purple Light
    '#34D399', // Green Light
    '#FBBF24', // Yellow
];

export const getColorByIndex = (index: number): string => {
    return CHART_COLORS[index % CHART_COLORS.length];
};

export const getColorPalette = (count: number): string[] => {
    return Array.from({ length: count }, (_, i) => getColorByIndex(i));
};

// Cores específicas por categoria
export const SECTOR_COLORS = {
    agronegocio: '#10B981',
    comercio: '#3B82F6',
    construcao: '#F59E0B',
    educacao: '#8B5CF6',
    industria: '#EF4444',
    saude: '#EC4899',
    turismo: '#06B6D4'
};

export const IDHM_COLORS = {
    'muito-alto': '#059669', // Green
    'alto': '#0284C7',       // Blue
    'medio': '#D97706',      // Orange
    'baixo': '#DC2626',      // Red
    'muito-baixo': '#7F1D1D' // Dark Red
};