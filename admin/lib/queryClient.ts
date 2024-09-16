import {
	DefinedInitialDataOptions,
	QueryClient,
	QueryKey,
	UndefinedInitialDataOptions,
} from '@tanstack/react-query';

export type QueryOpts<T> = DefinedInitialDataOptions<T, Error, T, QueryKey>;
export type UQueryOpts<T> = UndefinedInitialDataOptions<T, Error, T, QueryKey>;

export function fetchQueryData<T>(opts: QueryOpts<T> | UQueryOpts<T>) {
	return (
		queryClient.getQueryData(opts.queryKey) ?? queryClient.fetchQuery(opts)
	);
}

const queryClient = new QueryClient();

export default queryClient;
