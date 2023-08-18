// /posts配下の各mdファイル名 = [id] として、動的ルーティングで各ページを生成する。 /posts/ssg-ssr のようなURLを生成する

import Layout from "../../components/Layout";
import utilStyles from "../../styles/utils.module.css";
import { getAllPostIds } from "../../lib/post"; // 動的ルーティングのためのファイル名一覧のオブジェクトを生成するカスタムフック
import { getPostData } from "../../lib/post";  // id (mdファイル名)に基づいたブログ投稿データをHTMLに変換された文字列で返すカスタムフック
import Head from "next/head";

// getStaticPaths: 動的ルーティングのためのファイル名([id])の一覧を return内の pathとして取得・オブジェクトとして返す
export const getStaticPaths = async () => {
  const paths = getAllPostIds();
  // getAllPostIds関数を呼び出し、idオブジェクトを取得 -> [{params: {id: "ssg-ssr"}}, {params: {id: "react-next"}}]

  return {
    paths, // [{params: {id: "ssg-ssr"}}, {params: {id: "react-next"}}]
    fallback: false,
  };
}

/* 上記の getStaticPaths関数で pathを設定し、SSG でページを表示できる準備が整ったので
getStaticProps関数を使って、上で設定した pathの各id に対応したデータを取得 → propに設定 (Postコンポーネントに渡す準備) */
export const getStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id); // params.id で、各ページの idを取得 -> "ssg-ssr"
  // カスタムフック getPostDataを展開 → idに基づいたブログ投稿データをHTMLに変換された文字列で取得 (id, title, date, thumbnail, content)

  return {
    props: {
      postData,  // PostDataを、propsとして Postコンポーネントに渡す準備
    },
  };
}


export default function Post({ postData }) {

  return (
    <>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <Layout>
        {/* 以下、Layoutコンポーネントの children 部分に入る */}
        <article>
          <h1 className={utilStyles.headingXl}>{postData.title}</h1>
          <div className={utilStyles.lightText}>{postData.date}</div>

          {/* dangerouslySetInnerHTML : 文字列を HTMLとして扱うための Reactの機能
              ここでは、postData.blogContentHTML に格納されている HTMLを、そのまま表示する */}
          <div dangerouslySetInnerHTML={{ __html: postData.blogContentHTML }}/>
        </article>
      </Layout>
    </>
  );
}