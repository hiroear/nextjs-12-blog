## getStaticProps を定義
- SSG (静的ジェネレータ？) でページをレンダリングする場合に使う。  
- 外部から初回一度だけデータを取ってくる時に使われる (getStaticProps関数は、ビルド時に実行される)。  
- getStaticProps関数の中でカスタムフックを呼び出し、該当のデータを持つオブジェクトを return内で propsとして設定。  
→ 別コンポーネントで propsとして受け取り、データを加工、表示していく。  
- 
```
// fuctionで書く場合
export async function getStaticProps() {
  return {
    props: {},  // コンポーネントに渡すデータを入れて props として返す
  };
}

// アロー関数で書く場合
export const getStaticProps = async () => {
  return {
    props: {},
  };
}
```

## 動的ルーティングのためのファイル名一覧のオブジェクトを生成するカスタムフック (getStaticPaths を定義する前段階)
- return{} の中で [{params: {id: "ssg-ssr"}}, {params: {id: "react-next"}}, {params: {id: "pre-rendering"}}] のような  
オブジェクトの形で生成しないと、getStaticPaths関数の return内で、pathとして取得することができない。  
```
// カスタムフックの例
export const getAllPostIds = () => {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),  // ファイル名から拡張子を除いた文字列を idオブジェクトに設定
      }
    }
  });
}
```

## getStaticPaths を定義
- return内の pathとして、[ファイル名].jsに当てはめて動的ルーティングされる任意の[ファイル名]一覧を取得、オブジェクトとして返す。  
-  getStaticPaths関数の中で、[ファイル名]オブジェクトの配列を生成するカスタムフックを呼び出し  
→ 取得した [ファイル名]オブジェクトの配列を return内で返すことで、その一つ一つを pathに設定することができる (SSGとしてページを表示する準備が整う)  
- fallback: false と書くと、pathに設定したもの以外の存在しないパスにアクセスした時に 404 ページを返してくれる  
- pathとして取得された後、/posts/ssg-ssr のような動的ルーティング (URL) が生成される。
```
export const getStaticPaths = async () => {
  const paths = getAllPostIds();
    // カスタムフック呼び出し -> [{params: {id: "ssg-ssr"}}, {params: {id: "react-next"}}...]が pathsに入る

  return {
    paths,
    fallback: false
  };
}
```