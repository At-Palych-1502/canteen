"use client";

import { IOrder } from '@/app/tools/types/mock';
import { IDish } from '@/app/tools/types/dishes';
import React, { useEffect, useState } from 'react';
import Styles from './CurrentOrder.module.css';
import { getMealsForCook, setMealsCount } from '@/app/tools/utils/meals';
import { getAccessToken } from '@/app/tools/utils/auth';

interface Props {
	order: IOrder
}


export interface IMeal {
	name: string;
	price: number;
	day_of_week: string;
	quantity: number;

	dishes: IDish[];
}


export const OrdersForCook = () => {
	const [orderCount, setOrderCount] = useState(Array<number>);
    const [meals, setMeals] = useState(Array<IMeal>);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasChanged, setHasChanged] = useState(false);

    async function uploadMeals() {
        const date = new Date();
        const dayOfWeek = date.toLocaleString('en-US', {weekday: "long"});
        const temp = await getMealsForCook(dayOfWeek);

        if (temp.ok) {
            setMeals(temp.response.meals);
            setIsLoaded(true);
            const arr = temp.response.meals.map(() => { return 0; } );
            setOrderCount(arr);
            console.log(temp.response.meals);
        } else {
            console.log(temp.error);
        }
    }

	useEffect(() => {
        uploadMeals();
    }, []);

	const handleOrderCountPlus = (index: number) => {
        setOrderCount(orderCount.map((val, i: number) => { 
            if (i === index) {
                return val + 1;
            } else {
                return val;
            }
        }));
        setHasChanged(true);
	}
	const handleOrderCountMines = (index: number) => {
        setOrderCount(orderCount.map((val, i: number) => { 
            if (i === index && val > 0) {
                return val - 1;
            } else {
                return val;
            }
        }));
        setHasChanged(true);
	}

    const handleButton = () => {
        const temp = meals.map((meal: IMeal, index: number) => {
            meal.quantity = meal.quantity < orderCount[index] ? 0 : meal.quantity - orderCount[index];
            return meal;
        });
        setMeals(temp);
        setOrderCount(temp.map(() => { return 0; }));
        setMealsCount(temp);
        setHasChanged(false);
    }

	return (
        <div className={Styles["cook_div"]}>
            {isLoaded ? (
                <>
                <h1>Количество выданных комплектов</h1>
                <div className={Styles['orders']}>
                {
                    meals?.map((meal: IMeal, index) => {
                        return (
                            <div key={index} className={Styles['order-card']}>
                                <div className={Styles['order-header']}>{meal.name} <span>({meal.quantity})</span></div>
                                <div className={Styles['order-meals']}>
                                    {meal.dishes?.map((meal: IDish, index: number) => (
                                        <div
                                            key={index}
                                            className={Styles['meal-item']}
                                        >
                                            <span className={Styles['meal-name']}>{meal.name}</span>
                                            <span className={Styles['meal-info']}>{meal.weight}г</span>
                                        </div>
                                    ))}
                                </div>
                                <div className={Styles["cook_panel"]}>
                                    <h4 className={Styles["cook_panel_title"]}>Выдано:</h4>
                                    <span onClick={() => handleOrderCountMines(index)} className={Styles["add_button"]}>–</span>
                                    <span className={Styles["cook_panel_digit"]}>{orderCount[index]}</span>
                                    <span onClick={() => handleOrderCountPlus(index)} className={Styles["add_button"]}>+</span>
                                </div>
                            </div>
                        )
                    })
                }
                </div>
                <button onClick={handleButton} disabled={!hasChanged} className={`${Styles["receive-button"]} ${Styles["receive-button-cook"]}`}>{hasChanged ? "Сохранить" : "Сохранено"}</button>
                </>
            ) : (
                <h3>Загрузка...</h3>
            )}
		</div>
	);
};