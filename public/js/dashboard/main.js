

// checking user isAdmin or not if not then redirect to website home page
const user = JSON.parse(localStorage.getItem("user"));

// Redirect non-admin users
if (!user && !user.isAdmin) {
window.location.href = "/";
}


const showProfile = () => {
    const user = document.getElementById("profile");
   user.classList.toggle("show");
   }
   
   document.addEventListener("click", (e) => {
    const user = document.getElementById("profile");
     const noti = document.getElementById("noti");
     const notiBtn = document.getElementById("showNoti")
    const profileBtn = document.getElementById("showProfile"); // If you have a button to toggle the profile
   
    // Check if the clicked element is NOT inside the user profile or the button
    if (!user.contains(e.target) && !profileBtn.contains(e.target)) {
        user.classList.remove("show");
    }
    if (!noti.contains(e.target) && !notiBtn.contains(e.target)) {
        noti.classList.remove("show");
    }
   });
   
   
   const showNoti = () => {
   const noti = document.getElementById("noti");
   noti.classList.toggle("show");
   }



   const searchBar = document.getElementById("searchBar");
const searchResultsDiv = document.getElementById("search-results");
const clearSearch = document.getElementById("clearSearch");
let bookingsData = [];

async function fetchBookings(){
try{
   const response = await fetch("http://localhost:8000/bookings");
     const bookings = await response.json();
 bookingsData = bookings;
 displayBookings(bookings)
}
catch(error){
     console.error("Error fetching bookings:", error);
}
}

function displayBookings(bookings) {
const bookingList = document.getElementById("booking-list");
bookingList.innerHTML = ""; // Clear previous data

bookings.forEach(booking => {
 const row = document.createElement("tr");
 row.innerHTML = `
   <td>${booking.serviceType}</td>
   <td>${booking.name}</td>
   <td>${booking.phone}</td>
   <td>${booking.location}</td>
   <td class="status">${booking.status || "Pending"}</td>
 `;
 bookingList.appendChild(row);
});
}

function searchBookings(query){
 if (query.trim() === "") {
 searchResultsDiv.style.display = "none"; // Hide when empty
  clearSearch.style.display = "none";
 return;
}

clearSearch.style.display = "block";
const filteredBookings = bookingsData.filter(booking=>
booking.serviceType.toLowerCase().includes(query.toLowerCase()) ||
 booking.name.toLowerCase().includes(query.toLowerCase()) ||
 booking.phone.includes(query) ||
 booking.location.toLowerCase().includes(query.toLowerCase())
)
if (filteredBookings .length === 0) {
 searchResultsDiv.innerHTML = "<p>No results found.</p>";
} else {
 const resultsHTML = filteredBookings
   .map(booking => `
     <div class="search-item">
       <p><strong>Service:</strong> ${booking.serviceType}</p>
       <p><strong>Name:</strong> ${booking.name}</p>
       <p><strong>Phone:</strong> ${booking.phone}</p>
       <p><strong>Location:</strong> ${booking.location}</p>
     </div>
   `)
   .join("");
   searchResultsDiv.innerHTML = resultsHTML;
}
searchResultsDiv.style.display = "block"
}

searchBar.addEventListener("input", (e)=>{
searchBookings(e.target.value);

})
clearSearch.addEventListener("click", () => {
searchBar.value = "";
searchResultsDiv.style.display = "none";
clearSearch.style.display = "none";
});

// Hide search results when clicking outside
document.addEventListener("click", (event) => {
if (!searchResultsDiv.contains(event.target) && !searchBar.contains(event.target)) {
 searchResultsDiv.style.display = "none";
}
});





// Function to fetch and display users
async function fetchUsers() {
    try {
     const response = await fetch("http://localhost:8000/api/auth/users");
     const users = await response.json();
    
     const tableBody = document.getElementById("users-list");
     tableBody.innerHTML = ""; // Clear existing rows
    
     users.forEach(user => {
       const row = document.createElement("tr");
       row.innerHTML = `
         <td>${user.name}</td>
         <td>${user.email}</td>
         <td>${user.phone || "N/A"}</td>
       `;
       tableBody.appendChild(row);
     });
    } catch (error) {
     console.error("Error fetching users:", error);
    }
    }


    // Fetch data when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    fetchBookings();
    fetchUsers();
    });
    