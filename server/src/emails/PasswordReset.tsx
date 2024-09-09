import {
	Body,
	Button,
	Container,
	Head,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetProps {
	userFirstname?: string;
	resetPasswordLink?: string;
}

export const PasswordReset = ({
	userFirstname,
	resetPasswordLink,
}: PasswordResetProps) => {
	return (
		<Tailwind>
			<Html>
				<Head />
				<Preview>Reset your Santuri password</Preview>
				<Body style={main}>
					<Container style={container}>
						<Text
							style={{
								fontWeight: 'bold',
								fontSize: '20pt',
								color: '#0f172a',
							}}>
							Santuri
						</Text>
						<Section>
							<Text style={text}>Hi {userFirstname},</Text>
							<Text style={text}>
								Someone recently requested a password change for your Santuri
								account. If this was you, you can set a new password here:
							</Text>
							<Button style={button} href={resetPasswordLink}>
								Reset password
							</Button>
							<Text style={text}>
								If the button above does not work, click this link to verify
								your account.
							</Text>
							<Link href={resetPasswordLink} style={{ color: '#3b82f6' }}>
								{resetPasswordLink}
							</Link>
							<Text style={text}>
								If you don&apos;t want to change your password or didn&apos;t
								request this, just ignore and delete this message.
							</Text>
							<Text style={text}>
								To keep your account secure, please don&apos;t forward this
								email to anyone.
							</Text>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
};

PasswordReset.PreviewProps = {
	userFirstname: 'Alan',
	resetPasswordLink: 'https://santuri.org',
} as PasswordResetProps;

export default PasswordReset;

const main = {
	backgroundColor: '#f6f9fc',
	padding: '10px 0',
};

const container = {
	backgroundColor: '#ffffff',
	border: '1px solid #f0f0f0',
	padding: '45px',
};

const text = {
	fontSize: '16px',
	fontFamily:
		"'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
	fontWeight: '300',
	color: '#404040',
	lineHeight: '26px',
};

const button = {
	backgroundColor: '#0f172a',
	borderRadius: '4px',
	color: '#fff',
	fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
	fontSize: '15px',
	textDecoration: 'none',
	textAlign: 'center' as const,
	display: 'block',
	width: '210px',
	padding: '14px 7px',
};
