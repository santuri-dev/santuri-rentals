export type CustomSelectedRows<T> = { row: T; idx: number }[];

export type SelectActions<T> = {
	title: string;
	actions: Array<{
		name: string;
		action: (rows: T[], updateLoading: () => void) => Promise<void>;
	}>;
};
