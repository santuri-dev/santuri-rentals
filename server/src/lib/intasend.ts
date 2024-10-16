import IntaSend from 'intasend-node';
import { Order, User } from '../db/models';
import env from './env';
import { ErrorResponse } from './types';

// Initialize IntaSend
const intasend = new IntaSend(
	env.INTASEND_PUBLISHABLE_KEY,
	env.INTASEND_API_TOKEN,
	false
);

const wallets = intasend.wallets();

// Function to parse error buffers
function parseError(err: any): ErrorResponse | any {
	try {
		return JSON.parse(Buffer.from(err).toString());
	} catch (e) {
		return err;
	}
}

export async function createCheckout(order: Order) {
	try {
		const { url, signature, id } = await wallets.fundCheckout({
			first_name: order.firstName,
			last_name: order.lastName,
			email: order.email,
			host: env.CLIENT_URL,
			amount: order.totalCost,
			currency: order.currency,
			api_ref: order.ref,
			redirect_url: `${env.CLIENT_URL}/checkout/${order.ref}`,
		});
		return { redirect_url: url, signature, id };
	} catch (err) {
		console.error(parseError(err));
		throw new Error(parseError(err));
	}
}

// Function to withdraw to Mpesa
// export async function withdrawToMpesa(user: User) {
// 	if (!user.mpesaNumber) {
// 		throw new Error('You must set an mpesa number to withdraw to');
// 	}

// 	try {
// 		const resp = await payouts.mpesa({
// 			currency: user.currency,
// 			transactions: [
// 				{
// 					name: `${user.firstName} ${user.lastName}`,
// 					account: user.mpesaNumber,
// 					amount: user.wallet,
// 					narrative: `Santuri Withdrawal of ${user.currency} ${user.wallet}`,
// 				},
// 			],
// 		});

// 		try {
// 			await payouts.approve(resp, false);
// 			return {
// 				success: true,
// 				message: `Successfully withdrew funds ${new Intl.NumberFormat('en-US', {
// 					style: 'currency',
// 					currency: user.currency,
// 					maximumFractionDigits: 0,
// 				}).format(user.wallet)} to ${user.mpesaNumber}`,
// 			};
// 		} catch (err) {
// 			throw new Error(parseError(err));
// 		}
// 	} catch (err: any) {
// 		return {
// 			success: false,
// 			message: 'Failed to withdraw funds',
// 		};
// 	}
// }
