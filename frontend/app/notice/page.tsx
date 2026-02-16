"use client"

import { useEffect } from "react";
import { useGetNoticesQuery } from "../tools/redux/api/business";
import Styles from "./page.module.css";

export default function NoticePage() {
    const {
        data,
        isLoading,
        refetch
    } = useGetNoticesQuery();

    useEffect(() => {
        refetch();
    }, [])

    return (
        <main className={Styles.main}>
            {!isLoading && data?.notifications && data?.notifications?.length > 0 ? data?.notifications.map(n => {
                return (
                    <div className={Styles.div} key={n.id}>
                        <h2 className={Styles.h2}>{n.title}</h2>
                        <h5 className={Styles.h5}>{new Date(n.created_at).toLocaleDateString()}</h5>
                        <p className={Styles.p}>{n.message}</p>
                    </div>
                )
            }) : (
                <h3>Уведомлений больше нет!</h3>
            )}
        </main>
    )
}