const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const session = require("express-session");
const nodemailer = require("nodemailer");
var ls = require("local-storage");
const app = express();

app.use(express.static("assets"));
app.use(express.urlencoded({ extended: false }));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "baperin",
});

app.use(
    session({
        secret: "my_secret_key",
        resave: false,
        saveUninitialized: false,
    })
);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "baperinupnvj@gmail.com",
        pass: "baperanamatdah",
    },
});

const mailOptions = {
    from: "baperinupnvj@gmail.com",
    to: "",
    subject: "Ubah Password Akun Baperin Anda",
    text: "",
};

function saveDateMeeting(username, psikolog, booking, jam, jenisKonsultasi) {
    let date = new Date();
    date.setDate(date.getDate() + booking);
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();

    var tanggal = day + "/" + month + "/" + year + " | " + jam;

    if (jenisKonsultasi == 1) {
        connection.query(
            "INSERT INTO jadwal_konseling (tanggal, username, nama_psikolog) VALUES (?, ?, ?)", [tanggal, username, psikolog]
        );
    }

    if (jenisKonsultasi == 2) {
        connection.query(
            "INSERT INTO jadwal_mentoring (tanggal, username, nama_psikolog) VALUES (?, ?, ?)", [tanggal, username, psikolog]
        );
    }
}

function sendEmailAccept(username, jenisKonsultasi) {
  console.log("accept");
  connection.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    (error, results) => {
      mailOptions.to = results[0].email;
      mailOptions.text =
        "https://zoom.us/j/96483924192?pwd=Mnk0eUVzWFJGOXRWQnZ2OE1RUHVoZz09";
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        console.log("Email sent: " + info.response);
        if (jenisKonsultasi === 1) {
          connection.query("DELETE FROM jadwal_konseling WHERE username = ?", [
            username
          ]);
          res.redirect("/admin");
        } else if (jenisKonsultasi === 2) {
          connection.query("DELETE FROM jadwal_mentoring WHERE username = ?", [
            username
          ]);
          res.redirect("/admin");
        }
      });
    }
  );
}

function sendEmailReject(username, jenisKonsultasi) {
  console.log("reject");
  connection.query(
    "SELECT * FROM user WHERE username = ?",
    [username],
    (error, results) => {
      mailOptions.to = results[0].email;
      mailOptions.text = "mohon maaf anda ditolak";
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) throw err;
        console.log("Email sent: " + info.response);
        if (jenisKonsultasi === 1) {
          connection.query("DELETE FROM jadwal_konseling WHERE username = ?", [
            username
          ]);
          res.redirect("/admin");
        } else if (jenisKonsultasi === 2) {
          connection.query("DELETE FROM jadwal_mentoring WHERE username = ?", [
            username
          ]);
          res.redirect("/admin");
        }
      });
    }
  );
}

app.use((req, res, next) => {
    if (req.session.username === undefined) {
        res.locals.isLoggedIn = false;
    } else {
        res.locals.username = req.session.username;
        res.locals.isLoggedIn = true;
    }
    next();
});

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs", { errors: "" });
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    connection.query(
        "SELECT * FROM user WHERE email = ?", [email],
        (error, results) => {
            if (results.length > 0) {
                const plain = req.body.password;
                const hash = results[0].password;
                bcrypt.compare(plain, hash, (error, isEqual) => {
                    if (isEqual) {
                        req.session.username = results[0].username;
                        if (email === "admin@gmail.com") {
                            res.redirect('/admin');
                        } else {
                            res.redirect("/");
                        }
                    } else {
                        res.render("login.ejs", {
                            error: "Email atau Kata Sandi yang Anda masukkan salah",
                        });
                    }
                });
            } else {
                res.render("login.ejs", {
                    errors: "Email atau Kata Sandi yang Anda masukkan salah",
                });
            }
        }
    );
});

app.get("/admin", (req, res) => {
  const jadwal = [];
  connection.query("SELECT * FROM jadwal_konseling", (error, results) => {
    jadwal.push(results);
    connection.query("SELECT * FROM jadwal_mentoring", (error, results) => {
      jadwal.push(results);
      res.render("adminPage.ejs", {
        jadwalKonseling: jadwal[0],
        jadwalMentoring: jadwal[1]
      });
    });
  });
});

app.get('/accept/:username/:konsultasi', (req, res) => {
  const username = req.params.username;
  const konsultasi = req.params.konsultasi;
  sendEmailAccept(username, konsultasi);
  res.redirect('/admin');
})

app.post('/accept/:username/:konsultasi', (req, res) => {
  const username = req.params.username;
  const konsultasi = req.params.konsultasi;
  sendEmailAccept(username, konsultasi);
  res.redirect('/admin');
});

app.get('/reject/:username/:konsultasi', (req, res) => {
  const username = req.params.username;
  const konsultasi = req.params.konsultasi;
  sendEmailReject(username, konsultasi);
  res.redirect('/admin');
})

app.post('/reject/:username/:konsultasi', (req, res) => {
  const username = req.params.username;
  const konsultasi = req.params.konsultasi;
  sendEmailReject(username, konsultasi);
  res.redirect('/admin');
});

app.get("/register", (req, res) => {
    res.render("register.ejs", { errors: "" });
});

app.post(
    "/register",
    (req, res, next) => {
        const email = req.body.email;
        connection.query(
            "SELECT * FROM user WHERE email = ?", [email],
            (error, results) => {
                if (results.length > 0) {
                    res.render("register.ejs", {
                        errors: "Email yang Anda masukan sudah terdaftar",
                    });
                } else {
                    next();
                }
            }
        );
    },
    (req, res) => {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        if (password === confirmPassword) {
            bcrypt.hash(password, 10, (error, hash) => {
                connection.query(
                    "INSERT INTO user (username, email, password) VALUES (?, ?, ?)", [username, email, hash],
                    (error, results) => {
                        req.session.username = username;
                        res.redirect("/login");
                    }
                );
            });
        } else {
            res.render("register.ejs", {
                errors: "Password yang Anda masukan tidak sama",
            });
        }
    }
);

