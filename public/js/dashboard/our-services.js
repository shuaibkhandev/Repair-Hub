const apiUrl = "http://localhost:8000/services"; // Replace with your API URL

async function fetchServices() {
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    const tableBody = document.getElementById("serviceTableBody");
    tableBody.innerHTML = ""; // Clear table before adding new rows

    data.forEach((service, id) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${id+1}</td>
        <td><input type="text" value="${service.name}" id="service-${service._id}" /></td>
        <td>
          <button class="update-btn" data-id="${service._id}">Update</button>
          <button class="delete-btn" data-id="${service._id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
      // Attach event listeners after elements are created
      document.querySelectorAll(".update-btn").forEach(btn => {
          btn.addEventListener("click", function() {
          
              updateService(this.getAttribute("data-id"));
          });
      });

      document.querySelectorAll(".delete-btn").forEach(btn => {
          btn.addEventListener("click", function() {
              deleteService(this.getAttribute("data-id"));
          });
      });
  } catch (error) {
    console.error("Error fetching services:", error);
  }
}

async function addService() {
  const serviceName = document.getElementById("newServiceName").value;
  if (!serviceName) {
    alert("Please enter a service name!");
    return;
  }

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: serviceName })
    });

    if (res.ok) {
      document.getElementById("newServiceName").value = "";
      fetchServices(); // Refresh the list
    }
  } catch (error) {
    console.error("Error adding service:", error);
  }
}

async function updateService(id) {
  const newName = document.getElementById(`service-${id}`).value;
  console.log(newName)

  try {
    const res = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName })
    });

    if (res.ok) {
      alert("Service updated!");
      fetchServices();
    }
  } catch (error) {
    console.error("Error updating service:", error);
  }
}

async function deleteService(id) {
  if (!confirm("Are you sure you want to delete this service?")) return;

  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });

    if (res.ok) {
      fetchServices(); // Refresh the list
    }
  } catch (error) {
    console.error("Error deleting service:", error);
  }
}

document.getElementById("addServiceBtn").addEventListener("click", () => {
  document.getElementById("addServiceForm").style.display = "block";
});

// Fetch services on page load
fetchServices();