import Link from "next/link";
import styles from "./HomeTemplate.module.css";

export default function HomeTemplate() {
  return (
    <main className={`fs-28`}>
      Example Project
      <Link href="/components">See Components</Link>
    </main>
  );
}
