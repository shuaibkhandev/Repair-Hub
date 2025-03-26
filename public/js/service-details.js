document.addEventListener("DOMContentLoaded", async function () {
    const serviceDetailsContainer = document.querySelector(".service-details .container");
    const headerTitle = document.querySelector(".page-header h1");
    const breadcrumbItems = document.querySelectorAll(".breadcrumb-item");
    const serviceCarousel = document.querySelector(".service-carousel"); // Select the carousel

    // Get the slug from the URL
    const slug = window.location.pathname.split("/").pop();

    try {
        // Fetch service details
        const response = await fetch(`/api/services/${slug}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const service = await response.json();
        

        // Update page header title
        headerTitle.textContent = service.name;

        // Update breadcrumb navigation
        breadcrumbItems[2].textContent = service.name;
        // Populate the page with service details
        serviceDetailsContainer.innerHTML = `
            <h1>${service.name}</h1>
            <p>${service.description}</p>
        `;


        // Check if the service has sub-services
        if (service.services && service.services.length > 0) {
            // Destroy existing Owl Carousel instance if initialized before
            if ($(".service-carousel").hasClass("owl-loaded")) {
                $(".service-carousel").trigger("destroy.owl.carousel").removeClass("owl-loaded");
                $(".service-carousel").html(""); // Clear old items
            }

            // Populate service carousel with sub-services
            serviceCarousel.innerHTML = service.services.map(subService => `
                <div class="item bg-light p-4">
                    <div class="d-flex align-items-center justify-content-center border border-5 border-white mb-4" style="width: 75px; height: 75px;">
                        <i class="${subService.icon} fa-2x text-primary"></i>
                    </div>
                    <h4 class="mb-3">${subService.name}</h4>
                    <p>${subService.description}</p>
                  
                    <a href="/dashboard/sub-service/${subService._id}" class="btn bg-white text-primary w-100 mt-2">
                        Book Now <i class="fa fa-arrow-right text-secondary ms-2"></i>
                    </a>
                </div>
            `).join("");

            // Wait for elements to be added to the DOM before initializing Owl Carousel
            setTimeout(() => {
                $(".service-carousel").owlCarousel({
                    loop: true,
                    margin: 20,
                    nav: true,
                    dots: true,
                    autoplay: true,
                    autoplayTimeout: 3000,
                    responsive: {
                        0: { items: 1 },
                        768: { items: 2 },
                        992: { items: 3 }
                    }
                });
            }, 100);
        } else {
            serviceCarousel.innerHTML = "<p class='text-muted'>No sub-services available.</p>";
        }

    } catch (error) {
        console.error("Error fetching service details:", error);
        serviceDetailsContainer.innerHTML = `<p class="text-danger">Failed to load service details</p>`;
    }
});
