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