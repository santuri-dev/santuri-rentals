import { MainNav } from './MainNav';
import { UserNav } from './UserNav';

export default function Header() {
	return (
		<header className='shadow-2xl h-[72px] flex justify-between px-8 items-center'>
			<MainNav />
			<UserNav />
		</header>
	);
}
