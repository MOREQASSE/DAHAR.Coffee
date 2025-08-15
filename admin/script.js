const status = document.getElementById('status');
const menuList = document.getElementById('menuList');
const menuForm = document.getElementById('menuForm');
const loadingOverlay = document.getElementById('loading');
const confirmModal = document.getElementById('confirmModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const cancelEditBtn = document.getElementById('cancelEdit');
const imageInput = document.getElementById('image');
const imagePreview = document.createElement('div');
imagePreview.className = 'image-preview';
imageInput.parentNode.insertBefore(imagePreview, imageInput.nextSibling);

let currentMenuData = [];
let currentEditItem = null;
let deleteCallback = null;

// GitHub Service
const githubService = window.githubService;

// Initialize the application
function init() {
  showLoading();
  loadMenu();
  setupEventListeners();
}

// Show loading overlay
function showLoading() {
  loadingOverlay.style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
  loadingOverlay.style.display = 'none';
}

// Show status message
function showStatus(message, isError = false) {
  status.textContent = message;
  status.className = isError ? 'status-message error' : 'status-message success';
  status.style.display = 'block';
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    status.style.opacity = '0';
    status.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
      status.style.display = 'none';
      status.style.opacity = '1';
      status.style.transition = '';
    }, 500);
  }, 3000);
}

// Show confirmation modal
function showConfirmModal(message, callback) {
  const modal = document.getElementById('confirmModal');
  const messageEl = modal.querySelector('p');
  messageEl.textContent = message;
  deleteCallback = callback;
  modal.style.display = 'flex';
}

// Hide confirmation modal
function hideConfirmModal() {
  confirmModal.style.display = 'none';
  deleteCallback = null;
}

// Update form with item data
function populateForm(item, section) {
  menuForm.name.value = item.name || '';
  menuForm.description.value = item.description || '';
  menuForm.price.value = item.price || '';
  menuForm.section.value = section || '';
  
  // Show image preview if exists
  if (item.image) {
    showImagePreview(item.image);
  } else {
    hideImagePreview();
  }
  
  // Update form title and button
  document.querySelector('h1').textContent = 'Edit Menu Item';
  const submitBtn = menuForm.querySelector('button[type="submit"]');
  submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Item';
  cancelEditBtn.style.display = 'inline-flex';
}

// Reset form to add new item
function resetForm() {
  menuForm.reset();
  currentEditItem = null;
  hideImagePreview();
  document.querySelector('h1').textContent = 'Add New Menu Item';
  const submitBtn = menuForm.querySelector('button[type="submit"]');
  submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Item';
  cancelEditBtn.style.display = 'none';
}

// Show image preview
function showImagePreview(url) {
  imagePreview.innerHTML = `<img src="${url}" alt="Preview" />`;
  imagePreview.style.display = 'block';
}

// Hide image preview
function hideImagePreview() {
  imagePreview.style.display = 'none';
  imagePreview.innerHTML = '';
}

// Set up event listeners
function setupEventListeners() {
  // Form submission
  menuForm.addEventListener('submit', handleFormSubmit);
  
  // Image preview
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        showImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Cancel edit
  cancelEditBtn.addEventListener('click', (e) => {
    e.preventDefault();
    resetForm();
  });
  
  // Confirm delete
  confirmDeleteBtn.addEventListener('click', () => {
    if (deleteCallback) {
      deleteCallback();
      hideConfirmModal();
    }
  });
  
  // Cancel delete
  cancelDeleteBtn.addEventListener('click', hideConfirmModal);
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
      hideConfirmModal();
    }
  });
}

// Load menu when the page loads
document.addEventListener('DOMContentLoaded', init);

