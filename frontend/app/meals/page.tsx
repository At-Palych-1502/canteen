"use client"

import { useGetAllDishesQuery } from "../tools/redux/api/dishes";
import { useGetAllIngredientsQuery } from "../tools/redux/api/ingredients";
import { useGetAllMealsQuery } from "../tools/redux/api/meals";
import Styles from "./page.module.css";

export default function() {
    const {
        data: ingredients,
        refetch: refetchIngridients
    } = useGetAllIngredientsQuery();
    const {
        data: dishes,
        refetch: refetchDishes
    } = useGetAllDishesQuery();

    return (
        <main className={Styles.main}>
            <h1>Учёт оставшихся ингридиентов и блюд</h1>
            <div className={Styles.main_div}>
                <section>
                    <div>
                        <h2 className={Styles.h2}>Ингридиенты</h2>
                        <table className={Styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Количество</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ingredients?.data.map(ingredient => (
                                    <tr
                                        key={ingredient.id}
                                        className={Styles.row}
                                    >
                                        <td>{ingredient.id}</td>
                                        <td>{ingredient.name}</td>
                                        <td>{ingredient.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                <section>
                    <div> 
                        <h2 className={Styles.h2}>Блюда</h2>
                        <table className={Styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Количество</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dishes?.data.map(dish => (
                                    <tr
                                        key={dish.id}
                                        className={Styles.row}
                                    >
                                        <td>{dish.id}</td>
                                        <td>{dish.name}</td>
                                        <td>{dish.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </main>
    )
}