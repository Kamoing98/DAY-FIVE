import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  address: { city: string };
  company: { name: string };
}

type TabId = 'demo' | 'html' | 'js' | 'api';
type StatusType = 'idle' | 'loading' | 'success' | 'error';

// ─── Source Code Strings ─────────────────────────────────────────────────────

const htmlSource = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Day 5 — Fetch Users</title>
  <style>
    /* ... inline styles ... */
  </style>
</head>
<body>
  <h1>📋 User Directory</h1>

  <div class="controls">
    <button id="load-users">Load Users</button>
    <label for="filter-input">Filter by name:</label>
    <input id="filter-input" type="text" placeholder="Type to filter...">
  </div>

  <p id="status">Click "Load Users" to fetch data.</p>

  <ul id="users-list"></ul>

  <script src="users.js" defer></script>
</body>
</html>`;

const jsSource = `// Store loaded users in an array
let allUsers = [];

// loadUsers() — async function using fetch, async/await, try/catch/finally
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
  list.innerHTML = '';

  try {
    // Fetch users from JSONPlaceholder
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/users'
    );

    // Check response.ok — throw if not successful
    if (!response.ok) {
      throw new Error('HTTP error! Status: ' + response.status);
    }

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

// renderUsers(list) — draws any array of users into #users-list
// Uses createElement and textContent for each user
function renderUsers(list) {
  const usersList = document.getElementById('users-list');
  const status = document.getElementById('status');
  usersList.innerHTML = '';

  // If empty, show the no-match message
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

    const nameEl = document.createElement('div');
    nameEl.className = 'user-name';
    nameEl.textContent = user.name;

    const emailEl = document.createElement('div');
    emailEl.className = 'user-detail';
    emailEl.textContent = '📧 ' + user.email;

    const cityEl = document.createElement('div');
    cityEl.className = 'user-detail';
    cityEl.textContent = '📍 ' + user.address.city;

    const companyEl = document.createElement('div');
    companyEl.className = 'user-detail';
    companyEl.textContent = '🏢 ' + user.company.name;

    li.appendChild(nameEl);
    li.appendChild(emailEl);
    li.appendChild(cityEl);
    li.appendChild(companyEl);
    usersList.appendChild(li);
  });
}

// Listen for click on the Load Users button
document.getElementById('load-users')
  .addEventListener('click', loadUsers);

// Listen for input event on the filter box
// Filters the stored array — no new request is made
document.getElementById('filter-input')
  .addEventListener('input', function (e) {
    const filterText = e.target.value.toLowerCase();
    if (allUsers.length === 0) return;

    // Show only users whose name includes the typed text (case-insensitive)
    const filtered = allUsers.filter(function (user) {
      return user.name.toLowerCase().includes(filterText);
    });

    renderUsers(filtered);
  });`;

const apiSource = `# Library Books REST API

## Endpoints

### 1. List All Books
- **Method:** GET
- **Path:** /api/books
- **Description:** Returns a list of all books in the library.
- **Success Status Code:** 200 OK

### 2. Get One Book
- **Method:** GET
- **Path:** /api/books/:id
- **Description:** Returns the details of a single book by its ID.
- **Success Status Code:** 200 OK

### 3. Create a Book
- **Method:** POST
- **Path:** /api/books
- **Description:** Creates a new book in the library catalog.
- **Request Body:**
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0743273565",
    "year": 1925,
    "genre": "Fiction"
  }
- **Success Status Code:** 201 Created

### 4. Update a Book
- **Method:** PUT
- **Path:** /api/books/:id
- **Description:** Replaces all fields of an existing book.
- **Request Body:**
  {
    "title": "The Great Gatsby (Revised)",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0743273565",
    "year": 1925,
    "genre": "Classic Fiction"
  }
- **Success Status Code:** 200 OK

### 5. Delete a Book
- **Method:** DELETE
- **Path:** /api/books/:id
- **Description:** Removes a book from the catalog by its ID.
- **Success Status Code:** 204 No Content

### 6. List Books by Author
- **Method:** GET
- **Path:** /api/books?author=:authorName
- **Description:** Returns all books by a specific author (query parameter).
- **Example:** GET /api/books?author=Fitzgerald
- **Success Status Code:** 200 OK

## Error Codes

### 400 Bad Request
- **When it happens:** Missing required fields or invalid data.
- **Example:** POST /api/books without the required "title" field.

### 404 Not Found
- **When it happens:** Requested resource does not exist.
- **Example:** GET /api/books/999 for a non-existent book ID.`;

// ─── Small Components ────────────────────────────────────────────────────────

function TabButton({ label, active, onClick }: {
  label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-all duration-200 border-b-2
        ${active
          ? 'bg-white text-blue-700 border-blue-600 shadow-sm'
          : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200 border-transparent'
        }`}
    >
      {label}
    </button>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded uppercase">
        {language}
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 pt-8 rounded-lg overflow-x-auto text-[13px] leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <li className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-shadow">
      <div className="font-bold text-gray-800 text-lg">{user.name}</div>
      <div className="text-gray-600 text-sm mt-1">📧 {user.email}</div>
      <div className="text-gray-600 text-sm">📍 {user.address.city}</div>
      <div className="text-gray-600 text-sm">🏢 {user.company.name}</div>
    </li>
  );
}

