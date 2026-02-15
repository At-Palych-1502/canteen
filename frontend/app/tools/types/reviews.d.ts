import { IDish } from "./dishes";

export interface IReview {
	comment: string;
	score: number;
	id: number;
	username: string;
}

export interface IAddReview {
	dishId: number,
	score: number,
	comment: string
}

export interface IUpdateReviewReq {
	id: number;
	score: number,
	comment: string
}

export interface IUpdateReviewRes {
	review: IReview;
}

export interface IGetReviewsByMealIdRes {
	reviews: IReview[];
}

export interface IGetReview extends IReview {
	dish: IDish
}
export interface IGetReviewRes {
	reviews: IGetReview[]
}