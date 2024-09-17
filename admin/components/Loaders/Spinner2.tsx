import { Oval } from 'react-loader-spinner';

export default function Spinner2() {
	return (
		<Oval
			visible={true}
			height='40'
			width='40'
			color='#9ca3af'
			ariaLabel='oval-loading'
			wrapperStyle={{}}
			wrapperClass=''
			strokeWidth={6}
			secondaryColor='#f8fafc'
		/>
	);
}
