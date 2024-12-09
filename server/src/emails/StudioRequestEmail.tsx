import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';
import * as React from 'react';

interface StudioRequestEmailProps {
	type: string;
	startTime: string;
	endTime: string;
	status: string;
	cost: string;
	userName: string;
	statusLink: string;
}

export const StudioRequestEmail = ({
	type,
	startTime,
	endTime,
	status,
	cost,
	userName,
	statusLink,
}: StudioRequestEmailProps) => (
	<Tailwind>
		<Html>
			<Head />
			<Preview>Your Studio Request at Santuri</Preview>
			<Body style={main}>
				<Container style={container}>
					<Text style={{ fontWeight: 'bold', fontSize: '16pt' }}>Santuri</Text>
					<Heading style={heading}>Studio Request Confirmation</Heading>
					<Text style={paragraph}>Hello {userName},</Text>
					<Text style={paragraph}>
						Your studio request has been received. Here are the details:
					</Text>
					<Section style={detailsContainer}>
						<Text style={detailItem}>
							<strong>Studio Type:</strong> {type}
						</Text>
						<Text style={detailItem}>
							<strong>Start Time:</strong>{' '}
							{new Date(startTime).toLocaleString()}
						</Text>
						<Text style={detailItem}>
							<strong>End Time:</strong> {new Date(endTime).toLocaleString()}
						</Text>
						<Text style={detailItem}>
							<strong>Status:</strong> {status}
						</Text>
						<Text style={detailItem}>
							<strong>Total Cost:</strong> {cost}
						</Text>
					</Section>
					<Text style={paragraph}>
						You can check the status of your request anytime by logging into
						your Santuri account.
					</Text>
					<Section style={buttonContainer}>
						<Button style={button} href={statusLink}>
							View Request
						</Button>
					</Section>
					<Text style={paragraph}>
						If you have any questions or need to make changes to your request,
						please don't hesitate to contact us.
					</Text>
					<Text style={paragraph}>
						Thank you for choosing Santuri for your studio needs!
					</Text>
				</Container>
			</Body>
		</Html>
	</Tailwind>
);

StudioRequestEmail.PreviewProps = {
	type: 'Recording Studio',
	startTime: '2023-07-15T14:00:00Z',
	endTime: '2023-07-15T18:00:00Z',
	status: 'pending',
	cost: 'KES 250.0',
	userName: 'John Doe',
	statusLink: 'http://localhost:3000/studio/requests/1234',
} as StudioRequestEmailProps;

export default StudioRequestEmail;

const main = {
	fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
	backgroundColor: '#ffffff',
};

const container = {
	margin: '0 auto',
	padding: '20px 0 48px',
	width: '660px',
	maxWidth: '100%',
};

const heading = {
	fontSize: '24px',
	letterSpacing: '-0.5px',
	lineHeight: '1.3',
	fontWeight: '400',
	color: '#484848',
	padding: '17px 0 0',
};

const paragraph = {
	margin: '0 0 15px',
	fontSize: '15px',
	lineHeight: '1.4',
	color: '#3c4149',
};

const detailsContainer = {
	backgroundColor: '#f9f9f9',
	borderRadius: '4px',
	padding: '24px',
	marginBottom: '24px',
};

const detailItem = {
	margin: '0 0 10px',
	fontSize: '14px',
	lineHeight: '1.4',
	color: '#3c4149',
};

const buttonContainer = {
	padding: '27px 0 27px',
};

const button = {
	backgroundColor: '#5e6ad2',
	borderRadius: '3px',
	fontWeight: '600',
	color: '#fff',
	fontSize: '15px',
	textDecoration: 'none',
	textAlign: 'center' as const,
	display: 'block',
	padding: '11px 23px',
};