app.get("/forgot-password", (req, res) => {
    res.render("forgotPassword.ejs", { errors: "" });
});

app.post("/forgot-password", (req, res) => {
    const email = req.body.email;
    connection.query(
        "SELECT * FROM user WHERE email = ?", [email],
        (error, results) => {
            if (results.length > 0) {
                console.log(results);
                mailOptions.to = results[0].email;
                mailOptions.text = `http://localhost:3000/change-password/${results[0].username}`;
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) throw err;
                    console.log("Email sent: " + info.response);
                });
                res.redirect("/email-verification-success");
            } else {
                res.render("forgotPassword.ejs", {
                    errors: "Maaf Email yang Anda masukan tidak terdaftar",
                });
            }
        }
    );
});

app.get("/change-password/:username", (req, res) => {
    const username = req.params.username;
    connection.query(
        "SELECT * FROM user WHERE username = ?", [username],
        (error, results) => {
            if (results.length > 0) {
                req.session.username = username;
                res.render("changePassword.ejs", { username: username, errors: "" });
            } else {
                res.render("errorPageNotFound.ejs");
            }
        }
    );
});

app.post("/change-password/:username", (req, res) => {
    const username = req.params.username;
    const newPassword = req.body.password;
    const confirmNewpassword = req.body.confirmPassword;
    if (newPassword === confirmNewpassword) {
        bcrypt.hash(newPassword, 10, (error, hash) => {
            connection.query(
                "UPDATE user SET password = ? WHERE username = ?", [hash, username],
                (error, results) => {
                    req.session.username = username;
                    res.redirect("/password-change-successfull");
                }
            );
        });
    } else {
        res.render("changePassword.ejs", {
            errors: "Password yang Anda masukan tidak sama",
        });
    }
});

app.get("/profile-mentor-konselor", (req, res) => {
    res.render("profile.ejs");
});

app.get("/pesan-jadwal/:id", (req, res) => {
    res.render("pesanJadwal.ejs", { id: req.params.id, errors: "" });
});

app.post("/pesan-jadwal/:id", (req, res) => {
    const id = req.params.id;
    const email = req.body.email;
    connection.query(
        "SELECT * FROM user WHERE email = ?", [email],
        (error, results) => {
            if (results.length > 0) {
                let username = results[0].username;
                let hari = parseInt(req.body.hari);
                let jam = req.body.jam;

                ls("hari", hari);
                ls("jam", jam);

                res.redirect(`/password-verification/${id}/${username}`);
            } else {
                res.render("pesanJadwal.ejs", {
                    id: id,
                    errors: "Email yang Anda masukan tidak terdaftar"
                });
            }
        }
    );
});

app.get("/mentoring", (req, res) => {
    res.render("mentoring.ejs");
});

app.get("/konseling", (req, res) => {
    res.render("konseling.ejs");
});

app.get("/cek-jadwal", (req, res) => {
    res.render("cekjadwal.ejs");
});

app.get("/email-verification-success", (req, res) => {
    res.render("askToCheckEmail.ejs");
});

app.get("/password-change-successfull", (req, res) => {
    res.render("alertPassChangeSuccess.ejs");
});

app.get("/full-schedule", (req, res) => {
    res.render("alertFullSchedule.ejs");
});

app.get("/password-verification/:id/:username", (req, res) => {
    res.render("passwordVerification.ejs", {
        username: req.params.username,
        id: req.params.id,
        errors: ""
    });
});

app.post("/password-verification/:id/:username", (req, res) => {
    const id = req.params.id;
    const username = req.params.username;
    const hari = ls("hari");
    const jam = ls("jam");
    connection.query(
        "SELECT * FROM user WHERE username = ?", [username],
        (error, results) => {
            const plain = req.body.password;
            const hash = results[0].password;
            bcrypt.compare(plain, hash, (error, isEqual) => {
                if (isEqual) {
                    switch (id) {
                        case "1":
                            saveDateMeeting(username, "Valentino Subagjo", hari, jam, 1);
                            break;
                        case "2":
                            saveDateMeeting(username, "Brad Blunder Roam", hari, jam, 1);
                            break;
                        case "3":
                            saveDateMeeting(username, "Ucup Van Hellsing", hari, jam, 1);
                            break;
                        case "4":
                            saveDateMeeting(username, "Valentino Subagjo", hari, jam, 2);
                            break;
                        case "5":
                            saveDateMeeting(username, "Brad Blunder Roam", hari, jam, 2);
                            break;
                        default:
                            saveDateMeeting(username, "Ucup Van Hellsing", hari, jam, 2);
                    }
                    res.redirect('/status-pending');
                } else {
                    res.render("passwordVerification.ejs", {
                        username: username,
                        id: id,
                        errors: "Kata Sandi yang Anda masukan salah"
                    });
                }
            });
        }
    );
});

app.get("/status-pending", (req, res) => {
    res.render("alertOrderPending.ejs");
});

app.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        res.redirect("/");
    });
});

// Testing
app.get("/passwordVerification", (req, res) => {
    res.render("passwordVerification.ejs");
});

app.get("/pilihJadwal", (req, res) => {
    res.render("pilihJadwal.ejs");
});

app.get("/orderDetail", (req, res) => {
    res.render("orderDetail.ejs");
});

app.get("/adminPageMentoring", (req, res) => {
    res.render("adminMentoringPage.ejs");
});

// port yang digunakan
app.listen(3000, () => {
    console.log("App listening on port 3000");
});