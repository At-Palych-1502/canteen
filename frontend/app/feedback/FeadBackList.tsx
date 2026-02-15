import { MouseEvent } from "react";
import { IGetReview } from "../tools/types/reviews";
import Styles from "./page.module.css";
import { useDeleteReviewMutation, useUpdateReviewMutation } from "../tools/redux/api/reviews";

interface Props {
    userFeedbacks: any,
}

export const FeadBackList = ({
    userFeedbacks,
}: Props) => {

    const [changeFeedBack] = useUpdateReviewMutation();
    const [deleteFeedback] = useDeleteReviewMutation();

    const changeFeedbackHandler = (id: number) => {
        
    };

    const deleteFeedbackHandler = async(id: number) => {
        await deleteFeedback(id);

        userFeedbacks.refetch();
    };


    return (
        <div className={Styles['feedbacks-list']}>
            <div className={Styles['feedbacks-header']}>
                <h2>Мои отзывы</h2>
            </div>
            {!userFeedbacks?.isLoading ? (
                userFeedbacks?.data?.reviews?.map((feedback: IGetReview) => (
                    <div key={feedback.id} className={Styles['feedback-card']}>
                        <div>
                            <div className={Styles['feedback-header']}>
                                <span className={Styles['feedback-dish-name']}>
                                    {feedback?.dish?.name}
                                </span>
                            </div>
                            <div className={Styles['feedback-rating']}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span
                                        key={star}
                                        className={`${Styles.star} ${
                                            star <= feedback.score ? '' : Styles.inactive
                                        }`}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            {feedback.comment && (
                                <p className={Styles['feedback-comment']}>{feedback.comment}</p>
                            )}
                        </div>
                        <div>
                            <button onClick={() => { changeFeedbackHandler(feedback.id) }} className={Styles["change-button"]}>Изменить</button>
                            <button onClick={() => { deleteFeedbackHandler(feedback.id) }} className={Styles["delete-button"]}>Удалить</button>
                        </div>
                    </div>
                ))
            ) : (
                <div className={Styles['empty-state']}>У вас пока нет отзывов</div>
            )}
        </div>
    )
}