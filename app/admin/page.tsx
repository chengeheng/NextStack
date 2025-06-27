"use client";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/client/store";
import { increment, decrement } from "@/client/store/counterSlice";

export default function HomePage() {
  const count = useSelector((state: RootState) => state.counter.value);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      {user && <p>Welcome, {user.name}!</p>}
    </div>
  );
}
