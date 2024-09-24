import { Oval } from 'react-loader-spinner';

export default function Spinner2({ size = '40' }: { size?: '20' | '40' }) {
	return (
		<Oval
			visible={true}
			height={size}
			width={size}
			color='#9ca3af'
			ariaLabel='oval-loading'
			wrapperStyle={{}}
			wrapperClass=''
			strokeWidth={6}
			secondaryColor='#f8fafc'
		/>
	);
}
