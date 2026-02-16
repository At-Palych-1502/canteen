'use client';

import React, { useState } from 'react';
import Styles from './createReport.module.css';
import DateSelector from '@/app/components/admin/CreateReport/DateSelector/DateSelector';
import ReportTypeSelector from '@/app/components/admin/CreateReport/ReportTypeSelector/ReportTypeSelector';
import CreateReportButton from '@/app/components/admin/CreateReport/CreateReportButton/CreateReportButton';
import ReportViewer from '@/app/components/admin/CreateReport/ReportViewer/ReportViewer';
import { GetReport } from '@/app/tools/mockData';
import { endpoints } from '../config/endpoints';
import { getAccessToken } from '../tools/utils/auth';

type DateOption = '1d' | '3d' | '7d';
type ReportType = 'food' | 'finance' | 'food+finance';

const CreateReportPage = () => {
	const [dateOption, setDateOption] = useState<DateOption>('1d');
	const [reportType, setReportType] = useState<ReportType>('food+finance');
	const [reportData, setReportData] = useState<Record<string, unknown> | null>(
		null,
	);
	const [loading, setLoading] = useState(false);

	const handleCreateReport = async() => {
		setLoading(true);
		setReportData(null);

		try {
			const response = await fetch(`${endpoints.base}/report/orders/${Number(dateOption.slice(0, 1))}`, {
			method: "GET",
			headers: {
				"authorization": `Bearer ${getAccessToken()}`
			}
			});

			if (!response.ok) {
			throw new Error(`Ошибка сети: ${response.status}`);
			}

			const blob = await response.blob();

			const url = window.URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			
			const disposition = response.headers.get('Content-Disposition');
			let filename = 'report.pdf';
			
			if (disposition && disposition.indexOf('attachment') !== -1) {
			const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
			const matches = filenameRegex.exec(disposition);
			if (matches != null && matches[1]) { 
				filename = matches[1].replace(/['"]/g, '');
			}
			}
			
			a.download = filename;

			document.body.appendChild(a);
			a.click();
			
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);

		} catch (error) {
			console.error(error);
		}

		setLoading(false);
	};

	return (
		<div className={Styles.page}>
			<div className={Styles.container}>
				<div className={Styles.header}>
					<h1 className={Styles.title}>Создание отчёта</h1>
					<p className={Styles.subtitle}>
						Выберите параметры для генерации отчёта
					</p>
				</div>

				<div className={Styles.controls}>
					<div className={Styles.controlGroup}>
						<DateSelector value={dateOption} onChange={setDateOption} />
					</div>
					<div className={Styles.controlGroup}>
						<CreateReportButton
							onClick={handleCreateReport}
							disabled={loading}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateReportPage;
