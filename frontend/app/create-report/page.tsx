'use client';

import React, { useState } from 'react';
import Styles from './createReport.module.css';
import DateSelector from '@/app/components/admin/CreateReport/DateSelector/DateSelector';
import ReportTypeSelector from '@/app/components/admin/CreateReport/ReportTypeSelector/ReportTypeSelector';
import CreateReportButton from '@/app/components/admin/CreateReport/CreateReportButton/CreateReportButton';
import ReportViewer from '@/app/components/admin/CreateReport/ReportViewer/ReportViewer';
import { GetReport } from '@/app/tools/mockData';

type DateOption = '1d' | '3d' | '7d';
type ReportType = 'food' | 'finance' | 'food+finance';

const CreateReportPage = () => {
	const [dateOption, setDateOption] = useState<DateOption>('1d');
	const [reportType, setReportType] = useState<ReportType>('food+finance');
	const [reportData, setReportData] = useState<Record<string, unknown> | null>(
		null,
	);
	const [loading, setLoading] = useState(false);

	const handleCreateReport = () => {
		setLoading(true);
		setReportData(null);

		// Симуляция задержки запроса
		setTimeout(() => {
			const result = GetReport({
				date: dateOption,
				type:
					reportType === 'food+finance'
						? ['food', 'finance']
						: reportType === 'food'
							? ['food']
							: ['food', 'finance'],
			});
			setReportData(result.data);
			setLoading(false);
		}, 500);
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
						<ReportTypeSelector value={reportType} onChange={setReportType} />
					</div>
					<div className={Styles.controlGroup}>
						<CreateReportButton
							onClick={handleCreateReport}
							disabled={loading}
						/>
					</div>
				</div>

				<div className={Styles.reportContainer}>
					<ReportViewer data={reportData} loading={loading} />
				</div>
			</div>
		</div>
	);
};

export default CreateReportPage;
