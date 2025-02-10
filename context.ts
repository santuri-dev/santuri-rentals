export const projectContext = {
	architecture: {
		backend: {
			framework: 'Elysia.js on Bun',
			database: 'PostgreSQL with Prisma ORM',
			auth: 'JWT (access + refresh tokens)',
			email: 'Nodemailer',
			payments: 'IntaSend integration',
		},
		frontend: {
			client: 'Next.js',
			admin: 'Next.js',
			stateManagement: ['React Query', 'Context API'],
			styling: ['Tailwind CSS', 'Shadcn/ui'],
		},
	},
	coreFeatures: {
		authentication: {
			type: 'JWT-based',
			flows: [
				'User auth',
				'Admin auth',
				'Password reset',
				'Email verification',
			],
			tokenRotation: true,
		},
		shopping: {
			cart: 'LocalStorage persistence',
			features: ['Product management', 'Order processing'],
		},
		studio: {
			features: [
				'Time slot booking',
				'Equipment rental tracking',
				'Date restrictions',
				'Pricing calculations',
			],
		},
	},
	databaseModels: [
		'User',
		'Role',
		'Session',
		'Product',
		'Order',
		'StudioRequest',
		'Gear',
		'Course',
	],
	keyContexts: [
		'Authentication flows and token management',
		'Shopping cart state management',
		'Studio booking business logic',
		'Admin dashboard functionality',
		'Database schema and relationships',
		'API endpoint structure and validation',
		'Frontend component architecture',
		'State management patterns',
		'Error handling approaches',
		'Environment configuration',
	],
};
