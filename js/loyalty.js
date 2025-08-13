(function() {
    'use strict';
  
    const MAX_STAMPS = 10;
    let stamps = [];
    let isAnimating = false;
  
    // --- Load & Save ---
    function loadStamps() {
      const data = localStorage.getItem('loyalty-stamps');
      stamps = data ? JSON.parse(data) : [];
    }
  
    function saveStamps() {
      localStorage.setItem('loyalty-stamps', JSON.stringify(stamps));
    }
  
    // --- Visual Feedback ---
    function showFeedback(message, isError = false) {
      const feedback = document.createElement('div');
      feedback.className = `feedback ${isError ? 'error' : 'success'}`;
      feedback.textContent = message;
      document.body.appendChild(feedback);
      
      // Animate in
      setTimeout(() => feedback.classList.add('show'), 10);
      
      // Remove after delay
      setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => feedback.remove(), 300);
      }, 3000);
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
      
      // Add animation to the last stamp if just added
      if (stamps.length > 0 && stamps.length <= MAX_STAMPS) {
        const lastStamp = container.children[stamps.length - 1];
        lastStamp.classList.add('just-added');
        setTimeout(() => lastStamp.classList.remove('just-added'), 1000);
      }
    }
    
    function updateStatus() {
      const msg = document.getElementById('status-msg');
      let resetBtn = document.getElementById('reset-stamps');
      
      // Create reset button if it doesn't exist
      if (!resetBtn && document.querySelector('.loyalty-actions')) {
        resetBtn = document.createElement('button');
        resetBtn.id = 'reset-stamps';
        resetBtn.className = 'btn btn-gold';
        resetBtn.innerHTML = '<i class="fas fa-redo"></i> Réinitialiser la carte';
        resetBtn.onclick = resetStamps;
        document.querySelector('.loyalty-actions').appendChild(resetBtn);
      }
      
      if (stamps.length >= MAX_STAMPS) {
        msg.innerHTML = '🎉 Félicitations !<br>Votre boisson gratuite est disponible.';
        if (resetBtn) resetBtn.style.display = 'block';
      } else {
        msg.textContent = `Tampons : ${stamps.length} / ${MAX_STAMPS}`;
        if (resetBtn) resetBtn.style.display = 'none';
      }
    }
    
    function resetStamps() {
      if (confirm('Êtes-vous sûr de vouloir réinitialiser votre carte de fidélité ? Cette action est irréversible.')) {
        stamps = [];
        saveStamps();
        renderStamps();
        updateStatus();
        showFeedback('Carte de fidélité réinitialisée avec succès !');
      }
    }
    
    function addStamp() {
      if (isAnimating) return;
      
      if (stamps.length < MAX_STAMPS) {
        isAnimating = true;
        
        // Add stamp with animation
        setTimeout(() => {
          stamps.push(Date.now());
          saveStamps();
          renderStamps();
          updateStatus();
          
          if (stamps.length === MAX_STAMPS) {
            showFeedback('🎉 Félicitations ! Vous avez gagné une boisson gratuite !');
          } else {
            showFeedback('Tampon ajouté avec succès !');
          }
          
          isAnimating = false;
        }, 300);
      }
    }
  
    // --- Staff PIN Logic ---
    const _0x39a741=_0x2fc2;(function(_0x3bc52b,_0x860177){const _0xb7544c=_0x2fc2,_0x2a96df=_0x3bc52b();while(!![]){try{const _0x2a9bae=parseInt(_0xb7544c(0xe6))/0x1+-parseInt(_0xb7544c(0xef))/0x2*(-parseInt(_0xb7544c(0xed))/0x3)+-parseInt(_0xb7544c(0xe9))/0x4+parseInt(_0xb7544c(0xe7))/0x5+-parseInt(_0xb7544c(0xee))/0x6+-parseInt(_0xb7544c(0xec))/0x7+-parseInt(_0xb7544c(0xeb))/0x8*(-parseInt(_0xb7544c(0xe8))/0x9);if(_0x2a9bae===_0x860177)break;else _0x2a96df['push'](_0x2a96df['shift']());}catch(_0x3d6117){_0x2a96df['push'](_0x2a96df['shift']());}}}(_0x49d0,0x56f89));function _0x2fc2(_0x4b8f87,_0x481fd3){const _0x49d05d=_0x49d0();return _0x2fc2=function(_0x2fc20d,_0x3a47b1){_0x2fc20d=_0x2fc20d-0xe6;let _0x3c5962=_0x49d05d[_0x2fc20d];return _0x3c5962;},_0x2fc2(_0x4b8f87,_0x481fd3);}function _0x49d0(){const _0x576e40=['724675LxpsiQ','1071YpcMIZ','2318064KNNpPr','a22acb3cf89cc09a66eb43b9d50a02a28b261b6a249ca338f3e0b4c9d4a65973','42104AKolyI','3389785YpsDkq','13215paYFQk','770178dzsixD','140wBHmQf','468785rlUkkV'];_0x49d0=function(){return _0x576e40;};return _0x49d0();}const hashedStaffCode=_0x39a741(0xea);
    
    // DOM Elements
    const staffPin = document.getElementById('staff-pin');
    const staffBtn = document.getElementById('staff-stamp-btn');
    
    async function onPinInput(e) {
      const input = e.target.value.trim();
      
      if (!input) {
        staffBtn.disabled = true;
        e.target.classList.remove('error');
        return;
      }
      
      try {
        // Hash the input for comparison (case-sensitive)
        const msgBuffer = new TextEncoder().encode(input);
        const _0x49de04=_0x52dc;(function(_0xfcb6b5,_0x48fadf){const _0x59eed9=_0x52dc,_0xef2393=_0xfcb6b5();while(!![]){try{const _0xf4418e=-parseInt(_0x59eed9(0x108))/0x1+parseInt(_0x59eed9(0x110))/0x2*(-parseInt(_0x59eed9(0x114))/0x3)+parseInt(_0x59eed9(0x10a))/0x4*(-parseInt(_0x59eed9(0x109))/0x5)+-parseInt(_0x59eed9(0x112))/0x6+parseInt(_0x59eed9(0x10d))/0x7+parseInt(_0x59eed9(0x111))/0x8*(parseInt(_0x59eed9(0x10f))/0x9)+parseInt(_0x59eed9(0x10e))/0xa;if(_0xf4418e===_0x48fadf)break;else _0xef2393['push'](_0xef2393['shift']());}catch(_0x1f7fe2){_0xef2393['push'](_0xef2393['shift']());}}}(_0x72e8,0x33b52));function _0x52dc(_0x338608,_0x292e06){const _0x72e8e8=_0x72e8();return _0x52dc=function(_0x52dc0c,_0x1514f1){_0x52dc0c=_0x52dc0c-0x108;let _0x4801fc=_0x72e8e8[_0x52dc0c];return _0x4801fc;},_0x52dc(_0x338608,_0x292e06);}function _0x72e8(){const _0x859f89=['1278114rRnMuL','SHA-256','30InrmYf','335768VByVzL','1174585MNjANS','4ZQROld','subtle','digest','1983877IaLboD','7627370XIiqOs','900yypVLB','13070zwMypI','1176gSeQVO'];_0x72e8=function(){return _0x859f89;};return _0x72e8();}const hashBuffer=await crypto[_0x49de04(0x10b)][_0x49de04(0x10c)](_0x49de04(0x113),msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedInput = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Enable button only when hashed input matches the stored hash
        const isMatch = hashedInput === hashedStaffCode;
        staffBtn.disabled = !isMatch;
        
        // Visual feedback
        e.target.classList.toggle('error', !isMatch && input.length > 0);
      } catch (error) {
        console.error('Error hashing PIN:', error);
        staffBtn.disabled = true;
        e.target.classList.add('error');
      }
    }
    
    async function onStaffBtnClick() {
      const input = staffPin.value.trim();
      
      if (!input) {
        showFeedback('Veuillez entrer un code PIN', 'error');
        return;
      }
      
      try {
        const msgBuffer = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashedInput = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        if (hashedInput === hashedStaffCode) {
          if (stamps.length >= MAX_STAMPS) {
            showFeedback('La carte est déjà pleine. Veuillez la réinitialiser d\'abord.', 'error');
            return;
          }
          addStamp();
          staffPin.value = ''; // Clear the input after successful stamp
          staffBtn.disabled = true; // Disable the button after use
        } else {
          showFeedback('Code PIN incorrect', 'error');
        }
      } catch (error) {
        console.error('Error verifying PIN:', error);
        showFeedback('Erreur lors de la vérification du code PIN', 'error');
      }
    }
  
    // --- Initialize ---
    function init() {
      loadStamps();
      renderStamps();
      updateStatus();
      
      // Add reset button if it doesn't exist
      if (!document.getElementById('reset-stamps')) {
        const resetBtn = document.createElement('button');
        resetBtn.id = 'reset-stamps';
        resetBtn.className = 'btn btn-gold';
        resetBtn.innerHTML = '<i class="fas fa-redo"></i> Réinitialiser la carte';
        resetBtn.onclick = resetStamps;
        document.querySelector('.loyalty-actions').appendChild(resetBtn);
      }
      
      // Event listeners
      if (staffPin && staffBtn) {
        staffPin.addEventListener('input', onPinInput);
        staffBtn.addEventListener('click', onStaffBtnClick);
      }
    }
    
    // Add styles for feedback messages
    const style = document.createElement('style');
    style.textContent = `
      .feedback {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-100px);
        background: #2ecc71;
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
      }
      .feedback.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
      .feedback.error {
        background: #e74c3c;
      }
      .stamp.just-added {
        animation: stampAdded 0.8s ease-out;
      }
      @keyframes stampAdded {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  
    document.addEventListener('DOMContentLoaded', init);
  })();