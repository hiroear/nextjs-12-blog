// トップページのコンポーネント (Homeコンポーネント) /localhost:3000
// pages/index.js トップページのコンポーネントを作成すると、ルーティングが自動で設定される
// <Layout>コンポーネントを読み込み、その中の children 部分に、トップページのコンポーネントの中身を入れていく

import Head from 'next/head'
import Link from 'next/link';
import Layout, { siteTitle } from '../components/Layout';
import styles from '../styles/Home.module.css'
import utilStyles from '../styles/utils.module.css';
import { getPostsData } from "../lib/post";  // posts配下の各mdファイルのメタデータが入ったオブジェクトを返すカスタムフック

// ↓ 以下、SSGの場合のみ必要。 外部のデータを取得するための関数(読み込み時一度だけ実行される)
// getStaticProps関数の中でカスタムフックを呼び出し、各mdファイルのデータオブジェクトを取得 → それを propsに設定 (Homeコンポーネントに propsを渡す準備)
export function getStaticProps() {
  const allPostsData = getPostsData();
  // カスタムフック getPostsDataを展開 → 各mdファイルのメタデータオブジェクトを取得 (id, title, date, thumbnail)
  // console.log(allPostsData);

  return {
    props: {
      allPostsData,  // allPostsDataを、propsとして Homeコンポーネントに渡す準備
    },
  };
}

/* SSR の場合は、getStaticProps ではなく、getServerSideProps を使う
export async function getServerSideProps(context) {
    (context) には、ユーザーがリクエストした情報が入る 以下例 ↓
    context.req : リクエスト情報
    context.res : レスポンス情報
    context.query : クエリパラメータ
    context.params : URLパラメータ
    context.preview : プレビューの有無
    context.previewData : プレビューのデータ
    context.resolvedUrl : リクエストされたURL
    context.locale : リクエストされたロケール
    context.locales : サポートされているロケール
    context.defaultLocale : デフォルトのロケール
    context.domainLocales : ドメインのロケール
    context.__NEXT_INIT_QUERY : クエリパラメータ
    context.__NEXT_INIT_LOCALE : ロケール

  return {
    props: {}, // コンポーネントに渡すデータを入れて props として返す
  }
}
*/

export default function Home({ allPostsData }) {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Layout Home>
        {/* 以下、Layoutコンポーネントの children 部分に入る */}
        <section className={utilStyles.headingMd}>
          <p>This is a sample website.</p>
        </section>

        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2>📝駆け出しエンジニアのブログ</h2>
          <div className={styles.grid}>
            {/* allPostsDataの中身をループ処理して、各mdファイルのデータを持つオブジェクトを取り出し、各オブジェクトの中身をそれぞれの変数に展開 */}
            {allPostsData.map(({ id, title, date, thumbnail }) => (
              <article key={id}>
                <Link href={`/posts/${id}`}>
                  <img src={thumbnail} className={styles.thumbnailImage} />
                </Link>
                <Link href={`/posts/${id}`} className={utilStyles.boldText}>
                  {title}
                </Link>
                <br />
                <small className={utilStyles.lightText}>{date}</small>
              </article>
            ))}
          </div>
        </section>
      </Layout>
    </>
  )
}
