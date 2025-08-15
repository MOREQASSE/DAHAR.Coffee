const status = document.getElementById('status');
const menuList = document.getElementById('menuList');

// Configuration
const MENU_PATH = '../data/menu.json';

// Load menu when the page loads
document.addEventListener('DOMContentLoaded', loadMenu);

// Load and display the current menu
async function loadMenu() {
  try {
    status.textContent = 'Loading menu...';
    const response = await fetch(MENU_PATH);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const menuData = await response.json();
    displayMenu(menuData);
    status.textContent = 'Menu loaded successfully';
    setTimeout(() => status.textContent = '', 2000);
  } catch (error) {
    console.error('Error loading menu:', error);
    status.textContent = 'Error loading menu. Please check console for details.';
    status.style.color = 'red';
  }
}

// Display menu items in the admin panel
function displayMenu(menuData) {
  if (!menuData || !Array.isArray(menuData)) {
    console.error('Invalid menu data format:', menuData);
    menuList.innerHTML = '<p>Error: Invalid menu format</p>';
    return;
  }

  menuList.innerHTML = ''; // Clear current items
  
  menuData.forEach(section => {
    if (!section || !section.section || !Array.isArray(section.items)) {
      console.error('Invalid section format:', section);
      return;
    }

    const sectionElement = document.createElement('div');
    sectionElement.className = 'menu-section';
    
    const sectionHeader = document.createElement('h2');
    sectionHeader.className = 'section-title';
    sectionHeader.innerHTML = `<i class="${section.icon || 'fas fa-utensils'}"></i> ${section.section}`;
    sectionElement.appendChild(sectionHeader);
    
    if (section.description) {
      const sectionDesc = document.createElement('p');
      sectionDesc.className = 'section-description';
      sectionDesc.textContent = section.description;
      sectionElement.appendChild(sectionDesc);
    }
    
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'items-grid';
    
    section.items.forEach(item => {
      if (!item || !item.name) {
        console.error('Invalid item format:', item);
        return;
      }

      const itemElement = document.createElement('div');
      // Get the current protocol and host
      const baseUrl = window.location.origin;
      // Convert relative path to absolute URL
      const imgPath = item.image.startsWith('./') ? item.image.substring(1) : item.image;
      const imgSrc = `${baseUrl}${imgPath}`;
      
      itemElement.className = 'menu-item';
      itemElement.innerHTML = `
        <div class="item-image">
          <img src="${imgSrc}" alt="${item.name}" class="menu-img" onerror="console.error('Failed to load image:', this.src); this.style.display='none'" />
        </div>
        <div class="item-details">
          <h3 class="item-name">${item.name}</h3>
          <p class="item-description">${item.description || ''}</p>
          <p class="item-price">${item.price || 'N/A'} DH</p>
        </div>
        <div class="item-actions">
          <button class="btn edit-btn">Edit</button>
          <button class="btn delete-btn">Delete</button>
        </div>
      `;
      itemsContainer.appendChild(itemElement);
    });
    
    sectionElement.appendChild(itemsContainer);
    menuList.appendChild(sectionElement);
  });
}