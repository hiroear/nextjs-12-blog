export default function handler(req, res) {
    const { method } = req;
    console.log(req.body);

    switch (method) {
    case 'GET':
        res.json({ message: 'GETリクエスト' });
        console.log('GETリクエスト');
        break;
    case 'POST':
        res.json({ message: 'POSTリクエスト' });
        console.log('POSTリクエスト');
        break;
    case 'PUT':
        res.json({ message: 'PUTリクエスト' });
        break;
    case 'PATCH':
        res.json({ message: 'PATCHリクエスト' });
        break;
    default:
        res.json({ message: '何もないリクエストです' });
        break;
    }

}




