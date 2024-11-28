import { t } from 'elysia';

export const getPagination = ({
	pageIndex = 0,
	pageSize = 5,
}: {
	pageIndex?: number;
	pageSize?: number;
}) => {
	const from = pageIndex * pageSize;
	const to = from + pageSize - 1;

	return { from, to, pageIndex, pageSize };
};

export const paginationQuerySchema = t.Optional(
	t.Object({ pageIndex: t.Numeric(), pageSize: t.Numeric() })
);

export type PaginationState = {
	pageIndex?: number;
	pageSize?: number;
};
