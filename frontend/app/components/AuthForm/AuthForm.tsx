"use client";

import { loginUser } from "@/app/tools/auth";
import { FocusEvent, FormEvent, useState } from "react";
import Styles from "./AuthFrom.module.css";

export function AuthForm() {
    const [test, setTest] = useState("");
      const [authInfo, setAuthInfo] = useState({ username: "", password: "" });
    
      const onSubmitHandler = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await loginUser(authInfo);
        if (response.ok) {
          setTest(JSON.stringify(response.user));
        } else {
          setTest(response.error ?? "");
        }
      };
    
      const inputHandler = (event: FocusEvent<HTMLInputElement, Element>) => {
        const temp = {...authInfo, [event.target.name]: event.target.value }
        
        setAuthInfo(temp);
      }
    
      return (
        <div>
          <form onSubmit={onSubmitHandler}>
            <h3>Введите имя пользователя</h3>
            <input onBlur={inputHandler} type="text" name="username" />
            <h3>Введите пароль</h3>
            <input onBlur={inputHandler} type="text" name="password"/>
            <button type="submit">Авторизоваться</button>
    
            {
              test && (
                <>
                <p>Ответ: {test}</p>
                </>
              )
            }
          </form>
        </div>
      );
}