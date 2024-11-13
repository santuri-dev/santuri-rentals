import UserList from '@/components/Tables/users/UserList';
import UserRolesList from '@/components/Tables/users/UserRoles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Page() {
	return (
		<div className='flex-col md:flex'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<div className='flex items-center justify-between space-y-2'>
					<h2 className='text-3xl font-bold tracking-tight'>Users</h2>
				</div>
				<Tabs defaultValue='users' className='space-y-4'>
					<TabsList>
						<TabsTrigger value='users'>Users</TabsTrigger>
						<TabsTrigger value='roles'>Roles</TabsTrigger>
					</TabsList>
					<TabsContent value='users' className='space-y-4'>
						<UserList />
					</TabsContent>
					<TabsContent value='roles' className='space-y-4'>
						<UserRolesList />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
