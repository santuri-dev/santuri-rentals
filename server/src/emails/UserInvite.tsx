import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
	Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface UserInviteProps {
	email: string;
	inviteLink: string;
	role: string;
}

export const UserInvite = ({ email, inviteLink, role }: UserInviteProps) => {
	const previewText = `Invite to join Santuri Studio`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className='bg-white my-auto mx-auto font-sans px-2'>
					<Container className='border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]'>
						<Heading className='text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0'>
							Sign up on <strong>Santuri</strong>
						</Heading>
						<Text className='text-black text-[14px] leading-[24px]'>
							Hello {email},
						</Text>
						<Text className='text-black text-[14px] leading-[24px]'>
							You have been invited you to signup on Santuri as a{' '}
							<strong>{role}</strong>.
						</Text>
						<Section className='text-center mt-[32px] mb-[32px]'>
							<Button
								className='bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3'
								href={inviteLink}>
								Signup to Santuri
							</Button>
						</Section>
						<Text className='text-black text-[14px] leading-[24px]'>
							or copy and paste this URL into your browser:{' '}
							<Link href={inviteLink} className='text-blue-600 no-underline'>
								{inviteLink}
							</Link>
						</Text>
						<Hr className='border border-solid border-[#eaeaea] my-[26px] mx-0 w-full' />
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

UserInvite.PreviewProps = {
	email: 'alanturing@email.com',
	inviteLink: 'https://vercel.com/teams/invite/foo',
	role: 'student',
} as UserInviteProps;

export default UserInvite;
