// Day 5 — users.js
// Fetches users from JSONPlaceholder, displays them, and supports live filtering.

// Store loaded users in an array (module-level)
let allUsers = [];

/**
 * loadUsers() — async function using fetch, async/await, and try/catch/finally.
 * Fetches users from the API, checks response.ok, and renders them.
 */
async function loadUsers() {
  const button = document.getElementById('load-users');
  const status = document.getElementById('status');
  const list = document.getElementById('users-list');

  // Disable button while loading
  button.disabled = true;
  button.textContent = 'Loading...';

  // Show loading message
  status.textContent = 'Loading users...';
  status.className = 'loading';

  // Clear previous results
  list.innerHTML = '';

  try {
    // Fetch users from JSONPlaceholder
    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    // Check response.ok — throw if not successful
    if (!response.ok) {
      throw new Error('HTTP error! Status: ' + response.status);
    }

    // Parse JSON
    const users = await response.json();

    // Store users in the array
    allUsers = users;

    // Show success message
    status.textContent = 'Successfully loaded ' + users.length + ' users.';
    status.className = 'success';

    // Render the users
    renderUsers(allUsers);

  } catch (error) {
    // Error handling — show error message in #status
    status.textContent = 'Error: ' + error.message;
    status.className = 'error';
    list.innerHTML = '';
    allUsers = [];
  } finally {
    // Re-enable button (runs regardless of success or error)
    button.disabled = false;
    button.textContent = 'Load Users';
  }
}

/**
 * renderUsers(list) — draws any array of users into #users-list.
 * Uses createElement and textContent for each user.
 * Shows "No users match your filter." when the array is empty.
 */
function renderUsers(list) {
  const usersList = document.getElementById('users-list');
  const status = document.getElementById('status');

  // Clear the list
  usersList.innerHTML = '';

  // If the list is empty, show the no-match message
  if (list.length === 0) {
    const noMatch = document.createElement('li');
    noMatch.className = 'no-match';
    noMatch.textContent = 'No users match your filter.';
    usersList.appendChild(noMatch);
    status.textContent = 'No users match your filter.';
    status.className = 'loading';
    return;
  }

  // Render each user using createElement and textContent
  list.forEach(function (user) {
    const li = document.createElement('li');

    // Name
    const nameEl = document.createElement('div');
    nameEl.className = 'user-name';
    nameEl.textContent = user.name;

    // Email
    const emailEl = document.createElement('div');
    emailEl.className = 'user-detail';
    emailEl.textContent = '\uD83D\uDCE7 ' + user.email;

    // City
    const cityEl = document.createElement('div');
    cityEl.className = 'user-detail';
    cityEl.textContent = '\uD83D\uDCCD ' + user.address.city;

    // Company name
    const companyEl = document.createElement('div');
    companyEl.className = 'user-detail';
    companyEl.textContent = '\uD83C\uDFE2 ' + user.company.name;

    li.appendChild(nameEl);
    li.appendChild(emailEl);
    li.appendChild(cityEl);
    li.appendChild(companyEl);

    usersList.appendChild(li);
  });
}

// Listen for click on the Load Users button
document.getElementById('load-users').addEventListener('click', loadUsers);

// Listen for input event on the filter box
// Filters the stored array and calls renderUsers — no new request is made
document.getElementById('filter-input').addEventListener('input', function (e) {
  const filterText = e.target.value.toLowerCase();

  // Don't filter if no users have been loaded yet
  if (allUsers.length === 0) return;

  // Filter: show only users whose name includes the typed text (case-insensitive)
  const filtered = allUsers.filter(function (user) {
    return user.name.toLowerCase().includes(filterText);
  });

  renderUsers(filtered);
});
