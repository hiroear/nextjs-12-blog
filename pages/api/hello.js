// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// どうやって使うの？ => pages/api/以下にファイルを作成する 例: pages/api/hello.js  => https://example.com/api/hello

export default async function handler(req, res) {
  console.log(req.method); // GET or POST
  console.log(req.body);  // { name: 'hiroe' } POSTリクエストから bodyプロパティで送信されたデータ
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const users = await response.json();
  res.status(200).json({users});
}