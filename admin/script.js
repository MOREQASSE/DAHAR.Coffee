const form = document.getElementById('menuForm');
const status = document.getElementById('status');
const menuList = document.getElementById('menuList');

// Replace with your actual values
const GITHUB_TOKEN = 'YOUR_GITHUB_TOKEN';
const REPO = 'your-username/your-repo';
const BRANCH = 'main';
const MENU_PATH = 'data/menu.json';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = 'Uploading...';

  const formData = new FormData(form);
  const name = formData.get('name');
  const description = formData.get('description');
  const price = formData.get('price');
  const imageFile = formData.get('image');

  try {
    const imageBase64 = await toBase64(imageFile);
    const imagePath = `assets/menu/${Date.now()}-${imageFile.name}`;
    await uploadToGitHub(imagePath, imageBase64, `Add image for ${name}`);

    const menuData = await fetchMenu();
    const updatedMenu = [...menuData.items, {
      name,
      description,
      price,
      image: `/${imagePath}`
    }];

    await uploadToGitHub(MENU_PATH, btoa(JSON.stringify(updatedMenu, null, 2)), `Add menu item: ${name}`, menuData.sha);

    status.textContent = 'Menu item uploaded successfully!';
    form.reset();
    loadMenu();
  } catch (err) {
    console.error(err);
    status.textContent = 'Error uploading item.';
  }
});

async function loadMenu() {
  menuList.innerHTML = 'Loading...';
  try {
    const menuData = await fetchMenu();
    menuList.innerHTML = '';
    menuData.items.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'menu-item';
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="menu-details">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p><strong>${item.price} MAD</strong></p>
        </div>
        <button onclick="deleteItem(${index})">Delete</button>
      `;
      menuList.appendChild(div);
    });
  } catch (err) {
    menuList.innerHTML = 'Failed to load menu.';
  }
}

async function deleteItem(index) {
  if (!confirm('Are you sure you want to delete this item?')) return;

  try {
    const menuData = await fetchMenu();
    const item = menuData.items[index];
    const updatedMenu = menuData.items.filter((_, i) => i !== index);

    await uploadToGitHub(MENU_PATH, btoa(JSON.stringify(updatedMenu, null, 2)), `Delete menu item: ${item.name}`, menuData.sha);

    // Optional: delete image file
    const imagePath = item.image.replace(/^\//, '');
    await deleteFromGitHub(imagePath, `Delete image for ${item.name}`);

    loadMenu();
  } catch (err) {
    console.error(err);
    alert('Failed to delete item.');
  }
}

async function fetchMenu() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${MENU_PATH}`, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
  });
  if (!res.ok) throw new Error('Failed to fetch menu');
  const data = await res.json();
  return {
    items: JSON.parse(atob(data.content)),
    sha: data.sha
  };
}

async function uploadToGitHub(path, content, message, sha = null) {
  const url = `https://api.github.com/repos/${REPO}/contents/${path}`;
  const body = {
    message,
    content,
    branch: BRANCH
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) throw new Error(`GitHub upload failed: ${res.status}`);
}

async function deleteFromGitHub(path, message) {
  const url = `https://api.github.com/repos/${REPO}/contents/${path}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
  });
  const data = await res.json();

  const deleteRes = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      sha: data.sha,
      branch: BRANCH
    })
  });

  if (!deleteRes.ok) throw new Error(`GitHub delete failed: ${deleteRes.status}`);
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Initial load
loadMenu