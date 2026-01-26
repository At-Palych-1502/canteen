"use client";

import Image from "next/image";
import { FocusEvent, FormEvent, FormEventHandler, useEffect, useState } from "react";
import { endpoints } from "./config/endpoints"
import { loginUser } from "./tools/auth";

export default function Home() {
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
