"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/client/store";
import { increment, decrement } from "@/client/store/counterSlice";

export default function HomePage() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}
