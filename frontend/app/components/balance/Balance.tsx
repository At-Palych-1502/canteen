"use client"

import { useSelector } from "react-redux";
import Styles from "./Balance.module.css"
import { selectUser } from "../../tools/redux/user";
import { useAddManyMutation, useGetBalanceQuery } from "../../tools/redux/api/business";
import { MouseEvent, useState } from "react";

export const Balance = () => {
    const [value, setValue] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);

    const User = useSelector(selectUser);
	const {
		data: balance,
		isLoading: isBalanceLoading,
		refetch: refetchBalance
	} = useGetBalanceQuery();

    const [addMany] = useAddManyMutation();

    const handleAdd = async() => {
        setIsDisabled(true);
        await addMany(value ?? 0);
        setValue(0);
        refetchBalance();
        setIsDisabled(false);
    }

    return (
        <main className={Styles.main}>
            <h2>Текущий баланс: {balance?.balance}</h2>
            <div className="add">
                <input id="input_balance" step={1} onChange={e => setValue(Number(e.target.value) ?? 0)} className={Styles.input} type="number"></input>
                <button disabled={isDisabled} onClick={handleAdd}>Пополнить</button>
            </div>
        </main>
    )
}