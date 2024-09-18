import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { QueryOpts } from '@/lib/queryClient';

export default function useLazyQuery<T>(options: QueryOpts<T>) {
	const [enabled, setEnabled] = useState(false);

	const query = useQuery<T>({ ...options, enabled });

	function enable() {
		setEnabled(true);
	}

	return { ...query, enable };
}
