export type CursorVariant = 'default' | 'hover' | 'text' | 'drag' | 'hidden';

export interface CursorState {
	x: number;
	y: number;
	variant: CursorVariant;
	label: string;
}

export interface WorkItem {
	company: string;
	role: string;
	description: string;
	period: string;
	skills: string[];
	highlight?: string;
}

export interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: number;
}


export interface NavSection {
	id: string;
	label: string;
}
