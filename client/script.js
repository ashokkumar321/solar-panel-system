let userId, role;

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (data.userId) {
        userId = data.userId;
        role = data.role;
        document.getElementById('login').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        if (role === 'admin') {
            document.getElementById('admin-controls').style.display = 'block';
        }
        loadData();
    } else {
        alert('Login failed');
    }
}

async function loadData() {
    const url = role === 'admin' ? 'http://localhost:5000/api/data' : `http://localhost:5000/api/user-data/${userId}`;
    const res = await fetch(url);
    const data = await res.json();
    renderTable(data);
}

async function filterData() {
    const masterId = document.getElementById('masterId').value;
    const slaveId = document.getElementById('slaveId').value;
    const date = document.getElementById('date').value;

    const res = await fetch(`http://localhost:5000/api/filter?masterId=${masterId}&slaveId=${slaveId}&date=${date}&userId=${userId}`);
    const data = await res.json();
    renderTable(data);
}

async function addArea() {
    const name = document.getElementById('newArea').value;
    await fetch('http://localhost:5000/api/area', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    loadData();
}

function renderTable(data) {
    const tbody = document.getElementById('dataBody');
    tbody.innerHTML = '';

    data.forEach(area => {
        area.masters.forEach(master => {
            master.slaves.forEach(slave => {
                slave.data.forEach(entry => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${area.name}</td>
                        <td>${master.masterId}</td>
                        <td>${slave.slaveId}</td>
                        <td>${new Date(entry.date).toLocaleDateString()}</td>
                        <td>${entry.time}</td>
                        <td>${entry.actualNSAngle}</td>
                        <td>${entry.currentNSAngle}</td>
                        <td>${entry.actualEWAngle}</td>
                        <td>${entry.currentEWAngle}</td>
                    `;
                    tbody.appendChild(row);
                });
            });
        });
    });
}