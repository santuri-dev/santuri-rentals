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

interface RequestApprovalEmailProps {
	type: string;
	startTime: string;
	endTime: string;
	cost: string;
	userName: string;
	statusLink: string;
}

export const RequestApprovalEmail = ({
	type,
	startTime,
	endTime,
	cost,
	userName,
	statusLink,
}: RequestApprovalEmailProps) => (
	<Tailwind>
		<Html>
			<Head />
			<Preview>Your Studio Request has been Approved!</Preview>
			<Body style={main}>
				<Container style={container}>
					<Text style={{ fontWeight: 'bold', fontSize: '16pt' }}>Santuri</Text>
					<Heading style={heading}>Studio Request Approved</Heading>
					<Text style={paragraph}>Hello {userName},</Text>
					<Text style={paragraph}>
						Great news! Your studio request has been approved. Here are the
						details of your booking:
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
							<strong>Total Cost:</strong> {cost}
						</Text>
					</Section>
					<Text style={paragraph}>
						Please make sure to arrive on time and follow all studio guidelines
						during your session.
					</Text>
					<Text style={paragraph}>
						If you need to make any changes or have any questions, please
						contact us as soon as possible.
					</Text>
					<Section style={buttonContainer}>
						<Button style={button} href={statusLink}>
							View Booking Details
						</Button>
					</Section>
					<Text style={paragraph}>
						Thank you for choosing Santuri. We look forward to your session!
					</Text>
				</Container>
			</Body>
		</Html>
	</Tailwind>
);

RequestApprovalEmail.PreviewProps = {
	type: 'Recording Studio',
	startTime: '2023-07-15T14:00:00Z',
	endTime: '2023-07-15T18:00:00Z',
	cost: 'KES 250.0',
	userName: 'John Doe',
	statusLink: 'http://localhost:3000/studio/requests/1234',
} as RequestApprovalEmailProps;

export default RequestApprovalEmail;

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
