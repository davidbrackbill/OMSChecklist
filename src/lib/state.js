import { writable, get } from 'svelte/store';
import { specs, course_codes } from "../lib/data.js";

function toggle(item, set) {
	set.has(item) ? set.delete(item) : set.add(item);
	return set;
}
function toggleable(init) {
	const { subscribe, set, update } = writable(init);
	return {
		subscribe,
		clear: () => set(new Set()),
		toggle: (item) => update(s => toggle(item, s))
	}
}
export const active_courses = toggleable(new Set());
export const active_specs = toggleable(new Set(["Machine Learning"]));

export const active_table_rows = writable(course_codes);
export const active_bucket = writable({});
export function toggle_rows(spec, category) {
	const match = get(active_bucket)[spec]?.[category];
	if (match) {
		active_table_rows.set(course_codes);
		active_bucket.set({});
	} else {
		active_table_rows.set(specs[spec][category]["courses"]);
		active_bucket.set({ [spec]: category });
	}
};
