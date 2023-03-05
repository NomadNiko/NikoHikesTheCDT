const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(loginForm);
  const businessName = formData.get('business-name');
  const businessPassword = formData.get('business-password');
  
  const data = {
    businessName,
    businessPassword
  };
  
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Redirect to dashboard or homepage
  })
  .catch(error => console.error(error));
});

// Handle signup form submission
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(signupForm);
  const businessName = formData.get('business-name');
  const businessPassword = formData.get('business-password');
  const businessAddress = formData.get('business-address');
  const businessDescription = formData.get('business-description');
  
  const data = {
    businessName,
    businessPassword,
    businessAddress,
    businessDescription
  };
  
  fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Redirect to dashboard or homepage
  })
  .catch(error => console.error(error));
});
