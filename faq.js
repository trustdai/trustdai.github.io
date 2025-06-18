document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Add click event listeners to each FAQ item
    faqItems.forEach(item => {
        const toggleButton = item.querySelector('.faq-toggle');
        const answer = item.querySelector('.faq-answer');
        
        // Add click event listener to the toggle button
        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle active class on the toggle button
            toggleButton.classList.toggle('active');
            
            // Toggle active class on the answer
            answer.classList.toggle('active');
        });
    });
});