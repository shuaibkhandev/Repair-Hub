document.addEventListener("DOMContentLoaded", async function () {
    const serviceDetailsContainer = document.querySelector(".service-details .container");
    const headerTitle = document.querySelectorAll(".service-name");
    const breadcrumbItems = document.querySelectorAll(".breadcrumb-item");
    const serviceCarousel = document.querySelector(".service-carousel");
    const pageHeader = document.querySelector(".page-header");
    const slug = window.location.pathname.split("/").pop();

    try {
        const response = await fetch(`/api/services/${slug}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const service = await response.json();

        // Update title
        headerTitle.forEach(title => {
            title.textContent = service.name;
        });



        if (pageHeader && service.image) {
            let serviceImagePath = service.image;
            if (serviceImagePath.startsWith('uploads\\')) {
                serviceImagePath = serviceImagePath.replace('uploads\\', 'uploads/');
            }
            
            
            pageHeader.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('http://localhost:8000/" + serviceImagePath + "')";
            pageHeader.style.backgroundSize = 'cover';
            pageHeader.style.backgroundPosition = 'center';
        }

        // Update breadcrumb
        breadcrumbItems[2].textContent = service.name;

        // Description section
        serviceDetailsContainer.innerHTML = `
            <h1>${service.name}</h1>
            <p>${service.description}</p>
        `;

        // Sub-services carousel
        if (service.services && service.services.length > 0) {
            if ($(".service-carousel").hasClass("owl-loaded")) {
                $(".service-carousel").trigger("destroy.owl.carousel").removeClass("owl-loaded");
                $(".service-carousel").html("");
            }

            serviceCarousel.innerHTML = service.services.map(subService => `
                <div class="item bg-light p-4 text-center">
                    <div class=" m-auto mb-3 text-center " style="width:88px; height:88px; border-radius:50%">
                      <div class="service-icon flex-shrink-0">
                                <i class="${subService.icon || 'fa fa-cogs'} fa-2x"></i>
                            </div>
                    </div>
                    <h4 class="mb-2">${subService.name}</h4>
                    <p class="mb-2">${subService.description}</p>
                    <p class="text-muted"><i class="fa fa-clock"></i> ${subService.duration} | <strong>RS${subService.price}</strong></p>
                    <a href="/dashboard/sub-service/${subService._id}" class="btn bg-white text-primary w-100 mt-2">
                        Book Now <i class="fa fa-arrow-right text-secondary ms-2"></i>
                    </a>
                </div>
            `).join("");

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
