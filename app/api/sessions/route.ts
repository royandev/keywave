import { NextResponse } from "next/server";
import { findUserByUsername, type WalletUserProfile } from "@/src/data/userRepository";

const sanitize = (user: WalletUserProfile | null) => {
  if (!user) return null;
  const { password: _password, ...rest } = user;
  void _password;
  return rest;
};

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body ?? {};
  if (!username || !password) {
    return NextResponse.json({ error: "username and password are required" }, { status: 400 });
  }

  const user = await findUserByUsername(username);
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({ user: sanitize(user) }, { status: 200 });
}
