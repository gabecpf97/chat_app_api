import express from "express";
const router = express.Router();

router.get('/', (req, res, next) => {
    res.send("<h1>This is backend</h1>");
});

export default router;