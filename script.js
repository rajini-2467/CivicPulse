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
 // ⭐ AI CLASSIFICATION + SMART PRIORITY
    // PASTE THE NEW CODE HERE
    // AI CLASSIFICATION + SMART PRIORITY
let aiCategory = category;
let priority = "Medium";
let department = "Municipality";

const text = description.toLowerCase();

if (
    text.includes("pothole") ||
    text.includes("road") ||
    text.includes("street")
) {
    aiCategory = "Roads & Potholes";
    department = "Roads Department";
}

if (
    text.includes("garbage") ||
    text.includes("waste") ||
    text.includes("dump")
) {
    aiCategory = "Waste Management";
    department = "Sanitation Department";
}

if (
    text.includes("water") ||
    text.includes("leak") ||
    text.includes("pipe")
) {
    aiCategory = "Water Supply";
    department = "Water Department";
}

// Smart priority
if (
    text.includes("accident") ||
    text.includes("danger") ||
    text.includes("blocked") ||
    text.includes("overflow")
) {
    priority = "High";
} else if (
    text.includes("broken") ||
    text.includes("damaged") ||
    text.includes("problem")
) {
    priority = "Medium";
} else {
    priority = "Low";
}

    // Generate a simple report ID
    const reportNumber =
        Math.floor(1000 + Math.random() * 9000);

    const reportId =
        "CP-" + reportNumber;
        // Save report in browser
const report = {
    id: reportId,
    category: category,
    priority: priority,
department: department,
    description: description,
    status: "Submitted",
    date: new Date().toLocaleString()
};

const reports = JSON.parse(localStorage.getItem("civicReports")) || [];

reports.push(report);

localStorage.setItem("civicReports", JSON.stringify(reports));
// Add civic points
let civicPoints = Number(localStorage.getItem("civicPoints")) || 0;

civicPoints += 10;

localStorage.setItem("civicPoints", civicPoints);
updateCivicPointsDisplay();

    alert(
        
    "✅ Report submitted successfully!\n\n" +
    "Report ID: " + reportId +
    "\nCategory: " + aiCategory +
    "\nPriority: " + priority +
    "\nDepartment: " + department +
    "\n\nThank you for helping your community! 🌐"
);


    // Clear description
    document.querySelector(".report-box textarea").value = "";

    // Reset category
    document.getElementById("issueCategory").selectedIndex = 0;
}

// ---------- COMMUNITY RESOLUTION VERIFICATION ----------

const verificationButtons =
    document.querySelectorAll(".verification-options button");

verificationButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const selected = button.innerText;
        let confidence = 87;

        if (selected.includes("Partially")) {
    confidence = 70;
} else if (selected.includes("Fixed")) {
    confidence = 95;

        } else if (selected.includes("Still")) {
            confidence = 30;
        }

        localStorage.setItem("resolutionConfidence", confidence);

        const confidenceText =
    document.getElementById("confidenceValue");

        if (confidenceText) {
    confidenceText.innerText = confidence + "%";
}

const confidenceBar = document.querySelector(".confidence-bar > div");
if (confidenceBar) {
    confidenceBar.style.width = confidence + "%";

        }

        alert(
            "✅ Thank you for your feedback!\n\n" +
            "You selected: " + selected +
            "\n\nCommunity Resolution Confidence: " +
            confidence + "%"
        );

    });

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

// ----------- RECENT REPORTS -----------

function displayRecentReports() {
    const reportsList = document.getElementById("reportsList");

    if (!reportsList) return;

    const reports = JSON.parse(localStorage.getItem("civicReports")) || [];

    if (reports.length === 0) {
        reportsList.innerHTML = "<p>No reports yet.</p>";
        return;
    }

    reportsList.innerHTML = "";

    reports.slice().reverse().slice(0, 5).forEach(function(report) {
        const reportItem = document.createElement("div");

        reportItem.innerHTML = `
            <strong>${report.id}</strong>
            <span>${report.category}</span>
            <p>${report.description}</p>
            <small>Priority: ${report.priority || "Medium"}</small>
    <small>Department: ${report.department || "Municipality"}</small>
        `;

        reportsList.appendChild(reportItem);
    });
}

displayRecentReports();
// ---------- CIVIC POINTS DISPLAY ----------

function updateCivicPointsDisplay() {

    const pointsDisplay =
        document.getElementById("civicPointsDisplay");

    const impactDisplay =
        document.getElementById("civicImpactDisplay");

    const points =
        Number(localStorage.getItem("civicPoints")) || 0;

    if (pointsDisplay) {
        pointsDisplay.innerText =
            points.toLocaleString();
    }

    if (impactDisplay) {
        impactDisplay.innerText =
            points.toLocaleString();
    }
}
updateCivicPointsDisplay();
// ---------- LOGIN / SIGN UP ----------

function showLogin() {
    document.getElementById("loginModal").style.display = "flex";

    document.getElementById("loginTitle").innerText =
        "Welcome to CivicPulse 🌐";

    document.getElementById("loginSubtitle").innerText =
        "Sign in to continue";

    document.getElementById("nameField").style.display = "none";

    document.querySelector(".login-submit").innerText =
        "Sign In";

    document.querySelector(".switch-login").innerHTML =
        `Don't have an account? <span onclick="showSignup()">Sign Up</span>`;
}

function showSignup() {
    document.getElementById("loginModal").style.display = "flex";

    document.getElementById("loginTitle").innerText =
        "Join CivicPulse 🌐";

    document.getElementById("loginSubtitle").innerText =
        "Create your account";

    document.getElementById("nameField").style.display = "block";

    document.querySelector(".login-submit").innerText =
        "Create Account";

    document.querySelector(".switch-login").innerHTML =
        `Already have an account? <span onclick="showLogin()">Sign In</span>`;
}

function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}

function handleLogin() {

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") {
        alert("Please enter your email and password.");
        return;
    }

    alert("✅ Welcome to CivicPulse!");
    closeLogin();
}