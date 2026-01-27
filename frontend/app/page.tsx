"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [test, setTest] = useState("");

  useEffect(() => {
    console.log("test");
    fetch("/api/api/login", {
      body: JSON.stringify({username: "admin", password: "password"}),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    }).then(async(value) => {
      const json = await value.json();
      console.log(json);
      setTest(json.access_token);
    });
  }, [])

  return (
    <div>
      {test}
      <br/>
      <h1>Сука финалочка (ещё разок)</h1>
    </div>
  );
}
