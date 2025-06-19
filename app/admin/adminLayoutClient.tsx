"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/client/store";
import { fetchCurrentUser } from "@/client/store/slices/userSlice";
import { ExamplesNav } from "@/app/admin/appSidebar";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // 如果用户信息不存在，则获取当前用户信息
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  return (
    <main className="w-full flex flex-1 flex-col items-center">
      <div className="w-full flex flex-col items-center border-grid border-b">
        <div className="w-full max-w-[1400px]">
          <div className="container p-6">
            <ExamplesNav />
          </div>
        </div>
      </div>
      <div className="w-full max-w-[1400px]">
        <div className="w-full p-6">
          <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
