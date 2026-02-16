import { MouseEvent, useState } from "react";
import { IGetReview, IReview, IUpdateReviewReq } from "../tools/types/reviews";
import Styles from "./page.module.css";
import { useDeleteReviewMutation, useUpdateReviewMutation } from "../tools/redux/api/reviews";
import { Popup } from "../components/Popup/Popup";
import { FeedBackForm } from "./FeadBackForm";

interface Props {
    userFeedbacks: any,
    isCloseButtons?: boolean
}

export const FeadBackList = ({
    userFeedbacks,
    isCloseButtons
}: Props) => {
    const [isChangePopup, setIsChangePopup] = useState(false);
    const [changingIngridientId, setChangingIngridientId] = useState<number>();
    const [feedbackTemp, setFeedbackTemp] = useState<IReview>();

    const [changeFeedBackMutation] = useUpdateReviewMutation();
    const [deleteFeedbackMutation] = useDeleteReviewMutation();

    const changeFeedbackHandler = (id: number) => {
        setChangingIngridientId(id);
        setFeedbackTemp(userFeedbacks?.data?.reviews?.find((i: IReview) => i.id === id));
        setIsChangePopup(true);
    };

    const changeFeedback = async(data: IUpdateReviewReq) => {
        await changeFeedBackMutation(data);
        setIsChangePopup(false);
        userFeedbacks.refetch();
    }

    const deleteFeedbackHandler = async(id: number) => {
        await deleteFeedbackMutation(id);

        userFeedbacks.refetch();
    };


    return (
        <>
        <div className={Styles['feedbacks-list']}>
            <div className={Styles['feedbacks-header']}>
                <h2>{isCloseButtons ? "Отзывы" : "Мои отзывы"}</h2>
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
                        {!isCloseButtons && (
                            <div>
                                <button onClick={() => { changeFeedbackHandler(feedback.id) }} className={Styles["change-button"]}>Изменить</button>
                                <button onClick={() => { deleteFeedbackHandler(feedback.id) }} className={Styles["delete-button"]}>Удалить</button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className={Styles['empty-state']}>У вас пока нет отзывов</div>
            )}
        </div>

        {isChangePopup && (
            <Popup closePopup={() => { setIsChangePopup(false) }}>
                <FeedBackForm
                    onChangeSubmit={changeFeedback}
                    showNotification={() => {}}
                    ingridientId={changingIngridientId}
                    feedbackTemp={feedbackTemp}
                    />
            </Popup>
        )}

        </>
    )
}