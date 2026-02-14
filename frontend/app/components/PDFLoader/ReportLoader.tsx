import { useGetReportQuery } from '@/app/tools/redux/api/orders';
import React, { useEffect } from 'react';

interface Props {
	days: 1 | 3 | 7;
}

export const ReportLoader = ({ days }: Props) => {
	const { data, isLoading, isError } = useGetReportQuery({ days });

	useEffect(() => {
		if (data) {
			const { blob, filename } = data;
			const url = window.URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', filename);

			document.body.appendChild(link);
			link.click();

			link.parentNode?.removeChild(link);
			window.URL.revokeObjectURL(url);
		}
	}, [data]);

	if (isLoading) return <div>Загрузка файла...</div>;
	if (isError) return <div>Ошибка при загрузке</div>;

	return <button disabled={isLoading}>Скачать PDF</button>;
};
