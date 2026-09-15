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
            localStorage.setItem(
    "lastLocation",
    JSON.stringify({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    })
);

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

async function submitReport() {

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
    const savedLocation =
       JSON.parse(localStorage.getItem("lastLocation")) || {};
    const photoInput =
       document.getElementById("issuePhoto");

let photoData = null;

if (
    photoInput &&
    photoInput.files &&
    photoInput.files.length > 0
) {
    photoData =
        await readPhotoAsDataURL(
            photoInput.files[0]
        );
}

    const latitude =
       savedLocation.latitude || null;

    const longitude =
       savedLocation.longitude || null;  
        // Save report in browser

    const report = {
    id: reportId,
    category: category,
    priority: priority,
    department: department,
    description: description,

    latitude: latitude,
    longitude: longitude,
    photo: photoData,
    status: "Submitted",
    date: new Date().toLocaleString()
};

const reports = JSON.parse(localStorage.getItem("civicReports")) || [];
// Check for duplicate complaints
const duplicates = findDuplicateReports(report, reports);

if (duplicates.length > 0) {
    report.status = "Possible Duplicate";
    report.duplicateCount = duplicates.length;
    report.duplicateOf = duplicates[0].id;
} else {
    report.duplicateCount = 0;
}

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

    ${
        report.photo
            ? `
                <img
                    src="${report.photo}"
                    alt="Uploaded issue photo"
                    style="
                        width: 220px;
                        height: 160px;
                        object-fit: cover;
                        border-radius: 10px;
                        margin: 10px 0;
                        cursor: pointer;
                    "
                    onclick="window.open(this.src, '_blank')"
                >
            `
            : ""
    }

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
// ================= CIVICPULSE POINTS =================

function getCivicPoints() {
    return Number(localStorage.getItem("civicPoints")) || 0;
}

function setCivicPoints(points) {
    localStorage.setItem(
        "civicPoints",
        Math.max(0, Math.round(points))
    );

    updateCivicPointsDisplay();
}

function updateCivicPointsDisplay() {

    const points = getCivicPoints();

    const pointsDisplay =
        document.getElementById("civicPointsDisplay");

    const impactDisplay =
        document.getElementById("civicImpactDisplay");

    if (pointsDisplay) {
        pointsDisplay.textContent = points;
    }

    if (impactDisplay) {
        impactDisplay.textContent = points;
    }
}

updateCivicPointsDisplay();
updateCivicPointsDisplay();

// ================= DUPLICATE COMPLAINT DETECTION =================

function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 2);
}

function textSimilarity(text1, text2) {

    const words1 = new Set(normalizeText(text1));
    const words2 = new Set(normalizeText(text2));

    if (words1.size === 0 || words2.size === 0) {
        return 0;
    }

    let commonWords = 0;

    words1.forEach(function(word) {
        if (words2.has(word)) {
            commonWords++;
        }
    });

    const totalWords =
        new Set([...words1, ...words2]).size;

    return commonWords / totalWords;
}
// ================= FIND DUPLICATE REPORTS =================

function findDuplicateReports(newReport, reports) {

    return reports.filter(function(report) {

        // Ignore false reports
        if (report.status === "False Report") {
            return false;
        }

        // Category must match
        if (report.category !== newReport.category) {
            return false;
        }

        // Location must be available
        if (
            !newReport.latitude ||
            !newReport.longitude ||
            !report.latitude ||
            !report.longitude
        ) {
            return false;
        }

        // Check location distance
        const distance = calculateDistance(
            newReport.latitude,
            newReport.longitude,
            report.latitude,
            report.longitude
        );

        // Same area: within 100 metres
        if (distance > 100) {
            return false;
        }

        // Complaint must also be similar
        const similarity = textSimilarity(
            newReport.description,
            report.description
        );

        // Same/very similar complaint + same location
        return similarity >= 0.45;
    });
}
// ================= LOCATION DISTANCE =================

function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371000; // Earth radius in metres

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}
// ================= PHOTO STORAGE =================

function readPhotoAsDataURL(file) {

    return new Promise(function(resolve, reject) {

        const reader = new FileReader();

        reader.onload = function() {
            resolve(reader.result);
        };

        reader.onerror = function() {
            reject(reader.error);
        };

        reader.readAsDataURL(file);
    });
}
// ================= PHOTO STORAGE =================

function readPhotoAsDataURL(file) {

    return new Promise(function(resolve, reject) {

        const reader = new FileReader();

        reader.onload = function() {
            resolve(reader.result);
        };

        reader.onerror = function() {
            reject(reader.error);
        };

        reader.readAsDataURL(file);
    });
}