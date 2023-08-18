// getPostsData : posts配下の各mdファイルのデータオブジェクトを返すカスタムフック
// getAllPostIds : 動的ルーティングのためのファイル名の一覧をオブジェクトとして生成するカスタムフック
// getPostData : id (mdファイル名)に基づいたブログ投稿データをHTMLに変換された文字列で返すカスタムフック

import path from "path";
import fs from "fs";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

/* process.cwd() : 現在のディレクトリを取得する関数 (ここではルートディレクトリを指す)
  path.join() : 引数に指定したパスを結合する関数  例）path.join("posts", "ssg-ssr.md") => "posts/ssg-ssr.md" */
const postsDirectory = path.join(process.cwd(), "posts") // postsディレクトリのパスを取得 => "/posts"

// ↓posts配下の各mdファイルのデータオブジェクトを返す
export const getPostsData = () => {
  // fs.readdirSync(): 引数に指定したディレクトリ内のファイル名を配列として取得する関数 -> ["ssg-ssr.md", "react-next.md"]
  const fileNames = fs.readdirSync(postsDirectory);

  // fileNamesをループ処理して各ファイル名で成形 →  オブジェクトに変換 → allPostsDataに /posts配下の各mdファイルのメタデータオブジェクトを入れる
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");  // ファイル名から.md を除いた文字列を idとしておく -> "ssg-ssr"

    const fullPath = path.join(postsDirectory, fileName);  // -> "posts/ssg-ssr.md"

    // fs.readFileSync(): 引数に指定したファイルの内容を文字列として取得する関数。mdファイルを文字列として読み取り → fileContentsに格納
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // matter関数を使って、文字列にした mdファイルのメタデータ部分(title: date: thumbnail:)を解析・取得
    const matterResult = matter(fileContents);

    // allPostsData関数の返り値として、 idと matterResult.data を結合したオブジェクト {id: "ssg-ssr", title: "hoge", date: "2021-01-01"...} の配列を返す
    return {
      id,  // ファイル名から.md を除いた文字列 -> "ssg-ssr"
      ...matterResult.data
      /* matterResult.data をスプレッド構文で展開することで、それぞれのメタデータを一つづつ取り出すことができる
      => { title: "hoge", date: "2021-01-01", thumbnail: "hoge.png", content: "本文" }
      各mdファイルの title: date: thumbnail: content: が、オブジェクトの配列として入っている。
      例） matterResult.data.title => "hoge"
      例） matterResult.content => "本文"
      例） matterResult.data.date => "2021-01-01" */
    };
  });

  // getPostsData関数の返り値として /posts配下の各mdファイルのメタデータオブジェクトを返す {id: "ssg-ssr", title: "hoge", date: "2021-01-01"...}
  return allPostsData;
}


// 動的ルーティングのためのファイル名一覧のオブジェクトを生成 (getStaticPathの return内で返す pathを取得する前段階)
export const getAllPostIds = () => {
  // fs.readdirSync()は引数に指定したディレクトリ内のファイル名を配列として取得する関数 -> ["ssg-ssr.md", "react-next.md"]
  const fileNames = fs.readdirSync(postsDirectory);

  // fileNamesを一つづつ取り出し、各ファイル名の拡張子を除いた文字列を idオブジェクトに設定し、getAllPostIds関数の返り値として返す
  return fileNames.map((fileName) => {
    // returnで params: {id: "ssg-ssr"} のようにしてオブジェクトを返す
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),  // ファイル名から拡張子を除いた文字列を idオブジェクトに設定
      }
    }
  });
  /* getAllPostIds関数の返り値として、以下のような一覧 [{オブジェクト}] を返す
  [
    {
      params: {
        id: "ssg-ssr"
      }
    },
    {
      params: {
        id: "react-next"
      }
    }
  ]
  上記のようなオブジェクトとして返さないと、getStaticPaths関数の return内で、pathを取得することができない。 */
}


// id (mdファイル名)に基づいたブログ投稿データを HTMLに変換された文字列で返す
export const getPostData = async(id) => {
  const fullPath = path.join(postsDirectory, `${id}.md`);  // -> "posts/ssg-ssr.md"

  const fileContent = fs.readFileSync(fullPath, "utf8"); // mdファイルを文字列に変換

  const matterResult = matter(fileContent); // matter関数を使って、文字列にした mdファイルのメタデータ(title: date: thumbnail:)を解析・取得

  // remark関数を使って、mdファイルをHTMLに変換 / matterResult.content(本文)は文字列なので、マークダウン記法がそのまま出力されてしまう。
  const blogContent = await remark()
  .use(html)  // remark関数の useメソッドで、remark-htmlを使い、mdファイルをHTMLに変換
  .process(matterResult.content);  // 変換したい mdファイルを processメソッドに渡す

  // 上で HTMLに変換した contentを さらに文字列に変換 → HTMLに変換された文字列を生成 (マークダウン記法ではなく、<h1>タイトル</h1><p>本文</p>のような形)
  const blogContentHTML = blogContent.toString();

  // getPostData関数の返り値として以下の三つを返す
  return {
    id,  //引数で届いた idオブジェクトの ↓
    blogContentHTML,  // HTMLに変換された文字列
    ...matterResult.data, // それぞれのメタデータをスプレッド構文で展開、一つづつ取り出すことができる
  }
};