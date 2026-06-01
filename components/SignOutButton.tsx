"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button className="button ghost" onClick={() => signOut({ callbackUrl: "/" })} type="button">
      Sign out
    </button>
  );
}
