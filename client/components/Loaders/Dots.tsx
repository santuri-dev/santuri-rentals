import { ThreeDots } from 'react-loader-spinner';

export default function Dots({
	color = '#fff',
	radius = '9',
	size = '32',
}: {
	color?: string;
	size?: string;
	radius?: string;
}) {
	return (
		<ThreeDots
			visible={true}
			height={size}
			width={size}
			color={color}
			radius={radius}
			ariaLabel='three-dots-loading'
			wrapperStyle={{}}
			wrapperClass=''
		/>
	);
}
