export interface IReview {
	comment: string;
	score: number;
	id: number;
	username: string;
}

export interface IAddReview {
	id: number;
	data: IReview;
}

export interface IUpdateReviewReq {
	id: number;
	data: Partial<IReview>;
}

export interface IUpdateReviewRes {
	review: IReview;
}

export interface IGetReviewsByMealIdRes {
	reviews: IReview[];
}
