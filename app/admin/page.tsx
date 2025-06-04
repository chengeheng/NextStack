"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/client/store";
import { increment, decrement } from "@/client/store/counterSlice";
import { getUserListFetch } from "@/client/apis/user";
import useSWRMutation from "swr/mutation";
import { useEffect } from "react";

export default function HomePage() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  const { trigger, data, error, isMutating } = useSWRMutation(
    "/api/user/list",
    getUserListFetch
  );
  console.log("data", data);
  useEffect(() => {
    trigger().then((response) => {
      console.log("User list fetched successfully:", response.data);
    });
  }, []);
  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}
