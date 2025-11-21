import Link from "next/link";

export default function ComponentsPage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      <h1>Components Page</h1>
      <Link href="/components/atoms">See Atoms</Link>
      <Link href="/components/molecules">See Molecules</Link>
      <Link href="/components/organisms">See Organisms</Link>
    </div>
  );
}
