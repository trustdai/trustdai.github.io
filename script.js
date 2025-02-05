// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// Toggle contact form visibility
function toggleContactForm() {
    const form = document.getElementById('contactForm');
    const button = document.querySelector('.contact-button');
    form.classList.toggle('hidden');
    button.textContent = form.classList.contains('hidden') ? 'Contact Us' : 'Hide Form';
}

// Validate phone number
function validatePhone(phone) {
    // Remove all spaces and hyphens
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Check if it starts with + (optional)
    // Followed by 1-3 digits for country code (optional)
    // Followed by 8-12 digits for the phone number
    const phoneRegex = /^\+?\d{1,3}?\d{8,12}$/;
    
    if (!phoneRegex.test(cleanPhone)) {
        return false;
    }
    
    // Ensure there's at least 8 digits in total
    const digitCount = cleanPhone.replace(/\D/g, '').length;
    return digitCount >= 8;
}

// Form handling
async function handleSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const submitButton = form.querySelector('button[type="submit"]');
    const contactButton = document.querySelector('.contact-button');
    
    // Validate phone number
    const phoneInput = form.phone;
    if (!validatePhone(phoneInput.value)) {
        formStatus.textContent = 'Please enter a valid phone number with at least 8 digits. Include country code if applicable (e.g., +91 9986537666)';
        formStatus.className = 'form-status error';
        formStatus.style.display = 'block';
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return false;
    }
    
    // Clear any previous status
    formStatus.style.display = 'none';
    formStatus.className = 'form-status';
    
    // Show loading spinner and disable submit button
    loadingSpinner.classList.remove('hidden');
    submitButton.disabled = true;
    
    const formData = {
        timestamp: new Date().toISOString(),
        name: form.name.value,
        email: form.email.value,
        phone: phoneInput.value.replace(/[\s-]/g, ''), // Store cleaned phone number
        message: form.message.value
    };

    try {
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxkvWz8zSaIoVfbfgGBewn6VlVMtr6NID_wvC-IoIA94U_Elpb7TdAOxB0ktDGzoRk/exec';
        
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Hide loading spinner
        loadingSpinner.classList.add('hidden');

        // Show success message
        formStatus.textContent = `Thank you ${formData.name}! We have received your message and will get back to you soon.`;
        formStatus.className = 'form-status success';
        formStatus.style.display = 'block';
        
        // Reset the form and hide it
        form.reset();
        form.classList.add('hidden');
        contactButton.textContent = 'Contact Us';
        
        // Ensure the status message is visible
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    } catch (error) {
        console.error('Error:', error);
        
        // Hide loading spinner
        loadingSpinner.classList.add('hidden');
        
        formStatus.textContent = 'Sorry, there was an error submitting your message. Please try again later.';
        formStatus.className = 'form-status error';
        formStatus.style.display = 'block';
    } finally {
        // Re-enable the submit button
        submitButton.disabled = false;
        
        // Hide the status message after 7 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 7000);
    }

    return false;
}
