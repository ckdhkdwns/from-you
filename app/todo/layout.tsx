export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <main className="container mx-auto p-4">{children}</main>
    </section>
  );
}
