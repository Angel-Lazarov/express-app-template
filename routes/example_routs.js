//-------------------------------------------------------
//----------------routs / endpoints----------------------
// Примерен route
app.get("/", (req, res) => {
    res.send("Hello from Express!")  // връща plain text
});

// POST endpint за Login
app.post("/login", (req, res) => {
    // const email = req.body.email;
    // const password = req.body.password;
    const { email, password } = req.body; // деструктурира боди обекта по стойности

    if (email === "test@test.com" && password === "1234") {
        res.json(
            {
                success: true,
                token: "fake-JWT-token"
            });
    } else {
        res.status(401).json(
            {
                success: false,
                message: "Invalit credentials"
            });
    }
});

// GET endpint връща информация
app.get("/recipes", (req, res) => {
    res.json(["pizza", "pasta", "salad"]); // връща масив
});

// POST endpoint (създава нови данни)
app.post("/recipes", (req, res) => {
    const { title } = req.body; // деструктуриране на body обекта
    res.json(
        {
            success: true,
            message: `Recipe ${title} created!`
        });
});

// PUT endpoint (актуализира данни)
app.put("/recipes/:id", (req, res) => {
    res.json(
        {
            success: true,
            message: `Recipe ${req.params.id} updated!`,
        }
    );
});

// DETELTE endpoint (изтрива данни)
app.delete("/decipes/:id", (req, res) => {
    req.json(
        {
            success: true,
            message: `Recipe ${req.params.id} deleted!`
        }
    );
});

app.get('/hello', (req, res) => {
    console.log(req.url); // показва URL на заявката в конзолата на сървъра
    res.send('Hello world'); // изпраща отговор
});


//-------------------------------------------------------