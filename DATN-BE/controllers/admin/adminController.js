exports.dashboard = (req, res) => {
    res.json({
        message: 'Chào mừng đến với trang quản trị!',
        user: req.user
    });
};
