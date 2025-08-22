/**
 * Login form functionality handler
 */
export function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const togglePasswordButton = document.getElementById('togglePassword');
  const eyeIcon = togglePasswordButton.querySelector('.eye-icon');
  
  // Error message elements
  const usernameError = document.getElementById('username-error');
  const passwordError = document.getElementById('password-error');
  
  // Toggle password visibility
  togglePasswordButton.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle eye icon
    eyeIcon.classList.toggle('hide');
  });
  
  // Input validation
  usernameInput.addEventListener('blur', () => {
    validateUsername(usernameInput.value);
  });
  
  passwordInput.addEventListener('blur', () => {
    validatePassword(passwordInput.value);
  });
  
  // Form submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);
    
    if (isUsernameValid && isPasswordValid) {
      // Simulate login - In a real app, you would send this to a server
      console.log('Login credentials submitted:', { 
        username,
        password,
        rememberMe: document.getElementById('remember').checked 
      });
      
      // Add success animation
      const loginButton = document.querySelector('.login-button');
      loginButton.textContent = 'Success!';
      loginButton.style.backgroundColor = 'var(--success)';
      
      // Simulate redirect after login
      setTimeout(() => {
        alert('Login successful! (This is a demo)');
        loginForm.reset();
        loginButton.textContent = 'Sign in';
        loginButton.style.backgroundColor = '';
      }, 1500);
    }
  });
  
  // Validation functions
  function validateUsername(username) {
    if (!username.trim()) {
      showError(usernameInput, usernameError, 'Username is required');
      return false;
    } else if (username.length < 3) {
      showError(usernameInput, usernameError, 'Username must be at least 3 characters');
      return false;
    }
    
    hideError(usernameInput, usernameError);
    return true;
  }
  
  function validatePassword(password) {
    if (!password) {
      showError(passwordInput, passwordError, 'Password is required');
      return false;
    } else if (password.length < 6) {
      showError(passwordInput, passwordError, 'Password must be at least 6 characters');
      return false;
    }
    
    hideError(passwordInput, passwordError);
    return true;
  }
  
  function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  }
  
  function hideError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
  }
  
  // Add subtle animations
  const inputs = [usernameInput, passwordInput];
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });
}