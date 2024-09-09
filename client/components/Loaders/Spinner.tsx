import { ColorRing } from 'react-loader-spinner';

export default function Spinner({ size = '80' }: { size?: string }) {
	return (
		<ColorRing
			visible={true}
			height={size}
			width={size}
			ariaLabel='blocks-loading'
			wrapperStyle={{}}
			wrapperClass='blocks-wrapper'
			colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
		/>
	);
}
