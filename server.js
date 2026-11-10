const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let donations = [];

app.post("/donate", (req, res) => {
    const { name, food, quantity, location, phone, foodType } = req.body;

    if (!name || !food || !quantity || !location || !phone || !foodType) {
        return res.status(400).json({
            message: "Please fill all fields!"
        });
    }

    const donation = {
        id: Date.now(),
        name,
        food,
        quantity: Number(quantity),
        location,
        phone,
        foodType
    };

    donations.push(donation);

    res.json({
        message: "Your food donation was added successfully!",
        donation
    });
});

app.get("/donations", (req, res) => {
    res.json(donations);
});

app.get("/stats", (req, res) => {
    res.json({
        totalDonations: donations.length,
        totalMeals: donations.reduce((sum, item) => sum + item.quantity, 0)
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});