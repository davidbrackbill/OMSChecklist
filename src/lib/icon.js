// Centralized track configuration and mappings

export const trackNames = [
    "Machine Learning",
    "Computer Graphics", 
    "Robotics",
    "Computing Systems",
    "Human Computer Interaction",
    "Interactive Intelligence",
    "Semesters"
];

export const trackColors = {
    "Machine Learning": "var(--color-ml)",
    "Computer Graphics": "var(--color-graphics)",
    "Robotics": "var(--color-robotics)",
    "Computing Systems": "var(--color-systems)",
    "Human Computer Interaction": "var(--color-hci)",
    "Interactive Intelligence": "var(--color-ii)",
    "Semesters": "var(--color-sidebar-bg)",
};

// Tailwind color mappings for each track
export const trackTailwindColors = {
    "Machine Learning": "ml",
    "Computer Graphics": "graphics",
    "Robotics": "robotics",
    "Computing Systems": "systems",
    "Human Computer Interaction": "hci",
    "Interactive Intelligence": "ii",
    "Semesters": "gray",
};

export const trackIcons = {
    "Machine Learning": "/ml.webp",
    "Computer Graphics": "/graphics.webp",
    "Robotics": "/robotics.webp",
    "Computing Systems": "/computing-systems.webp",
    "Human Computer Interaction": "/hci.webp",
    "Interactive Intelligence": "/interactive-intelligence.webp",
    "Semesters": "/favicon.webp",
};

// Generate CSS color styles for each track
export function generateTrackColorStyles(selector, property = 'color') {
    return trackNames.map(track => 
        `${selector}[data-spec="${track}"] { ${property}: ${trackColors[track]}; }`
    ).join('\n    ');
}

// Generate CSS color styles with custom selectors
export function generateTrackStyles(baseSelector, property, trackOverrides = {}) {
    return trackNames.map(track => {
        const color = trackOverrides[track] || trackColors[track];
        return `${baseSelector}[data-spec="${track}"] { ${property}: ${color}; }`;
    }).join('\n    ');
}

// Get track color by name
export function getTrackColor(trackName) {
    return trackColors[trackName];
}

// Get track icon by name
export function getTrackIcon(trackName) {
    return trackIcons[trackName];
}

// Check if a name is a valid track
export function isValidTrack(trackName) {
    return trackNames.includes(trackName);
}
