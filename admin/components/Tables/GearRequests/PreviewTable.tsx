import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Gear } from '@/lib/types';

interface PreviewTableProps {
	gearItems: Gear[];
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
					{header}
				</TableHead>
			))}
		</TableRow>
	);
};

export default function PreviewTable({ gearItems }: PreviewTableProps) {
	const headers = ['Name', 'Condition', 'Status'];

	return (
		<div className='rounded-md border'>
			<Table>
				<TableHeader>
					<RenderTableHead headers={headers} />
				</TableHeader>
				<TableBody>
					{gearItems.map((item, idx) => {
						const isLastRow = idx === gearItems.length - 1;
						return (
							<TableRow key={item.id}>
								<ConditionalTableCell isLastRow={isLastRow}>
									{item.name}
								</ConditionalTableCell>
								<ConditionalTableCell isLastRow={isLastRow}>
									{item.condition}
								</ConditionalTableCell>
								<ConditionalTableCell isLastRow={isLastRow}>
									{item.status}
								</ConditionalTableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
