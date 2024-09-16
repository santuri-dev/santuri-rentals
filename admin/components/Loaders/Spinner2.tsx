import { Oval } from 'react-loader-spinner';

export default function Spinner2() {
	return (
		<Oval
			visible={true}
			height='20'
			width='20'
			color='#9ca3af'
			ariaLabel='oval-loading'
			wrapperStyle={{}}
			wrapperClass=''
			strokeWidth={6}
			secondaryColor='#f8fafc'
		/>
	);
}
