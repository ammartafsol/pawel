import Link from "next/link";
import styles from "./HomeTemplate.module.css";

export default function HomeTemplate() {
  return (
    <main className={styles.main}>
      Example Project
      <Link href="/components">See Components</Link>
    </main>
  );
}
