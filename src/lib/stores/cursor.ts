import { writable } from 'svelte/store';
import type { CursorState, CursorVariant } from '$lib/types';

const initialState: CursorState = {
	x: 0,
	y: 0,
	variant: 'default',
	label: ''
};

export const cursorState = writable<CursorState>(initialState);

export function setCursorVariant(variant: CursorVariant, label = ''): void {
	cursorState.update((state) => ({ ...state, variant, label }));
}

export function resetCursor(): void {
	cursorState.update((state) => ({ ...state, variant: 'default', label: '' }));
}
