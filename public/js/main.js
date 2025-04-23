
(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 90) {
            $('.nav-bar').addClass('sticky-top shadow');
        } else {
            $('.nav-bar').removeClass('sticky-top shadow');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Date and time picker
    $('.date').datetimepicker({
        format: 'L'
    });
    $('.time').datetimepicker({
        format: 'LT'
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Service carousel
    $(".service-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 25,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:2
            },
            1200:{
                items:3
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);




// show services 

async function fetchServices(){

    const res = await fetch("http://localhost:8000/services");
    const data = await res.json();
    const selectEle = document.getElementById('servicesSelect');

    selectEle.innerHTML = `<option selected disabled>Select A Service</option>`;

    data.forEach((service)=>{

        
        const option = document.createElement("option");
        option.value = service.name;
        option.textContent = service.name;
        selectEle.appendChild(option)
    })

    try {
        
    } catch (error) {
        console.error("Error fetching services:", error);
    }


   
}

fetchServices();






const user = JSON.parse(localStorage.getItem("user"));
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const userDropdown = document.getElementById("userDropdown");
const usernameDisplay = document.getElementById("username");

if (user) {
  // Hide login and signup buttons
  loginBtn.style.display = "none";
  signupBtn.style.display = "none";

  // Show the username and logout button
  userDropdown.classList.remove("d-none");
  usernameDisplay.innerText = user.name; // Display the logged-in user's name
}

function showToast(message, type = "success") {
    Toastify({
      text: message,
      duration: 5000,
      gravity: "top",
      position: "right", 
      backgroundColor: type === "success" ? "green" : "red",
    }).showToast();
  }

  if (localStorage.getItem("loginToast") === "loginSuccess") {
    showToast("Logined Successfully", "success");
    localStorage.removeItem("loginToast");
  }else if(localStorage.getItem("signupToast") === "signupSuccess"){
    showToast("Registerd Successfully", "success");
    localStorage.removeItem("signupToast");
  }







  const API_URL = "http://localhost:8000/reviews";
const LOGIN_PAGE = "http://localhost:8000/login"; // Update this to your actual login page

const stars = document.querySelectorAll(".star");
const reviewText = document.getElementById("reviewText");
const submitReview = document.getElementById("submitReview");
const reviewsContainer = document.getElementById("reviewsContainer");

let selectedRating = 0;

// Function to check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem("user") !== null; // Check if token exists (Assuming JWT authentication)
}

// Redirect to login if not logged in
function redirectToLogin() {
    alert("You must be logged in to submit a review!");
    window.location.href = LOGIN_PAGE;
}

// Handle star click
stars.forEach(star => {
    star.addEventListener("click", () => {
        selectedRating = star.getAttribute("data-value");
        updateStars(selectedRating);
    });
});

// Update star styles
function updateStars(rating) {
    stars.forEach(star => {
        star.classList.remove("active");
        if (star.getAttribute("data-value") <= rating) {
            star.classList.add("active");
        }
    });
}

// Fetch and display reviews
async function loadReviews() {
    try {
        const response = await fetch(API_URL);
        const reviews = await response.json();

        // Filter only approved reviews
        const approvedReviews = reviews.filter(r => r.status === "approved");

        reviewsContainer.innerHTML = approvedReviews.length
            ? approvedReviews.map(r => 
                `<div class="review">
                    <div class="text"><strong>Name:</strong> ${r.name}</div>
                    <div class="rating">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
                    <div class="text"><strong>Review:</strong> ${r.text}</div>
                </div>`
            ).join("")
            : "No approved reviews available.";
    } catch (error) {
        console.error("Error fetching reviews:", error);
    }
}

// Handle review submission
submitReview.addEventListener("click", async () => {
    if (!isUserLoggedIn()) {
        redirectToLogin();
        return;
    }

    const text = reviewText.value.trim();
    if (!selectedRating || !text) {
        alert("Please provide a rating and review!");
        return;
    }

    try {
        // Get user info from localStorage
        const user = JSON.parse(localStorage.getItem("user")); // Ensure stored as JSON
        if (!user || !user.name || !user.email) {
            alert("User information is missing. Please log in again.");
            redirectToLogin();
            return;
        }

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("userToken")}` // Assuming token is stored separately
            },
            body: JSON.stringify({ 
                name: user.name, 
                email: user.email, 
                rating: selectedRating, 
                text 
            })
        });

        if (!response.ok) throw new Error("Failed to submit review");

        reviewText.value = "";
        updateStars(0);
        selectedRating = 0;
        loadReviews();
    } catch (error) {
        console.error("Error submitting review:", error);
    }
});

// Load reviews on page load
loadReviews();
