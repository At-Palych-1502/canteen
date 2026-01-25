"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { endpoints } from "./config/endpoints"
import { loginUser } from "./tools/auth";

export default function Home() {
  const [test, setTest] = useState("");

  useEffect(() => {
    async function foo() {
      const user = await loginUser("admin", "password");
      console.log(user);
    }
    foo();
  }, [])

  return (
    <div>
      
    </div>
  );
}
