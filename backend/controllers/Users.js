const { UsersModel } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = (req, res) => {
    try {
        UsersModel.findAll({
            attributes: ['id', 'nama', 'email']
        }).then((user) => {
            res.json(user);
        })
    } catch (error) {
        console.log(error);
    }
}

const Register = (req, res) => {
    const { nama, email, password, confirm_password } = req.body;
    UsersModel.findOne({
        where: {
            email: req.body.email
        }
    }).then(async (user) => {
        if (user)
            return res.status(400).json({ msg: "Email Sudah Terdaftar" });
        if (!nama)
            return res.status(400).json({ msg: "Kolom Nama Harus Di Isi" });
        if (!email)
            return res.status(400).json({ msg: "Kolom Email Harus Di Isi" });
        if (!password)
            return res.status(400).json({ msg: "Kolom Password Harus Di Isi" });
        if (!confirm_password)
            return res.status(400).json({ msg: "Kolom Confirm Password Harus Di Isi" });
        if (password !== confirm_password)
            return res.status(400).json({ msg: "Password dan Cofirm Password tidak cocok" });
        try {
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);
            UsersModel.create({
                nama: nama,
                email: email,
                password: hashPassword
            });
            res.json({ msg: "Register Berhasil" });
        } catch (error) {
            console.log(error);
        }
    });



}

const Login = (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email)
            return res.status(400).json({ msg: "Kolom Email Harus Di Isi" });
        if (!password)
            return res.status(400).json({ msg: "Kolom Password Harus Di Isi" });
        UsersModel.findAll({
            where: {
                email: email
            }
        }).then(async (user) => {
            console.log('asdasd')
            if (!user) return res.status(400).json({ msg: "Email Tidak Tersedia" });
            const match = await bcrypt.compare(req.body.password, user[0].password);
            if (!match) return res.status(400).json({ msg: "Wrong Password" });
            const userId = user[0].id;
            const name = user[0].nama;
            const email = user[0].email;
            const accessToken = jwt.sign({ userId, name, email }, process.env.SECRET_KEY, {
                expiresIn: '5m'
            });
            const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_KEY, {
                expiresIn: '1d'
            });
            await UsersModel.update({ refresh_token: refreshToken }, {
                where: {
                    id: userId
                }
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            const Responsedata = {
                id: userId,
                nama: name,
                email: email,
                accessToken: accessToken
            };
            res.json(Responsedata);
        })
    } catch (error) {
        res.status(404).json({ msg: "Email belum terdaftar" });
    }
}

const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await UsersModel.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await UsersModel.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

module.exports = {
    getUsers,
    Login,
    Register,
    Logout,
};