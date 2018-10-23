function matchPasswords(input) {
      if (input.value != document.getElementById('password').value) {
          input.setCustomValidity('Password must be matching.');
      } else {
          input.setCustomValidity('');
      }
};