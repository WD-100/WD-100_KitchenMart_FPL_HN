exports.verifyToken = (req, res) => {
    res.json({
        message: 'Token hợp lệ, bạn là user',
        user: req.user
    });
};
