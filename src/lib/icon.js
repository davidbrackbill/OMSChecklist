// Centralized track configuration and mappings

export const trackNames = [
    "Machine Learning",
    "Computer Graphics",
    "Robotics",
    "Computing Systems",
    "Human Computer Interaction",
    "Artificial Intelligence",
    "Semesters"
];

export const trackColors = {
    "Machine Learning": "var(--color-ml)",
    "Computer Graphics": "var(--color-graphics)",
    "Robotics": "var(--color-robotics)",
    "Computing Systems": "var(--color-systems)",
    "Human Computer Interaction": "var(--color-hci)",
    "Artificial Intelligence": "var(--color-ai)",
    "Semesters": "var(--color-sidebar-bg)",
};

// Tailwind color mappings for each track
export const trackTailwindColors = {
    "Machine Learning": "ml",
    "Computer Graphics": "graphics",
    "Robotics": "robotics",
    "Computing Systems": "systems",
    "Human Computer Interaction": "hci",
    "Artificial Intelligence": "ai",
    "Semesters": "gray",
};

export const trackIcons = {
    "Machine Learning": "/ml.webp",
    "Computer Graphics": "/graphics.webp",
    "Robotics": "/robotics.webp",
    "Computing Systems": "/computing-systems.webp",
    "Human Computer Interaction": "/hci.webp",
    "Artificial Intelligence": "/artificial-intelligence.webp",
    "Semesters": "/favicon.webp",
};

export const trackUrls = {
    "Machine Learning": "https://omscs.gatech.edu/specialization-machine-learning",
    "Computer Graphics": "https://omscs.gatech.edu/specialization-computer-graphics",
    "Robotics": "https://omscs.gatech.edu/specialization-computational-perception-and-robotics",
    "Computing Systems": "https://omscs.gatech.edu/specialization-computing-systems",
    "Human Computer Interaction": "https://omscs.gatech.edu/specialization-human-computer-interaction",
    "Artificial Intelligence": "https://omscs.gatech.edu/specialization-interactive-intelligence",
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
