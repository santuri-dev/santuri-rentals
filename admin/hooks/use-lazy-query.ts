import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { QueryOpts, UQueryOpts } from '@/lib/queryClient';

export default function useLazyQuery<T>(options: QueryOpts<T> | UQueryOpts<T>) {
	const [enabled, setEnabled] = useState(false);

	const query = useQuery<T>({ ...options, enabled });

	const enable = useCallback(() => {
		setEnabled(true);
	}, []);

	return { ...query, enable };
}
