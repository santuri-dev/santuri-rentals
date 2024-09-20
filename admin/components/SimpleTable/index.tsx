import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { camelCaseToReadable } from '@/lib/helpers';

interface SimpleTableProps<T> {
	items: T[];
	headers: (keyof T)[];
}

const ConditionalTableCell = ({
	children,
	isLastRow,
}: {
	children: React.ReactNode;
	isLastRow: boolean;
}) => {
	return (
		<TableCell
			className={`${
				isLastRow ? 'first:rounded-bl-md last:rounded-br-md' : ''
			}`}>
			{children}
		</TableCell>
	);
};

const RenderTableHead = ({ headers }: { headers: string[] }) => {
	return (
		<TableRow>
			{headers.map((header, index) => (
				<TableHead
					key={index}
					className='first:rounded-tl-md last:rounded-tr-md'>
					{camelCaseToReadable(header)}
				</TableHead>
			))}
		</TableRow>
	);
};

export default function SimpleTable<T>({
	items,
	headers,
}: SimpleTableProps<T>) {
	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					<RenderTableHead headers={headers as string[]} />
				</TableHeader>
				<TableBody>
					{items.map((item, idx) => {
						const isLastRow = idx === items.length - 1;
						return (
							<TableRow key={idx}>
								{headers.map((key) => (
									<ConditionalTableCell key={String(key)} isLastRow={isLastRow}>
										{item[key] as React.ReactNode}
									</ConditionalTableCell>
								))}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
