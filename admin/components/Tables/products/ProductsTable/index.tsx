'use client';

import { DataTable } from '@/components/DataTable';
import { productColumns } from './columns';
import { productTableOpts } from '@/lib/api';

export default function ProductsTable() {
	// const [open, setOpen] = useState(false);
	// const { refetch } = useLazyQuery(gearTableOpts);

	return (
		<>
			<DataTable title='' columns={productColumns} opts={productTableOpts} />
		</>
	);
}
