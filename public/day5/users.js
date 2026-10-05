// Day 5 - Fetch Users Assignment
// Uses fetch, async/await, try/catch/finally

let allUsers = [];

async function loadUsers() {
  const button = document.getElementById('load-users');
  const status = document.getElementById('status');
  const list = document.getElementById('users-list');

  // Disable button while loading
  button.disabled = true;
  button.textContent = 'Loading...';

  // Show loading status
  status.textContent = 'Loading users...';
  status.className = 'loading';

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    // Check response.ok
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const users = await response.json();

    // Store users in the array
    allUsers = users;

    // Update status
    status.textContent = `Successfully loaded ${users.length} users.`;
    status.className = 'success';

    // Render the users
    renderUsers(allUsers);

  } catch (error) {
    // Error handling
    status.textContent = `Error: ${error.message}`;
    status.className = 'error';
    list.innerHTML = '';
  } finally {
    // Re-enable button
    button.disabled = false;
    button.textContent = 'Load Users';
  }
}

function renderUsers(list) {
  const usersList = document.getElementById('users-list');
  const status = document.getElementById('status');

  // Clear the list
  usersList.innerHTML = '';

  if (list.length === 0) {
    // Show no match message
    const noMatch = document.createElement('li');
    noMatch.className = 'no-match';
    noMatch.textContent = 'No users match your filter.';
    usersList.appendChild(noMatch);

    // Update status to reflect filtered count
    status.textContent = `No users match your filter.`;
    status.className = 'loading';
    return;
  }

  // Render each user using createElement and textContent
  list.forEach(user => {
    const li = document.createElement('li');

    const nameEl = document.createElement('div');
    nameEl.className = 'name';
    nameEl.textContent = user.name;

    const emailEl = document.createElement('div');
    emailEl.className = 'detail';
    emailEl.textContent = `📧 ${user.email}`;

    const cityEl = document.createElement('div');
    cityEl.className = 'detail';
    cityEl.textContent = `📍 ${user.address.city}`;

    const companyEl = document.createElement('div');
    companyEl.className = 'detail';
    companyEl.textContent = `🏢 ${user.company.name}`;

    li.appendChild(nameEl);
    li.appendChild(emailEl);
    li.appendChild(cityEl);
    li.appendChild(companyEl);

    usersList.appendChild(li);
  });
}

// Event listener for the button
document.getElementById('load-users').addEventListener('click', loadUsers);

// Event listener for the filter input
document.getElementById('filter-input').addEventListener('input', function (e) {
  const filterText = e.target.value.toLowerCase();

  if (allUsers.length === 0) return; // Don't filter if no users loaded

  const filtered = allUsers.filter(user =>
    user.name.toLowerCase().includes(filterText)
  );

  renderUsers(filtered);
});
