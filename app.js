let currentToken = '';

// Initialize hCaptcha with site key from config
function initHCaptcha() {
    const widget = document.getElementById('hcaptcha-widget');
    if (widget && window.CONFIG) {
        widget.setAttribute('data-sitekey', window.CONFIG.HCAPTCHA_SITE_KEY);
    }
}

function onCaptchaSuccess(token) {
    currentToken = token;
    document.getElementById('tokenOutput').value = token;
    document.getElementById('resultContainer').style.display = 'block';
    console.log('hCaptcha token generated:', token);
}

function copyToken() {
    const tokenOutput = document.getElementById('tokenOutput');
    tokenOutput.select();
    tokenOutput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    
    const copyBtn = document.getElementById('copyBtn');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyBtn.textContent = originalText;
    }, 2000);
}

function testToken() {
    const backendTest = document.getElementById('backendTest');
    backendTest.style.display = 'block';
}

async function verifyWithBackend() {
    const backendUrl = document.getElementById('backendUrl').value;
    const testResult = document.getElementById('testResult');
    
    if (!backendUrl) {
        testResult.innerHTML = '<p class="error">Please enter a backend URL</p>';
        return;
    }
    
    try {
        testResult.innerHTML = '<p>Testing...</p>';
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: currentToken
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            testResult.innerHTML = `<p class="success">✓ Backend verification successful!</p><pre>${JSON.stringify(result, null, 2)}</pre>`;
        } else {
            testResult.innerHTML = `<p class="error">✗ Backend verification failed</p><pre>${JSON.stringify(result, null, 2)}</pre>`;
        }
    } catch (error) {
        testResult.innerHTML = `<p class="error">✗ Error: ${error.message}</p>`;
    }
}

// Add event listener for backend URL input
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hCaptcha with the site key
    initHCaptcha();
    
    const backendUrl = document.getElementById('backendUrl');
    if (backendUrl) {
        backendUrl.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyWithBackend();
            }
        });
    }
});