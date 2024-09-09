import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';
import * as React from 'react';

interface LinearLoginCodeEmailProps {
	verificationLink: string;
}

export const VerifyEmail = ({
	verificationLink,
}: LinearLoginCodeEmailProps) => (
	<Tailwind>
		<Html>
			<Head />
			<Preview>Welcome to Santuri.</Preview>
			<Body style={main}>
				<Container style={container}>
					<Text style={{ fontWeight: 'bold', fontSize: '16pt' }}>Santuri</Text>
					<Heading style={heading}>Welcome to Santuri.</Heading>
					<Text style={paragraph}>
						Welcome to Santuri. We are happy to have you on our platform.
					</Text>
					<Section style={buttonContainer}>
						<Button style={button} href={verificationLink}>
							Verify your Account
						</Button>
					</Section>
					<Text style={paragraph}>
						If the button above does not work, click this link to verify your
						account.
					</Text>
					<Link href={verificationLink} style={reportLink}>
						{verificationLink}
					</Link>
				</Container>
			</Body>
		</Html>
	</Tailwind>
);

VerifyEmail.PreviewProps = {
	verificationLink: 'https://example.com/api/user/verify/8/tt226-5398x',
} as LinearLoginCodeEmailProps;

export default VerifyEmail;

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

const reportLink = {
	fontSize: '14px',
	color: '#b4becc',
};

const hr = {
	borderColor: '#dfe1e4',
	margin: '42px 0 26px',
};
