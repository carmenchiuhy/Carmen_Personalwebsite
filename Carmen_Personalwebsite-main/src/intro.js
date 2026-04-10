document.addEventListener('DOMContentLoaded', function() {
            const introSection = document.querySelector('.intro-section');
            
            // Create an Intersection Observer to detect when the element enters the viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add the 'animate' class when the section is in the viewport
                        introSection.classList.add('animate');
                    }
                });
            }, {
                threshold: 0.3 // Trigger when 30% of the element is visible
            });
            
            // Start observing the intro section
            observer.observe(introSection);
        });