const form = document.getElementById("donationForm");
const message = document.getElementById("message");
const donationList = document.getElementById("donationList");

// SUBMIT DONATION

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const donation = {
        name: document.getElementById("name").value.trim(),
        food: document.getElementById("food").value.trim(),
        quantity: document.getElementById("quantity").value,
        location: document.getElementById("location").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        foodType: document.getElementById("foodType").value
    };

    try {

        const response = await fetch("/donate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(donation)

        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        message.style.color = "green";
        message.textContent = "🎉 " + result.message;

        form.reset();

        loadDonations();

    } catch(error) {

        message.style.color = "red";
        message.textContent = error.message || "Something went wrong!";

    }

});


// LOAD DONATIONS

async function loadDonations() {

    try {

        const response = await fetch("/donations");

        if (!response.ok) {
            throw new Error("Unable to load donations");
        }

        const donations = await response.json();

        donationList.innerHTML = "";

        if (donations.length === 0) {

            donationList.innerHTML = `
                <p class="empty-message">
                    🌱 No food donations yet. Be the first to donate!
                </p>
            `;

        }

        donations.forEach(item => {

            const card = document.createElement("div");

            card.className = "donation-card";

            const icon = document.createElement("div");
            icon.className = "food-icon";

            const iconElement = document.createElement("i");
            iconElement.className = "fa-solid fa-bowl-food";
            icon.appendChild(iconElement);

            const title = document.createElement("h3");
            title.textContent = item.food;

            card.appendChild(icon);
            card.appendChild(title);

            const details = [
                ["fa-user", `Donor: ${item.name}`],
                ["fa-utensils", `Quantity: ${item.quantity} meals`],
                ["fa-location-dot", `Location: ${item.location}`],
                ["fa-leaf", `Category: ${item.foodType}`],
                ["fa-phone", `Contact: ${item.phone}`]
            ];

            details.forEach(([iconClass, text]) => {

                const p = document.createElement("p");

                const i = document.createElement("i");
                i.className = `fa-solid ${iconClass}`;

                p.appendChild(i);
                p.appendChild(document.createTextNode(text));

                card.appendChild(p);

            });

            donationList.appendChild(card);

        });

        updateStats(donations);

    } catch(error) {

        donationList.innerHTML = `
            <p class="empty-message">
                Unable to load donations. Please try again.
            </p>
        `;

    }

}


// UPDATE STATISTICS

function updateStats(donations) {

    const totalDonations = donations.length;

    const totalMeals = donations.reduce(
        (total, item) => total + Number(item.quantity),
        0
    );

    document.getElementById("heroMeals").textContent = totalMeals;

    document.getElementById("heroDonations").textContent = totalDonations;

}


// INITIAL PAGE LOAD

loadDonations();