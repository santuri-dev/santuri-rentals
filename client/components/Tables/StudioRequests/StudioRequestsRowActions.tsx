'use client';

import { Button } from '@/components/ui/button';
import { StudioRequest } from '@/lib/types';
import { CircleChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

export default function StudioRequestsRowActions({
	studioRequest,
}: {
	studioRequest: StudioRequest;
}) {
	return (
		<div className='flex items-center gap-2'>
			<Button size={'icon'} variant={'ghost'} asChild>
				<Link href={`/studio/requests/${studioRequest.id}`}>
					<CircleChevronRightIcon className='h-5 w-5' />
				</Link>
			</Button>
		</div>
	);
}
