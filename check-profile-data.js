// Add this to browser console to check
console.log('=== Checking Profile Data ===');
console.log('Cookies:', document.cookie);
console.log('User Email Cookie:', document.cookie.split('; ').find(row => row.startsWith('userEmail=')));

// Test API call
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const userEmail = getCookie('userEmail');
console.log('Extracted Email:', userEmail);

if (userEmail) {
  fetch(`/api/profiles/save?email=${encodeURIComponent(userEmail)}`)
    .then(res => res.json())
    .then(data => console.log('API Response:', data))
    .catch(err => console.error('API Error:', err));
} else {
  console.log('❌ No userEmail cookie found!');
}
