const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Koneksi ke MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // ganti dengan username Anda
    password: 'root', // ganti dengan password Anda
    database: 'pengaduan_masyarakat'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rute untuk menampilkan form
app.get('/', (req, res) => {
    res.render ('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/loginuser',(req,res) => {
    res.send('loginuser')
})
app.post('/cek', (req,res) =>{
    res.send('login BERHASIL')
});
app.get('/register', (req, res) => {
    
    res.render('register', { name: '', email: '' });
});

app.get('/admin', (req, res) => {
    res.render('admin');
});
app.get('/pegawai', (req, res) =>{
    res.render('pegawai');
})

// Rute untuk menambah data
app.post('/add', (req, res) => {
    const { name, email } = req.body;
    const sql = 'INSERT INTO user (name, email) VALUES (?, ?)';
    
    db.query(sql, [name, email], (err, result) => {
        if (err) throw err;
        res.send('Data berhasil ditambahkan!');
    });
});

// Rute untuk registrasi
app.post('/registercheck', async (req, res) => {
    const { name, email, password } = req.body;

    // Periksa apakah email sudah terdaftar
    const checkUserSql = 'SELECT * FROM user WHERE email = ?';
    db.query(checkUserSql, [email], async (err, results) => {
        if (err) throw err;
        
        if (results.length > 0) {
            return res.send('Email sudah terdaftar!');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
        
        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) throw err;
            res.send('Data berhasil ditambahkan!');
        });
    });
});

// Mulai server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
