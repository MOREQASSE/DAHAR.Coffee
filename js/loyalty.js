(function() {
    'use strict';
  
    const MAX_STAMPS = 10;
    let stamps = [];
  
    // --- Load & Save ---
    function loadStamps() {
      const data = localStorage.getItem('loyalty-stamps');
      stamps = data ? JSON.parse(data) : [];
    }
  
    function saveStamps() {
      localStorage.setItem('loyalty-stamps', JSON.stringify(stamps));
    }
  
    // --- Render UI ---
    function renderStamps() {
      const container = document.getElementById('stamps');
      container.innerHTML = '';
      for (let i = 0; i < MAX_STAMPS; i++) {
        const div = document.createElement('div');
        div.className = 'stamp' + (i < stamps.length ? ' filled' : '');
        container.appendChild(div);
      }
    }
  
    function updateStatus() {
      const msg = document.getElementById('status-msg');
      if (stamps.length >= MAX_STAMPS) {
        msg.textContent = 'Félicitations ! Votre boisson gratuite est disponible.';
      } else {
        msg.textContent = `Tampons : ${stamps.length} / ${MAX_STAMPS}`;
      }
    }
  
    function addStamp() {
      if (stamps.length < MAX_STAMPS) {
        stamps.push(Date.now());
        saveStamps();
        renderStamps();
        updateStatus();
      }
    }
  
    // --- Staff PIN Logic ---
    let staffCode = 'Dahar4420';  // Replace via build-time env var or CI secret
  
    const pinInput = document.getElementById('staff-pin');
    const staffBtn = document.getElementById('staff-stamp-btn');
  
    function onPinInput(e) {
      staffBtn.disabled = e.target.value !== staffCode;
    }
  
    function onStaffBtnClick() {
      // Award stamp
      addStamp();
  
      // Purge code & disable further use
      staffCode = null;
      pinInput.value = '';
      pinInput.disabled = true;
      staffBtn.disabled = true;
  
      pinInput.removeEventListener('input', onPinInput);
      staffBtn.removeEventListener('click', onStaffBtnClick);
  
      alert('Un tampon a été ajouté avec succès ! Merci 😊');
    }
  
    // --- Initialize ---
    function init() {
      loadStamps();
      renderStamps();
      updateStatus();
  
      pinInput.addEventListener('input', onPinInput);
      staffBtn.addEventListener('click', onStaffBtnClick);
    }
  
    document.addEventListener('DOMContentLoaded', init);
  })();
  