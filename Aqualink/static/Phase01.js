function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function hideLogin() {
    document.getElementById('loginModal').style.display = 'none';
}

function toggleLoginType() {
    const customerLogin = document.getElementById('customerLogin');
    const supplierLogin = document.getElementById('supplierLogin');
    const toggleToSupplier = document.getElementById('toggleToSupplier');
    const toggleToCustomer = document.getElementById('toggleToCustomer');

    if (customerLogin.style.display === 'none') {
        customerLogin.style.display = 'block';
        supplierLogin.style.display = 'none';
        toggleToSupplier.style.display = 'inline-block';
        toggleToCustomer.style.display = 'none';
    } else {
        customerLogin.style.display = 'none';
        supplierLogin.style.display = 'block';
        toggleToSupplier.style.display = 'none';
        toggleToCustomer.style.display = 'inline-block';
    }
}

function toggleToRegister() {
    document.getElementById('customerLogin').style.display = 'none';
    document.getElementById('supplierLogin').style.display = 'none';
    document.getElementById('registrationSection').style.display = 'block';
    document.getElementById('toggleToRegister').style.display = 'none';
    document.getElementById('toggleToLogin').style.display = 'inline-block';
    document.getElementById('toggleToSupplier').style.display = 'none';
    document.getElementById('toggleToCustomer').style.display = 'none';
}

function toggleToLogin() {
    document.getElementById('registrationSection').style.display = 'none';
    document.getElementById('customerLogin').style.display = 'block';
    document.getElementById('toggleToRegister').style.display = 'inline-block';
    document.getElementById('toggleToLogin').style.display = 'none';
    document.getElementById('toggleToSupplier').style.display = 'inline-block';
}

function registerUser(event) {
    event.preventDefault(); // Prevents the form from submitting traditionally
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const accountType = document.getElementById('accountType').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, accountType })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            hideLogin();
        } else {
            alert("Registration failed. Please try again.");
        }
    })
    .catch(error => console.error('Error:', error));
}



// Redirect to customer homepage after login
function redirectToCustomerHome(event) {
    event.preventDefault(); // Prevents the form from submitting traditionally
    const username = document.getElementById('customerUsername').value;
    const password = document.getElementById('customerPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, user_type: 'customers' })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
         //   alert(JSON.stringify(response.json()))
         //   hideLogin();
            //alert(JSON.stringify(response.message))
        //  window.location.href = "C:\\Users\\sangi\\OneDrive\\Desktop\\my_code\\Aqualink\\static\\customerhome.html"; // Redirect to customer home page // Redirect to customer home page
        } else {
            alert("Invalid credentials. Please try again.");
        }
    }).
    then(data=>{
        alert(data.message);
        hideLogin();
    })
    .catch(error => console.error('Error:', error));
}

// Redirect to supplier homepage after login
function redirectToSupplierHome(event) {
    event.preventDefault(); // Prevents the form from submitting traditionally
    const username = document.getElementById('supplierUsername').value;
    const password = document.getElementById('supplierPassword').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, user_type: 'suppliers' })
    })
    .then(response => {
        if (response.ok) {
            window.location.href = "/supplierhome"; // Redirect to supplier home page
        } else {
            alert("Invalid credentials. Please try again.");
        }
    })
    .catch(error => console.error('Error:', error));
}

// Example: This function is useful when users attempt to access restricted areas without logging in
function checkLoginStatus() {
    if (!sessionStorage.getItem("loggedIn")) {
        showLogin();
    }
}


// Initialize login check
document.addEventListener("DOMContentLoaded", checkLoginStatus);
