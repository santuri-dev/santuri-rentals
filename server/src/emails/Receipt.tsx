import { Order } from '@/db/models';
import {
	Body,
	Container,
	Column,
	Head,
	Hr,
	Html,
	Link,
	Preview,
	Row,
	Section,
	Text,
	Tailwind,
	Img,
} from '@react-email/components';
import * as React from 'react';

interface ReceiptProps {
	data: {
		order: Order;
		orderItems: {
			currency: string;
			id: number;
			orderId: number | null;
			price: number;
			productId: number;
			quantity: number;
			Product: {
				imageUrl: string | null;
				name: string;
			} | null;
		}[];
	};
	to: string;
}

export const Receipt = ({ data, to }: ReceiptProps) => {
	const {
		order: { createdAt, ref, trackingId, currency, totalCost },
		orderItems,
	} = data;

	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>Here is your Santuri receipt for order {`#${ref}`}</Preview>

				<Body style={main}>
					<Container style={container}>
						<Section>
							<Row>
								<Column>
									<Text style={{ fontWeight: 'bold', fontSize: '16pt' }}>
										Santuri
									</Text>
								</Column>
							</Row>
							<Row>
								<Text>Here is your Santuri receipt for order {`#${ref}`}</Text>
							</Row>
						</Section>
						<Section style={informationTable}>
							<Row style={informationTableRow}>
								<Column colSpan={2}>
									<Section>
										<Row>
											<Column style={informationTableColumn}>
												<Text style={informationTableLabel}>EMAIL</Text>
												<Link
													style={{
														...informationTableValue,
														color: '#15c',
														textDecoration: 'underline',
													}}>
													{to}
												</Link>
											</Column>
										</Row>

										<Row>
											<Column style={informationTableColumn}>
												<Text style={informationTableLabel}>INVOICE DATE</Text>
												<Text style={informationTableValue}>
													{new Date(createdAt).toLocaleDateString()}
												</Text>
											</Column>
										</Row>

										<Row>
											<Column style={informationTableColumn}>
												<Text style={informationTableLabel}>ORDER REF</Text>
												<Link
													style={{
														...informationTableValue,
														color: '#15c',
														textDecoration: 'underline',
													}}>
													{ref}
												</Link>
											</Column>
											<Column style={informationTableColumn}>
												<Text style={informationTableLabel}>TRACKING ID</Text>
												<Link
													style={{
														...informationTableValue,
														color: '#15c',
														textDecoration: 'underline',
													}}>
													{trackingId}
												</Link>
											</Column>
										</Row>
									</Section>
								</Column>
							</Row>
						</Section>
						<Section>
							<Row>
								<Column className='px-4'>
									<Text className='font-semibold text-lg'>Your Order</Text>
								</Column>
							</Row>
							{orderItems.map(({ id, Product, price, currency, quantity }) => (
								<Row key={id} className={'py-2'}>
									<Column style={{ width: '64px' }}>
										<Img
											src={Product!.imageUrl ?? ''}
											width='72'
											height='72'
											alt='HBO Max'
											style={{ ...productIcon, objectFit: 'cover' }}
										/>
									</Column>
									<Column style={{ paddingLeft: '22px' }}>
										<Text style={productTitle}>{`${
											Product!.name
										} x ${quantity}`}</Text>
									</Column>
									<Column style={{ textAlign: 'end' }}>
										<Text style={productPrice}>
											{new Intl.NumberFormat('en-US', {
												style: 'currency',
												currency: currency,
												maximumFractionDigits: 0,
											}).format(price)}
										</Text>
									</Column>
								</Row>
							))}
						</Section>
						<Hr style={productPriceLine} />
						<Section align='right'>
							<Row className='py-2'>
								<Column style={tableCell} align='right'>
									<Text style={productPriceTotal}>TOTAL</Text>
								</Column>
								<Column style={productPriceLargeWrapper}>
									<Text style={productPriceLarge}>
										{new Intl.NumberFormat('en-US', {
											style: 'currency',
											currency,
											maximumFractionDigits: 0,
										}).format(totalCost)}
									</Text>
								</Column>
							</Row>
						</Section>
						<Hr style={productPriceLineBottom} />
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
};

Receipt.PreviewProps = {
	to: 'example@example.com',
	data: {
		order: {
			createdAt: '2024-04-29T08:00:00.000Z',
			id: 123456,
			ref: 'ABC123',
			status: 'paid',
			trackingId: 'XYZ789',
			currency: 'KES',
			totalCost: 1000,
			email: 'user@email.com',
			firstName: 'John',
			lastName: 'Doe',
			phone: '+2547989842340',
		},
		orderItems: [
			{
				id: 123456,
				currency: 'KES',
				orderId: 234,
				price: 1000,
				productId: 989,
				Product: {
					imageUrl:
						'https://nihybrmhlvipkhlevqlz.supabase.co/storage/v1/object/public/products/5/sound_from_earth_cover.jpg',
					name: 'Sound from Earth',
				},
				quantity: 2,
			},
		],
	},
} satisfies ReceiptProps;

export default Receipt;

const main = {
	fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
	backgroundColor: '#ffffff',
};

const resetText = {
	margin: '0',
	padding: '0',
	lineHeight: 1.4,
};

const container = {
	margin: '0 auto',
	padding: '20px 0 48px',
	width: '660px',
	maxWidth: '100%',
};

const tableCell = { display: 'table-cell' };

const informationTable = {
	borderCollapse: 'collapse' as const,
	borderSpacing: '0px',
	color: 'rgb(51,51,51)',
	backgroundColor: 'rgb(250,250,250)',
	borderRadius: '3px',
	fontSize: '12px',
};

const informationTableRow = {
	height: '46px',
};

const informationTableColumn = {
	paddingLeft: '20px',
	borderStyle: 'solid',
	borderColor: 'white',
	borderWidth: '0px 1px 1px 0px',
	height: '44px',
};

const informationTableLabel = {
	...resetText,
	color: 'rgb(102,102,102)',
	fontSize: '10px',
};

const informationTableValue = {
	fontSize: '12px',
	margin: '0',
	padding: '0',
	lineHeight: 1.4,
};

const productIcon = {
	margin: '0 0 0 20px',
	borderRadius: '14px',
	border: '1px solid rgba(128,128,128,0.2)',
};

const productTitle = { fontSize: '12px', fontWeight: '600', ...resetText };

const productPrice = {
	fontSize: '12px',
	fontWeight: '600',
	margin: '0',
};

const productPriceTotal = {
	margin: '0',
	color: 'rgb(102,102,102)',
	fontSize: '10px',
	fontWeight: '600',
	padding: '0px 30px 0px 0px',
	textAlign: 'right' as const,
};

const productPriceLarge = {
	fontSize: '16px',
	fontWeight: '600',
	whiteSpace: 'nowrap' as const,
	textAlign: 'end' as const,
};

const productPriceLine = { margin: '30px 0 0 0' };

const productPriceLargeWrapper = { display: 'table-cell', width: '90px' };

const productPriceLineBottom = { margin: '0 0 75px 0' };
