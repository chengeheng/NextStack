// app/login/layout.tsx
export const metadata = {
  layout: false,
};

export default function EmptyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // 返回 children 本身，不嵌套任何布局
}
