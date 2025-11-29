 // Sample project data with labels
        const projects = [
            {
                id: 1,
                title: "BrainChamp Web Designer",
                label: "UI/UX Design",
                description: "Designed the main homepage, creating an engaging and intuitive user experience.",
                image: "brainchamp.png"
            },
            {
                id: 2,
                title: "Pokeguide - MatchBox UX/UI Design",
                label: "UX/UI Design",
                description: "Designed multiple account interfaces—including employer, student, and admin—for MatchBox, an ongoing job-matching platform by Cocoon.",
                image: "matchbox.png"
            },
            {
                id: 3,
                title: "Aristo - Animator",
                label: "Animation",
                description: "Produced and designed animated secondary school educational videos.",
                image: "aristo.png"
            },
            {
                id: 4,
                title: "Caritas Jockey Club Artkids Studio Multimedia Production Intern & Program Intern ",
                label: ["Multmedia"],
                description: "Collaborated with the marketing team to create advertising materials and multimedia content. Led an art workshop for 20 participants, managing preparation, documentation, and event execution.",
                image: "2.png"
            }
        ];

       const container = d3.select("#projects-container");

        const projectCards = container.selectAll(".project-card")
            .data(projects)
            .enter()
            .append("div")
            .attr("class", "project-card");

        // Add project images in rounded rectangle containers
        projectCards.append("div")
            .attr("class", "project-image")
            .append("img")
            .attr("src", d => d.image)
            .attr("alt", d => d.title);

        // Add project content
        const projectContent = projectCards.append("div")
            .attr("class", "project-content");

        projectContent.append("h2")
            .attr("class", "project-title")
            .text(d => d.title);

        // Add project labels
        projectContent.append("span")
            .attr("class", "project-label")
            .text(d => d.label);

        projectContent.append("p")
            .attr("class", "project-description")
            .text(d => d.description);

        // Animation function
        function initScrollAnimations() {
            // Elements to animate
            const sectionTitle = document.querySelector('.section-title h4');
            const projectCards = document.querySelectorAll('.project-card');
            
            // Create an Intersection Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add the 'animate' class when the element is in the viewport
                        entry.target.classList.add('animate');
                        
                        // Stop observing after animation is triggered
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2, // Trigger when 20% of the element is visible
                rootMargin: '0px 0px -50px 0px' // Adjust trigger point slightly upward
            });
            
            // Start observing all elements
            if (sectionTitle) {
                observer.observe(sectionTitle);
            }
            
            projectCards.forEach(card => {
                observer.observe(card);
            });
        }

        // Initialize animations after DOM is loaded and projects are rendered
        document.addEventListener('DOMContentLoaded', function() {
            // Small delay to ensure D3 has rendered the projects
            setTimeout(initScrollAnimations, 100);
        });