document.addEventListener("DOMContentLoaded", function () {

    const user = JSON.parse(localStorage.getItem("user"));
      
      if (user) {
        // Redirect to homepage or dashboard if user is already logged in
        window.location.href = "/";
      }
  
  
      const loginForm = document.getElementById("loginForm");
  
      if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
          event.preventDefault(); // Prevent default form submission
  
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;
  
          const response = await fetch("http://localhost:8000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
  
          const data = await response.json();
  
          if (data.success) {
            // Store user data in local storage
            localStorage.setItem("user", JSON.stringify(data.user));
            alert("Login successful!");
            
            window.location.href = "/"; // Redirect to dashboard
          } else {
            alert(data.error);
          }
        });
      }
    });