// Load and display the current menu
async function loadMenu() {
  try {
    showStatus('Loading menu...');
    
    // Use GitHub API to get the latest menu data
    const response = await fetch(
      `https://raw.githubusercontent.com/${GITHUB_CONFIG.USERNAME}/${GITHUB_CONFIG.REPO}/${GITHUB_CONFIG.BRANCH}/${GITHUB_CONFIG.PATH}`,
      { 
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to load menu: ${response.status} ${response.statusText}`);
    }
    
    const menuData = await response.json();
    currentMenuData = menuData;
    displayMenu(menuData);
    showStatus('Menu loaded successfully');
  } catch (error) {
    console.error('Error loading menu:', error);
    showStatus(`Error: ${error.message}`, true);
  } finally {
    hideLoading();
  }
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(menuForm);
  const name = formData.get('name').trim();
  const description = formData.get('description').trim();
  const price = parseFloat(formData.get('price'));
  const imageFile = imageInput.files[0];
  const section = formData.get('section');
  
  // Basic validation
  if (!name || !description || isNaN(price) || !section) {
    showStatus('Please fill in all required fields', true);
    return;
  }
  
  try {
    showLoading();
    showStatus('Saving changes...');
    
    let imageUrl = currentEditItem?.image || '';
    
    // Upload new image if selected
    if (imageFile) {
      const timestamp = new Date().getTime();
      const fileExtension = imageFile.name.split('.').pop();
      const filename = `menu-${timestamp}.${fileExtension}`;
      
      try {
        imageUrl = await githubService.uploadImage(imageFile, filename);
      } catch (error) {
        console.error('Error uploading image:', error);
        showStatus('Error uploading image. The item was saved without an image.', true);
      }
    } else if (!currentEditItem) {
      // For new items without an image, use a placeholder
      imageUrl = '/images/placeholder.jpg';
    }
    
    const menuItem = {
      name,
      description,
      price,
      image: imageUrl
    };
    
    // If editing, update the item; otherwise, add a new one
    if (currentEditItem) {
      // Find and update the item in the current menu data
      for (const sectionData of currentMenuData) {
        const itemIndex = sectionData.items.findIndex(
          item => item.name === currentEditItem.name && 
                 item.description === currentEditItem.description
        );
        
        if (itemIndex !== -1) {
          sectionData.items[itemIndex] = menuItem;
          break;
        }
      }
    } else {
      // Add new item to the appropriate section
      let sectionData = currentMenuData.find(s => s.section === section);
      
      if (!sectionData) {
        // Create new section if it doesn't exist
        sectionData = {
          section,
          icon: getSectionIcon(section),
          items: []
        };
        currentMenuData.push(sectionData);
      }
      
      sectionData.items.push(menuItem);
    }
    
    // Save to GitHub
    await githubService.updateMenuFile(currentMenuData);
    
    // Update the display
    displayMenu(currentMenuData);
    
    // Reset the form
    resetForm();
    
    showStatus('Menu updated successfully!');
  } catch (error) {
    console.error('Error saving menu item:', error);
    showStatus(`Error: ${error.message}`, true);
  } finally {
    hideLoading();
  }
}

// Handle edit button click
function handleEdit(sectionIndex, itemIndex) {
  const section = currentMenuData[sectionIndex];
  const item = section.items[itemIndex];
  
  // Store the item being edited
  currentEditItem = { ...item };
  
  // Fill the form with item data
  populateForm(item, section.section);
  
  // Scroll to form
  menuForm.scrollIntoView({ behavior: 'smooth' });
}

// Handle delete button click
function handleDelete(sectionIndex, itemIndex) {
  const section = currentMenuData[sectionIndex];
  const item = section.items[itemIndex];
  
  showConfirmModal(`Are you sure you want to delete "${item.name}"?`, async () => {
    try {
      showLoading();
      
      // Remove the item from the data
      section.items.splice(itemIndex, 1);
      
      // If the section is empty, remove it
      if (section.items.length === 0) {
        currentMenuData.splice(sectionIndex, 1);
      }
      
      // Save to GitHub
      await githubService.updateMenuFile(currentMenuData);
      
      // Refresh the display
      displayMenu(currentMenuData);
      
      // Reset form if editing the deleted item
      if (currentEditItem && currentEditItem.name === item.name) {
        resetForm();
      }
      
      showStatus('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      showStatus(`Error: ${error.message}`, true);
    } finally {
      hideLoading();
    }
  });
}

// Get appropriate icon for a section
function getSectionIcon(sectionName) {
  const icons = {
    'Nos Cafés': 'fas fa-coffee',
    'Nos Milkshakes': 'fas fa-glass-whiskey',
    'Nos Mojitos': 'fas fa-cocktail',
    'Nos Frappés': 'fas fa-ice-cream',
    'Nos Crêpes': 'fas fa-pancakes',
    'Nos Pâtisseries': 'fas fa-cookie-bite'
  };
  
  return icons[sectionName] || 'fas fa-utensils';
}

// Display menu items in the admin panel
function displayMenu(menuData) {
  if (!menuData || !Array.isArray(menuData)) {
    console.error('Invalid menu data format:', menuData);
    menuList.innerHTML = '<p class="error-message">Error: Invalid menu format. Please check the console for details.</p>';
    return;
  }

  // Filter out sections without items
  const validSections = menuData.filter(section => 
    section && section.section && Array.isArray(section.items) && section.items.length > 0
  );
  
  if (validSections.length === 0) {
    menuList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-utensils"></i>
        <h3>No menu items found</h3>
        <p>Click the "Add Item" button to get started.</p>
      </div>
    `;
    return;
  }
  
  menuList.innerHTML = ''; // Clear current items
  
  validSections.forEach((section, sectionIndex) => {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'menu-section';
    
    const sectionHeader = document.createElement('div');
    sectionHeader.className = 'section-header';
    
    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'section-title';
    sectionTitle.innerHTML = `<i class="${section.icon || getSectionIcon(section.section)}"></i> ${section.section}`;
    
    sectionHeader.appendChild(sectionTitle);
    sectionElement.appendChild(sectionHeader);
    
    if (section.description) {
      const sectionDesc = document.createElement('p');
      sectionDesc.className = 'section-description';
      sectionDesc.textContent = section.description;
      sectionElement.appendChild(sectionDesc);
    }
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
      itemElement.className = 'menu-item';
      
      // Convert relative path to absolute URL
      const baseUrl = window.location.origin;
      const imgPath = item.image.startsWith('/') ? item.image : `/${item.image}`;
      const imgSrc = `${baseUrl}${imgPath}`;
      
      itemElement.innerHTML = `
        <div class="item-image">
          <img src="${imgSrc}" alt="${item.name}" class="menu-img" onerror="this.style.display='none'" />
        </div>
        <div class="item-details">
          <h3 class="item-name">${item.name}</h3>
          <p class="item-description">${item.description || ''}</p>
          <p class="item-price">${item.price || 'N/A'} DH</p>
        </div>
        <div class="item-actions">
          <button type="button" class="btn edit-btn" data-section="${sectionIndex}" data-index="${itemIndex}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button type="button" class="btn delete-btn" data-section="${sectionIndex}" data-index="${itemIndex}">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      `;
      
      // Add event listeners for edit and delete buttons
      itemElement.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        handleEdit(sectionIndex, itemIndex);
      });
      
      itemElement.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        handleDelete(sectionIndex, itemIndex);
      });
      itemsContainer.appendChild(itemElement);
    });
    
    sectionElement.appendChild(itemsContainer);
    menuList.appendChild(sectionElement);
  });
}