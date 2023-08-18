// 全てのページで共通のレイアウトを定義するためのコンポーネント

import Head from "next/head";
import Link from "next/link";
import styles from "./layout.module.css";
import utilStyles from "../styles/utils.module.css";

const name = 'Hiroe';
export const siteTitle = 'Next.js Blog';


const Layout = ({ children, Home }) => {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        { Home ? (
          <>  {/* propsの Homeが渡ってきたら ↓ (<>で囲うのを忘れずに) */}
            <img
              src="/images/profile.jpeg"
              alt="profile"
              className={`${utilStyles.borderCircle} ${styles.headerHomeImage}`}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>  {/* propsの Homeが渡ってこなかったら ↓  */}
            <img
              src="/images/profile.jpeg"
              alt="profile"
              className={`${utilStyles.borderCircle} ${styles.headerImage}`}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) }
      </header>
      <main>{children}</main>

      {!Home && (  // Homeコンポーネント以外のページでは、ホームヘ戻るボタンを表示 (propsの Homeが存在しなかったら)
        <div className={styles.backToHome}>
          <Link href="/">
            ← Back to home
          </Link>
        </div>
      )}
    </div>
  )
}

export default Layout;