function ApiCard({ method, path, desc, status, body }: {
  method: string; path: string; desc: string; status: string; body?: string;
}) {
  const colors: Record<string, string> = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PUT: 'bg-amber-100 text-amber-800',
    DELETE: 'bg-red-100 text-red-800',
  };
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${colors[method]}`}>{method}</span>
        <code className="text-sm font-mono text-gray-700 bg-gray-50 px-2 py-0.5 rounded">{path}</code>
      </div>
      <p className="text-gray-600 text-sm mb-2">{desc}</p>
      {body && (
        <div className="mt-2">
          <span className="text-xs font-semibold text-gray-500">Request Body:</span>
          <pre className="mt-1 bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap">{body}</pre>
        </div>
      )}
      <div className="mt-2 text-xs text-gray-500">✅ {status}</div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('demo');
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filterText, setFilterText] = useState('');
  const [status, setStatus] = useState('Click "Load Users" to fetch data.');
  const [statusType, setStatusType] = useState<StatusType>('idle');
  const [loading, setLoading] = useState(false);
  const [useBrokenUrl, setUseBrokenUrl] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const loadUsers = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setStatus('Loading users...');
    setStatusType('loading');
    setUsers([]);

    try {
      // Use broken URL to test error path when checkbox is checked
      const url = useBrokenUrl
        ? 'https://jsonplaceholder.typicode.com/userz' // broken on purpose
        : 'https://jsonplaceholder.typicode.com/users';

      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        throw new Error('HTTP error! Status: ' + response.status);
      }

      const data: User[] = await response.json();
      setAllUsers(data);
      setUsers(data);
      setStatus('Successfully loaded ' + data.length + ' users.');
      setStatusType('success');
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return;
      const msg = error instanceof Error ? error.message : 'Unknown error';
      setStatus('Error: ' + msg);
      setStatusType('error');
      setUsers([]);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  }, [useBrokenUrl]);

  // Filter effect — filters stored array without making a new request
  useEffect(() => {
    if (allUsers.length === 0) return;
    const filtered = allUsers.filter(u =>
      u.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setUsers(filtered);
  }, [filterText, allUsers]);

  const statusStyles: Record<StatusType, string> = {
    idle: 'bg-gray-50 text-gray-600 border border-gray-200',
    loading: 'bg-blue-50 text-blue-700 border border-blue-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📚 Web Foundations — Day 5</h1>
            <p className="text-sm text-gray-500 mt-0.5">Fetch API · Async/Await · REST API Design</p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs text-gray-400 font-medium">Repository</div>
            <div className="text-sm font-mono text-gray-600">web-foundations-days/day5/</div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 flex-wrap">
          <TabButton label="🚀 Live Demo" active={activeTab === 'demo'} onClick={() => setActiveTab('demo')} />
          <TabButton label="📄 index.html" active={activeTab === 'html'} onClick={() => setActiveTab('html')} />
          <TabButton label="⚡ users.js" active={activeTab === 'js'} onClick={() => setActiveTab('js')} />
          <TabButton label="📖 library-api.md" active={activeTab === 'api'} onClick={() => setActiveTab('api')} />
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-lg border border-gray-200 p-6">

          {/* ── DEMO TAB ─────────────────────────────────────────────────── */}
          {activeTab === 'demo' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Live Demo</h2>
              <p className="text-gray-600 text-sm mb-5">
                This replicates the functionality of <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">day5/index.html</code> and{' '}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">day5/users.js</code> — fetches users, displays them, and supports live filtering.
              </p>

              {/* Controls */}
              <div className="flex flex-wrap gap-4 items-center mb-4">
                <button
                  onClick={loadUsers}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                    text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
                >
                  {loading ? '⏳ Loading...' : '🔄 Load Users'}
                </button>

                <div className="flex items-center gap-2">
                  <label htmlFor="filter-input" className="font-semibold text-sm text-gray-700">
                    Filter by name:
                  </label>
                  <input
                    id="filter-input"
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Type to filter..."
                    className="border-2 border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 text-sm w-56 transition-colors outline-none"
                  />
                </div>
              </div>

              {/* Error path toggle */}
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useBrokenUrl}
                    onChange={(e) => setUseBrokenUrl(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-600">
                    🧪 Test error path (breaks the URL to trigger a 404)
                  </span>
                </label>
              </div>

              {/* Status */}
              <div className={`p-3 rounded-lg mb-4 font-medium text-sm ${statusStyles[statusType]}`}>
                {statusType === 'loading' && <span className="inline-block animate-pulse mr-2">⏳</span>}
                {statusType === 'success' && <span className="mr-2">✅</span>}
                {statusType === 'error' && <span className="mr-2">❌</span>}
                {status}
              </div>

              {/* Users list */}
              <ul className="grid gap-3">
                {users.length > 0 ? (
                  users.map(user => <UserCard key={user.id} user={user} />)
                ) : (
                  statusType !== 'idle' && statusType !== 'loading' && (
                    <li className="text-center py-8 text-gray-400 italic bg-gray-50 rounded-lg">
                      {filterText && allUsers.length > 0
                        ? 'No users match your filter.'
                        : statusType === 'error'
                          ? ''
                          : 'No users loaded yet.'}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* ── HTML TAB ─────────────────────────────────────────────────── */}
          {activeTab === 'html' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">📄 day5/index.html</h2>
                <a href="/day5/index.html" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline">
                  Open standalone ↗
                </a>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Contains <code className="bg-gray-100 px-1 rounded">&lt;button id="load-users"&gt;</code>,
                a labelled <code className="bg-gray-100 px-1 rounded">&lt;input id="filter-input"&gt;</code>,
                a <code className="bg-gray-100 px-1 rounded">&lt;p id="status"&gt;</code>,
                an empty <code className="bg-gray-100 px-1 rounded">&lt;ul id="users-list"&gt;</code>,
                and loads <code className="bg-gray-100 px-1 rounded">users.js</code> with <code className="bg-gray-100 px-1 rounded">defer</code>.
              </p>
              <CodeBlock code={htmlSource} language="html" />
            </div>
          )}

          {/* ── JS TAB ───────────────────────────────────────────────────── */}
          {activeTab === 'js' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">⚡ day5/users.js</h2>
                <a href="/day5/users.js" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline">
                  View raw ↗
                </a>
              </div>
              <div className="mb-4">
                <p className="text-gray-600 text-sm font-semibold mb-2">Key features:</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                  <li><code className="bg-gray-100 px-1 rounded">loadUsers()</code> — async function using fetch, async/await, try/catch/finally</li>
                  <li><code className="bg-gray-100 px-1 rounded">renderUsers(list)</code> — draws any array using createElement/textContent</li>
                  <li>Checks <code className="bg-gray-100 px-1 rounded">response.ok</code> before parsing JSON</li>
                  <li>Button disabled while loading; loading/success/error messages in #status</li>
                  <li>Input event listener — filters stored array, no new request</li>
                  <li>Shows "No users match your filter." when filter yields empty results</li>
                </ul>
              </div>
              <CodeBlock code={jsSource} language="javascript" />
            </div>
          )}

          {/* ── API TAB ──────────────────────────────────────────────────── */}
          {activeTab === 'api' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">📖 day5/library-api.md</h2>
                <a href="/day5/library-api.md" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline">
                  View raw ↗
                </a>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                REST API design for a library's books resource — six endpoints plus error documentation.
              </p>

              <div className="space-y-4 mb-6">
                <ApiCard method="GET" path="/api/books" desc="Returns a list of all books in the library." status="200 OK" />
                <ApiCard method="GET" path="/api/books/:id" desc="Returns the details of a single book by its ID." status="200 OK" />
                <ApiCard
                  method="POST" path="/api/books"
                  desc="Creates a new book in the library catalog."
                  status="201 Created"
                  body={`{\n  "title": "The Great Gatsby",\n  "author": "F. Scott Fitzgerald",\n  "isbn": "978-0743273565",\n  "year": 1925,\n  "genre": "Fiction"\n}`}
                />
                <ApiCard
                  method="PUT" path="/api/books/:id"
                  desc="Replaces all fields of an existing book with the provided data."
                  status="200 OK"
                  body={`{\n  "title": "The Great Gatsby (Revised)",\n  "author": "F. Scott Fitzgerald",\n  "isbn": "978-0743273565",\n  "year": 1925,\n  "genre": "Classic Fiction"\n}`}
                />
                <ApiCard method="DELETE" path="/api/books/:id" desc="Removes a book from the catalog by its ID." status="204 No Content" />
                <ApiCard method="GET" path="/api/books?author=:authorName" desc="Returns all books by a specific author (query parameter)." status="200 OK" />
              </div>

              {/* Error codes */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Error Codes</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-bold">400</span>
                      <span className="font-semibold text-red-800">Bad Request</span>
                    </div>
                    <p className="text-sm text-red-700">
                      Missing required fields or invalid data. Example: <code className="bg-red-100 px-1 rounded">POST /api/books</code> without the required "title" field.
                    </p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-bold">404</span>
                      <span className="font-semibold text-orange-800">Not Found</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      Requested resource does not exist. Example: <code className="bg-orange-100 px-1 rounded">GET /api/books/999</code> for a non-existent book ID.
                    </p>
                  </div>
                </div>
              </div>

              {/* Raw markdown */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Raw Markdown Source</h3>
                <CodeBlock code={apiSource} language="markdown" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-400">
          <p>Web Foundations — Day 5 Assignment</p>
          <p className="mt-1">
            Commit: <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">Day 5 assignment</code>
          </p>
        </footer>
      </main>
    </div>
  );
}
