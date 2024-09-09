export interface Gear {
	id: number;
	name: string;
	serialNumber: string;
	condition: string;
	status: string;
	peripherals: string[];
	gearCheckoutId: number | null;
	notes: string | null;
	createdAt: string;
	updatedAt: string | null;
}
