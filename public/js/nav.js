document.addEventListener("DOMContentLoaded", async function () {
  const serviceList = document.getElementById("service-list");

  try {
    const response = await fetch("/api/services"); // Adjust URL dynamically
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();

    if (Array.isArray(data)) {
      serviceList.innerHTML = ""; // Clear previous content

      data.forEach(({ name, slug }) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");

        const link = document.createElement("a");
        link.style.display = 'block';
        link.href = `/services/${slug}`; // Updated service URL pattern
        link.textContent = name;

        listItem.appendChild(link);
        serviceList.appendChild(listItem);
      });
    } else {
      serviceList.innerHTML = `<li class="list-group-item">No services available</li>`;
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    serviceList.innerHTML = `<li class="list-group-item text-danger">Failed to load services</li>`;
  }
});


document.addEventListener("DOMContentLoaded", function () {
    // Get the current URL path
    let currentPath = window.location.pathname;

    // Get all nav links
    let navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    // Loop through links and check which one matches the current URL
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});

$(document).ready(function () {
    // Show the list when the input is focused
    $('#search-input').on('focus', function () {
      $('#filter-list').fadeIn();
    });

    // Filter the list as the user types
    $('#search-input').on('input', function () {
      let query = $(this).val().toLowerCase();
      $('#service-list li').filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(query) > -1);
      });
    });

    // Hide the list when clicking outside
    $(document).on('click', function (e) {
      if (!$(e.target).closest('#search-input, #filter-list').length) {
        $('#filter-list').fadeOut();
      }
    });
  });