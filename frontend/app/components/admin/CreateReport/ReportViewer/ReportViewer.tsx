import React from 'react';
import Styles from './ReportViewer.module.css';

interface ReportData {
	[field: string]: unknown;
	date?: string;
}

interface ReportViewerProps {
	data: ReportData | null;
	loading?: boolean;
}

const ReportViewer: React.FC<ReportViewerProps> = ({
	data,
	loading = false,
}) => {
	if (loading) {
		return (
			<div className={Styles.container}>
				<div className={Styles.loading}>Загрузка отчёта...</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className={Styles.container}>
				<div className={Styles.empty}>
					Выберите параметры и нажмите &apos;Создать отчёт&apos;
				</div>
			</div>
		);
	}

	const formatDate = (dateString: string): string => {
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			});
		} catch {
			return dateString;
		}
	};

	const formatCurrency = (value: number): string => {
		return new Intl.NumberFormat('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			maximumFractionDigits: 0,
		}).format(value);
	};

	const renderValue = (key: string, value: unknown): React.ReactNode => {
		if (value === null || value === undefined) {
			return <span className={Styles.nullValue}>—</span>;
		}

		if (typeof value === 'number') {
			if (
				key.includes('price') ||
				key.includes('cost') ||
				key.includes('expense') ||
				key.includes('amount') ||
				key.includes('income') ||
				key.includes('profit')
			) {
				return <span className={Styles.currency}>{formatCurrency(value)}</span>;
			}
			if (key === 'percentage') {
				return <span className={Styles.percentage}>{value}%</span>;
			}
			if (key === 'rating') {
				return <span className={Styles.rating}>⭐ {value}</span>;
			}
			return <span className={Styles.number}>{value}</span>;
		}

		if (typeof value === 'string') {
			if (key.includes('date') || key === 'date') {
				return <span className={Styles.date}>{formatDate(value)}</span>;
			}
			return <span className={Styles.string}>{value}</span>;
		}

		if (Array.isArray(value)) {
			return <ArrayRenderer items={value} />;
		}

		if (typeof value === 'object') {
			return <ObjectRenderer data={value as Record<string, unknown>} />;
		}

		return <span className={Styles.string}>{String(value)}</span>;
	};

	const ArrayRenderer: React.FC<{ items: unknown[] }> = ({ items }) => {
		if (items.length === 0) {
			return <span className={Styles.emptyArray}>пустой массив</span>;
		}

		return (
			<div className={Styles.array}>
				{items.map((item, index) => (
					<div key={index} className={Styles.arrayItem}>
						{typeof item === 'object' && item !== null ? (
							<ObjectRenderer data={item as Record<string, unknown>} />
						) : (
							<span>{String(item)}</span>
						)}
					</div>
				))}
			</div>
		);
	};

	const ObjectRenderer: React.FC<{ data: Record<string, unknown> }> = ({
		data,
	}) => {
		const entries = Object.entries(data);

		return (
			<div className={Styles.object}>
				{entries.map(([key, value]) => (
					<div key={key} className={Styles.objectField}>
						<span className={Styles.objectKey}>{formatKey(key)}:</span>
						<span className={Styles.objectValue}>
							{renderValue(key, value)}
						</span>
					</div>
				))}
			</div>
		);
	};

	const formatKey = (key: string): string => {
		const translations: Record<string, string> = {
			period: 'Период',
			mealsStats: 'Статистика по приёмам пищи',
			totalMeals: 'Всего приёмов пищи',
			breakfasts: 'Завтраки',
			lunches: 'Обеды',
			dinners: 'Полдники',
			popularMeals: 'Популярные блюда',
			productsUsed: 'Использованные продукты',
			allergiesInfo: 'Информация об аллергиях',
			totalStudents: 'Всего учеников',
			withAllergies: 'С аллергией',
			commonAllergies: 'Частые аллергии',
			totalExpenses: 'Общие расходы',
			expensesByCategory: 'Расходы по категориям',
			category: 'Категория',
			amount: 'Сумма',
			percentage: 'Процент',
			income: 'Доходы',
			subscriptions: 'Абонементы',
			singleMeals: 'Разовые обеды',
			total: 'Всего',
			profit: 'Прибыль',
			dailyAverage: 'Среднее в день',
			name: 'Название',
			count: 'Количество',
			rating: 'Рейтинг',
			unit: 'Единица измерения',
		};

		if (translations[key]) {
			return translations[key];
		}

		return key
			.replace(/([A-Z])/g, ' $1')
			.replace(/^./, str => str.toUpperCase())
			.replace(/_/g, ' ')
			.trim();
	};

	return (
		<div className={Styles.container}>
			<div className={Styles.header}>
				<h3 className={Styles.title}>Отчёт</h3>
				{data.date && (
					<div className={Styles.reportDate}>{formatDate(data.date)}</div>
				)}
			</div>
			<div className={Styles.content}>
				{Object.entries(data).map(([key, value]) => (
					<div key={key} className={Styles.section}>
						{key !== 'date' && (
							<>
								<h4 className={Styles.sectionTitle}>{formatKey(key)}</h4>
								<div className={Styles.sectionContent}>
									{renderValue(key, value)}
								</div>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default ReportViewer;
