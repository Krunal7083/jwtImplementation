async function registerUser(event) {
  event.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
    role: "USER" // ✅ FIX (no DOM dependency)
  };

  const response = await fetch("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json().catch(() => ({}));

  document.getElementById("message").innerText =
    result.message || "Registration completed";

  if (response.ok) {
    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1000);
  }
}


async function loginUser(event) {
  event.preventDefault();
  const formId = event.currentTarget ? event.currentTarget.id : "";
  const roleInput = document.getElementById("role");
  const roleValue = roleInput ? roleInput.value : "";
  const role = formId === "adminLoginForm" ? "ADMIN" : (roleValue || "USER");

  const data = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
    role: role
  };

  const response = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    document.getElementById("message").innerText =
      result.message || "Login failed. Check username/password.";
    return;
  }

  console.log(result); // ✅ debug

  localStorage.setItem("token", result.token);
  localStorage.setItem("username", result.username);
  localStorage.setItem("role", result.role);

  // ✅ correct redirect
  if (result.role === "ADMIN") {
    window.location.href = "/admin-home.html";
  } else {
    window.location.href = "/customer-home.html";
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const adminLoginForm = document.getElementById("adminLoginForm");

  if (signupForm) {
    signupForm.addEventListener("submit", registerUser);
  }

  if (loginForm) {
    loginForm.addEventListener("submit", loginUser);
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", loginUser);
  }
});