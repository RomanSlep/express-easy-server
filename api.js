module.exports = (app) => {
    app.get('/api', (req, res) => {
        const GET = req.query;
        res.json({
            success: true,
            GET
        });
    });
};