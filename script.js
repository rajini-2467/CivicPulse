// ================================
// CIVICPULSE INTERACTIONS
// ================================


// ---------- REPORT BUTTON ----------

function showReport() {
    document.getElementById("report").scrollIntoView({
        behavior: "smooth"
    });
}


// ---------- MAP BUTTON ----------

function scrollToMap() {
    document.getElementById("map").scrollIntoView({
        behavior: "smooth"
    });
}


// ---------- CATEGORY SELECTION ----------

function selectCategory(category) {

    const reportSection = document.getElementById("report");
    const categorySelect = document.getElementById("issueCategory");

    reportSection.scrollIntoView({
        behavior: "smooth"
    });

    // Select matching category
    const options = categorySelect.options;

    for (let i = 0; i < options.length; i++) {

        if (
            options[i].text
                .toLowerCase()
                .includes(category.toLowerCase())
        ) {
            categorySelect.selectedIndex = i;
            break;
        }
    }
}


// ---------- GET LOCATION ----------

function getLocation() {
    alert("getLocation function is working!");

    if (!navigator.geolocation) {
        alert("Location services are not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            alert(
                "📍 Location captured successfully!\n\n" +
                "Latitude: " + latitude.toFixed(5) +
                "\nLongitude: " + longitude.toFixed(5)
            );
        },

        function() {
            alert(
                "Unable to get your location.\n" +
                "Please allow location access in your browser."
            );
        }
    );
}


// ---------- SUBMIT REPORT ----------

function submitReport() {

    const category =
        document.getElementById("issueCategory").value;

    const description =
        document.querySelector(".report-box textarea").value.trim();


    // Check category
    if (category === "Select a category") {

        alert("⚠️ Please select an issue category.");

        return;
    }


    // Check description
    if (description === "") {

        alert("⚠️ Please describe the issue.");

        return;
    }


    // Generate a simple report ID
    const reportNumber =
        Math.floor(1000 + Math.random() * 9000);

    const reportId =
        "CP-" + reportNumber;


    alert(
        "✅ Report submitted successfully!\n\n" +
        "Report ID: " + reportId +
        "\nCategory: " + category +
        "\n\nThank you for helping your community! 🌍"
    );


    // Clear description
    document.querySelector(".report-box textarea").value = "";

    // Reset category
    document.getElementById("issueCategory").selectedIndex = 0;
}


// ---------- COMMUNITY VERIFICATION ----------

const verificationButtons =
    document.querySelectorAll(".verification-options button");


verificationButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const selected = button.innerText;

        alert(
            "Thank you for your feedback! 🛡️\n\n" +
            "You selected: " + selected
        );

    }); //
});
// ---------- PHOTO UPLOAD ----------

const photoInput = document.getElementById("issuePhoto");
const photoName = document.getElementById("photoName");

if (photoInput) {
    photoInput.addEventListener("change", function () {

        if (photoInput.files.length > 0) {
            const file = photoInput.files[0];

            photoName.innerText =
                "📷 Selected: " + file.name;
        }

    });
}


