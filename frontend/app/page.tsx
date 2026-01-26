"use client";

import Image from "next/image";
import { FocusEvent, FormEvent, FormEventHandler, useEffect, useState } from "react";
import { endpoints } from "./config/endpoints"
import { loginUser } from "./tools/auth";
import { AuthForm } from "./components/AuthForm/AuthForm";

export default function Home() {

  return (
    <div>
      <AuthForm />
    </div>
  );
}
