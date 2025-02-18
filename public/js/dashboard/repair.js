
// async function fetchBookings() {
//     try {
//       const response = await fetch("http://localhost:8000/bookings");
//       const bookings = await response.json();
  
//       const bookingList = document.getElementById("booking-list");
//       bookingList.innerHTML = ""; // Clear previous data
  
//       bookings.forEach((booking) => {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//           <td>${booking.serviceType}</td>
//           <td>${booking.name}</td>
//           <td>${booking.phone}</td>
//           <td class="status">${booking.status || "Pending"}</td>
//           <td>
//             <button class="details-btn" data-id="${booking._id}">Details</button>
//           </td>
//         `;
//         bookingList.appendChild(row);
//       });
  
//       document.querySelectorAll(".details-btn").forEach((btn) => {
//         btn.addEventListener("click", (e) => {
//           const bookingId = e.target.getAttribute("data-id");
//           showDetails(bookingId);
//         });
//       });
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//     }
//   }
  
//   async function showDetails(id) {
//     try {
//       const response = await fetch(`http://localhost:8000/booking/${id}`);
//       const booking = await response.json();
  
//       document.getElementById("modal-name").textContent = booking.name;
//       document.getElementById("modal-phone").textContent = booking.phone;
//       document.getElementById("modal-email").textContent = booking.email;
//       document.getElementById("modal-service").textContent = booking.serviceType;
//       document.getElementById("modal-request").textContent = booking.specialRequest || "N/A";
//       document.getElementById("modal-date").textContent = new Date(booking.serviceDate).toDateString();
//       document.getElementById("modal-location").textContent = booking.location;
  
//       document.getElementById("update-status-btn").setAttribute("data-id", id);
      
//       document.getElementById("details-modal").style.display = "block";
//     } catch (error) {
//       console.error("Error fetching details:", error);
//     }
//   }
  
//   document.getElementById("update-status-btn").addEventListener("click", async () => {
//     const bookingId = document.getElementById("update-status-btn").getAttribute("data-id");
//     const newStatus = document.getElementById("status").value;
  
//     try {
//       const response = await fetch(`http://localhost:8000/booking/${bookingId}/status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });
  
//       if (response.ok) {
//         alert("Status updated successfully");
//         document.getElementById("details-modal").style.display = "none";
//         fetchBookings(); // Refresh data
//       } else {
//         alert("Failed to update status");
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   });
  
//   document.querySelector(".close-btn").addEventListener("click", () => {
//     document.getElementById("details-modal").style.display = "none";
//   });
  
//   // Fetch data on page load
//   fetchBookings();
  
  