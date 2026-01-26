import Link from "next/link";
import Styles from "./Header.module.css"

export function Header() {
    const isAuth = false;

    return (
        <header className={Styles["header"]}>
            <div className={Styles["header_container"]}>
                <Link href="/"><h1 className={Styles["main_title"]}>Умная столовая</h1></Link>
                <ul className={Styles["button_list"]}>
                    <li><button className={Styles["button"]}>Меню</button></li>
                    <li><button className={Styles["button"]}>Абонементы</button></li>
                    <li><button className={Styles["button"]}>Отзывы</button></li>
                    <li><button className={Styles["button"]}>Контакты</button></li>
                </ul>
                <button className={Styles["auth"]}>Войти</button>
            </div>
        </header>
    )
}