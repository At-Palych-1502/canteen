"use client";

import { useEffect } from "react"
import Styles from "./Notification.module.css"

interface Props {
    text: string,
    ok: boolean,
    close: () => void
}
export const Notification = (props: Props) => {
    useEffect(() => {
        const timeId = setTimeout(() => {
            props.close();
        }, 2000);
        return () => clearTimeout(timeId);
    }, [])

    return (
        <p onClick={props.close} className={`${Styles["main"]} ${props.ok ? Styles["main_green"] : Styles["main_red"]}`}>
            {props.text}
        </p>
    )
}