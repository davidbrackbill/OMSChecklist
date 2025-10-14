import { writable, get } from 'svelte/store';
import { specs, course_codes } from "./data.js";

export function getFromStorage(key, defaultValue = null) {
	if (typeof window === 'undefined') return defaultValue;

	try {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : defaultValue;
	} catch (e) {
		console.warn(`Failed to load ${key} from localStorage:`, e);
		return defaultValue;
	}
}

export function setToStorage(key, value) {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.warn(`Failed to save ${key} to localStorage:`, e);
	}
}

export function removeFromStorage(key) {
	if (typeof window === 'undefined') return;

	try {
		localStorage.removeItem(key);
	} catch (e) {
		console.warn(`Failed to remove ${key} from localStorage:`, e);
	}
}

function getSetFromStorage(key, defaultValue) {
	const stored = getFromStorage(key);
	if (stored && Array.isArray(stored)) {
		return new Set(stored);
	}
	return defaultValue;
}

function saveSetToStorage(key, set) {
	setToStorage(key, Array.from(set));
}

// Initialize stores with localStorage data
export const activeCourses = writable(getSetFromStorage('activeCourses', new Set()));
export const activeSections = writable(getSetFromStorage('activeSections', new Set([])));
export const pinnedSections = writable(getSetFromStorage('pinnedSections', new Set()));

// Subscribe to changes and save to localStorage
activeCourses.subscribe(courses => saveSetToStorage('activeCourses', courses));
activeSections.subscribe(sections => saveSetToStorage('activeSections', sections));
pinnedSections.subscribe(sections => saveSetToStorage('pinnedSections', sections));

export function toggleCourse(course) {
	activeCourses.update(courses => {
		const newCourses = new Set(courses);
		newCourses.has(course) ? newCourses.delete(course) : newCourses.add(course);
		return newCourses;
	});
}

export function toggleSection(section) {
	activeSections.update(sections => {
		const newSections = new Set();
		
		// Always include pinned sections
		const currentPinned = get(pinnedSections);
		currentPinned.forEach(pinnedSection => newSections.add(pinnedSection));
		
		// If section is currently active, remove it (toggle off)
		if (sections.has(section)) {
			// If it's pinned, temporarily hide it but keep it pinned
			// If it's not pinned, just remove it
			return newSections;
		}
		
		// If section is not active, add it
		newSections.add(section);
		return newSections;
	});
}

export function pinSection(section) {
	let wasPinned = false;
	
	pinnedSections.update(pinned => {
		const newPinned = new Set(pinned);
		wasPinned = newPinned.has(section);
		if (wasPinned) {
			newPinned.delete(section);
		} else {
			newPinned.add(section);
		}
		return newPinned;
	});
	
	// Update active sections to include all pinned sections plus current selection
	activeSections.update(active => {
		const newActive = new Set();
		const currentPinned = get(pinnedSections);
		
		// Add all pinned sections
		currentPinned.forEach(pinnedSection => newActive.add(pinnedSection));
		
		// If we just pinned this section, make sure it's active
		if (!wasPinned) {
			newActive.add(section);
		}
		
		// Keep any non-pinned active sections (but only one)
		const nonPinnedActive = Array.from(active).filter(activeSection => !currentPinned.has(activeSection));
		if (nonPinnedActive.length > 0 && wasPinned) {
			// If we just unpinned, keep the most recent non-pinned active
			newActive.add(nonPinnedActive[0]);
		} else if (nonPinnedActive.length > 0 && !nonPinnedActive.includes(section)) {
			// Keep existing non-pinned active if it's not the one we just pinned
			newActive.add(nonPinnedActive[0]);
		}
		
		return newActive;
	});
}

export function clearCourses() {
	activeCourses.set(new Set());
	// Also clear semester planning data
	removeFromStorage('pinnedSemesters');
}

export function clearSections() {
	activeSections.set(new Set());
}

export function clearSpecs() {
	clearSections();
	pinnedSections.set(new Set());
	activeReq.set({});
	activeRows.set(course_codes);
}

export const activeRows = writable(course_codes);

export const activeReq = writable(getFromStorage('activeReq', {}));

// Subscribe to changes and save to localStorage
activeReq.subscribe(activeReq => setToStorage('activeReq', activeReq));

// Update activeRows when activeReq changes (including on load)
activeReq.subscribe(current => {
	if (typeof window === 'undefined') return;
	
	// Find the active requirement and update rows accordingly
	if (current && current.track && current.req) {
		if (specs[current.track] && specs[current.track][current.req]) {
			activeRows.set(specs[current.track][current.req]["courses"]);
		}
	} else {
		// No active requirement, show all courses
		activeRows.set(course_codes);
	}
});
export function toggleRows(track, req) {
	const current = get(activeReq);
	const match = current?.track === track && current?.req === req;
	if (match) {
		activeRows.set(course_codes);
		activeReq.set({});
	} else {
		activeRows.set(specs[track][req]["courses"]);
		activeReq.set({ track, req });
	}
};

export function clear() {
	clearCourses();
	clearSections();
	pinnedSections.set(new Set());
	activeReq.set({});
	activeRows.set(course_codes);
	
	// Reset all layout preferences
	removeFromStorage('pinnedSemesters');
	removeFromStorage('pinnedSections');
	removeFromStorage('tableSort');
	removeFromStorage('leftPanelWidth');
	removeFromStorage('activeReq');
	
	// Trigger page reload to reset all layout state
	if (typeof window !== 'undefined') {
		window.location.reload();
	}
};
