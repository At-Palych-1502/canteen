"use client"

import { useEffect, useState } from "react";
import Styles from "./page.module.css"
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useAddReviewMutation, useGetReviewsByUserQuery } from "../tools/redux/api/reviews";
import { useGetAllDishesQuery } from "../tools/redux/api/dishes";
import { selectUser } from "../tools/redux/user";
import { IAddReview, IReview, IUpdateReviewReq } from "../tools/types/reviews";

interface Props {
    showNotification: (ok: boolean, text: string) => void,
    onSubmit?: () => void,
    onChangeSubmit?: (data: IUpdateReviewReq) => void
    ingridientId?: number,
    feedbackTemp?: IReview
}

export const FeedBackForm = ({
    showNotification,
    onSubmit,
    onChangeSubmit,
    ingridientId,
    feedbackTemp
}: Props) => {
    const [selectedDish, setSelectedDish] = useState<string>('');
	const [rating, setRating] = useState<number>(feedbackTemp?.score ?? 0);
	const [comment, setComment] = useState<string>(feedbackTemp?.comment ?? '');

	const [addReview] = useAddReviewMutation();
	const {
		data: dishes,
		isLoading: dishesLoading,
		refetch: refetchDishes,
	} = useGetAllDishesQuery();

	const handleRatingClick = (value: number) => {
		setRating(value);
	};


	const handleSubmit = async(e: React.FormEvent) => {
		e.preventDefault();

        if (onSubmit) {
            if (!selectedDish || rating === 0) {
                showNotification(false, 'Пожалуйста, выберите блюдо и поставьте оценку');
                return;
            }

            const dish = dishes?.data?.find(d => d.id === Number(selectedDish));
            if (!dish) return;

            const newFeedback: IAddReview = {
                dishId: dish.id,
                score: rating,
                comment: comment
            };

            const response = await addReview(newFeedback);
            if (response.error) {
                showNotification(false, "Неизвестная ошибка");
                return;
            }
		    onSubmit();
        }
        else if (onChangeSubmit && ingridientId) {
            if (rating === 0) {
                showNotification(false, "Поставьте оценку!");
                return;
            }

            onChangeSubmit({ id: ingridientId, score: rating, comment: comment });
        }


		// Сброс формы
		setSelectedDish('');
		setRating(0);
		setComment('');
	};

	

    const renderStars = (value: number, interactive = false) => {
        return (
            <div className={Styles['rating-group']}>
                {[1, 2, 3, 4, 5].map(star => (
                    <span
                        key={star}
                        className={`${Styles['rating-star']} ${
                            star <= value ? Styles.active : ''
                        } ${interactive ? '' : Styles.star}`}
                        onClick={interactive ? () => handleRatingClick(star) : undefined}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={Styles['form-group']}>
                <label htmlFor='dish'>Выберите блюдо</label>
                <select
                    id='dish'
                    value={selectedDish}
                    onChange={e => setSelectedDish(e.target.value)}
                    required
                >
                    {ingridientId ? (
                        <option value={`${ingridientId}`}>{dishes?.data.find(i => i.id === ingridientId)?.name}</option>
                    ) : (
                        <option value=''>Выберите блюдо...</option>
                    )}

                    {!ingridientId && dishes?.data
                        .map(dish => (
                            <option key={dish.id} value={dish.id}>
                                {dish.name}
                            </option>
                        ))}	
                </select>
            </div>

            <div className={Styles['form-group']}>
                <label>Оценка</label>
                {renderStars(rating, true)}
            </div>

            <div className={Styles['form-group']}>
                <label htmlFor='comment'>Комментарий</label>
                <textarea
                    id='comment'
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder='Напишите ваш отзыв...'
                />
            </div>

            <button type='submit' className={Styles['submit-button']}>
                {ingridientId ? "Сохранить" : "Отправить отзыв"}
            </button>
        </form>
    )
}