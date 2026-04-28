let popupContainer = null;
let isExpanded = false;

// Inject Floating IOTA Pill
function injectIcon() {
  if (document.getElementById('iota-floating-pill')) return;

  popupContainer = document.createElement('div');
  popupContainer.id = 'iota-floating-pill';

  Object.assign(popupContainer.style, {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    width: '64px',
    height: '64px',
    backgroundColor: 'rgba(249, 249, 249, 0.95)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '0.5px solid rgba(26, 28, 28, 0.1)',
    borderRadius: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#1a1c1c',
    fontFamily: 'Public Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    zIndex: '999999',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
    transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  });

  // Top header area (always visible, acts as the button)
  const header = document.createElement('div');
  Object.assign(header.style, {
    width: '100%',
    height: '64px',
    minHeight: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  });

  // AI/i shield icon approximation in HTML
  header.innerHTML = `
    <img src="${chrome.runtime.getURL('public/iota-logo.svg')}" alt="IOTA" style="width: 32px; height: 32px; object-fit: contain;" />
  `;

  // Content area for reasoning (hidden initially)
  const contentArea = document.createElement('div');
  contentArea.id = 'iota-content-area';
  Object.assign(contentArea.style, {
    width: '100%',
    padding: '0 24px 24px 24px',
    opacity: '0',
    transition: 'opacity 0.4s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    fontSize: '12px',
    boxSizing: 'border-box'
  });

  // Reasoning ticker container
  const tickerContainer = document.createElement('div');
  tickerContainer.id = 'iota-ticker';
  Object.assign(tickerContainer.style, {
    width: '100%',
    height: '140px',
    overflowY: 'auto',
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    paddingLeft: '16px',
    lineHeight: '1.6',
    color: 'rgba(26, 28, 28, 0.7)',
    fontSize: '12px'
  });
  // Send to terminal button
  const terminalBtn = document.createElement('button');
  terminalBtn.innerText = 'SEND TO TERMINAL';
  Object.assign(terminalBtn.style, {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1a1c1c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: '600',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '11px',
    fontFamily: 'Public Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    marginTop: 'auto',
    display: 'none',
    transition: 'background-color 0.2s ease'
  });

  terminalBtn.addEventListener('mouseover', () => terminalBtn.style.backgroundColor = '#2a2c2c');
  terminalBtn.addEventListener('mouseout', () => terminalBtn.style.backgroundColor = '#1a1c1c');

  terminalBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    window.open('https://iota-backend-sa.web.app/dashboard', '_blank');
    collapsePopup();
  });

  header.addEventListener('click', () => {
    if (!isExpanded) {
      expandPopup();
      captureAndScanAIResponse();
    } else {
      collapsePopup();
    }
  });

  contentArea.appendChild(tickerContainer);
  contentArea.appendChild(terminalBtn);
  popupContainer.appendChild(header);
  popupContainer.appendChild(contentArea);
  document.body.appendChild(popupContainer);
}

function expandPopup() {
  isExpanded = true;
  popupContainer.style.width = '340px';
  popupContainer.style.height = '320px';
  popupContainer.style.borderRadius = '32px';
  
  setTimeout(() => {
    document.getElementById('iota-content-area').style.opacity = '1';
  }, 200);
}

function collapsePopup() {
  isExpanded = false;
  document.getElementById('iota-content-area').style.opacity = '0';
  document.getElementById('iota-ticker').innerHTML = '';
  document.querySelector('#iota-content-area button').style.display = 'none';
  
  setTimeout(() => {
    popupContainer.style.width = '64px';
    popupContainer.style.height = '64px';
  }, 100);
}

let typewriterInterval = null;

function displayVerticalTicker(status, reasoning) {
  const ticker = document.getElementById('iota-ticker');
  const btn = document.querySelector('#iota-content-area button');
  ticker.innerHTML = '';
  clearInterval(typewriterInterval);

  const statusColor = status === 'FLAGGED' ? '#e74c3c' : '#27ae60';
  
  const headerHtml = `<div style="color: ${statusColor}; font-weight: 700; margin-bottom: 12px; letter-spacing: 1px; text-transform: uppercase;">[${status}]</div>`;
  
  // Ticker animation
  const lines = reasoning.split(' ');
  let i = 0;
  
  ticker.innerHTML = headerHtml;
  const contentNode = document.createElement('div');
  ticker.appendChild(contentNode);

  typewriterInterval = setInterval(() => {
    contentNode.innerHTML += lines[i] + ' ';
    ticker.scrollTop = ticker.scrollHeight;
    i++;

    if (i >= lines.length) {
      clearInterval(typewriterInterval);
      btn.style.display = 'block'; // Reveal terminal button
    }
  }, 50);
}

async function captureAndScanAIResponse() {
  const ticker = document.getElementById('iota-ticker');
  ticker.innerHTML = '<div style="animation: pulse 1.5s infinite; opacity: 0.5;">Intercepting data stream...</div>';

  const aiResponseSelectors = '.markdown, .prose, [data-message-author-role="assistant"]';
  const elements = document.querySelectorAll(aiResponseSelectors);

  if (elements.length === 0) {
    displayVerticalTicker('ERROR', 'No AI response detected. Try opening a chatbot interface.');
    return;
  }

  const latestResponse = elements[elements.length - 1].innerText || elements[elements.length - 1].textContent;

  if (!latestResponse || latestResponse.trim().length < 5) {
    displayVerticalTicker('ERROR', 'Extracted text is too short to analyze.');
    return;
  }

  try {
    ticker.innerHTML = '<div style="animation: pulse 1.5s infinite; opacity: 0.5;">Authenticating & Scanning...</div>';

    // Retrieve Firebase Auth Token from Chrome Storage
    const authData = await new Promise((resolve) => {
      chrome.storage.local.get(['firebaseAuthToken'], (result) => resolve(result));
    });

    const token = authData.firebaseAuthToken || "MOCK_DEVELOPMENT_TOKEN";

    const response = await fetch('https://iota-backend-925013735036.us-central1.run.app/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        text: latestResponse,
        domain: document.title || "Live Web"
      })
    });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

    const data = await response.json();
    
    // Interpret <70 as FLAGGED
    const status = data.score < 70 ? 'FLAGGED' : 'SAFE';

    displayVerticalTicker(status, data.reasoning);

  } catch (err) {
    displayVerticalTicker('ERROR', 'Could not reach Cloud Run endpoint. Check backend deployment and Auth tokens.');
    console.error("IOTA Scan Error:", err);
  }
}

// Inject keyframes for styles
function injectStyles() {
  if (document.getElementById('iota-content-styles')) return;

  const style = document.createElement('style');
  style.id = 'iota-content-styles';
  style.innerHTML = `
    @keyframes pulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 0.3; }
    }
    #iota-ticker::-webkit-scrollbar {
      width: 4px;
    }
    #iota-ticker::-webkit-scrollbar-track {
      background: transparent;
    }
    #iota-ticker::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
}

// Initialize on page load
function init() {
  injectStyles();
  injectIcon();
}

// Run init
init();
