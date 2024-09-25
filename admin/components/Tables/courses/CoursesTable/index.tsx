'use client';

import { DataTable } from '@/components/DataTable';
import { courseColumns } from './columns';
import { coursesOpts } from '@/lib/api';

export default function CoursesTable() {
	return <DataTable title='' columns={courseColumns} opts={coursesOpts} />;
}
