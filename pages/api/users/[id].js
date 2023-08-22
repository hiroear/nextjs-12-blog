export default function handler(req, res) {
    res.status(200).json({ id: req.query.id }); // req.query.id は、pages/api/users/[id].js で指定した [id] の値
    // 例 : https://example.com/api/users/100  =>  {"id":"100"}

    // const { query } = req;
    // const { id } = query;
}