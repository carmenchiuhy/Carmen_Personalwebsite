    // Enhanced sample data with updated descriptions and categories
        const skillsData = [
            // Creative Technology
            { skill: "HTML/CSS", proficiency: 6, experience: 1, category: "Creative Technology", description: "Building responsive web interfaces and layouts with modern CSS techniques" },
            { skill: "p5.js", proficiency: 7, experience: 1.2, category: "Creative Technology", description: "Creating interactive graphics and visualizations using creative coding" },
            { skill: "Processing", proficiency: 5, experience: 1, category: "Creative Technology", description: "Developing generative art and computational design projects" },
            { skill: "Java", proficiency: 5, experience: 1, category: "Creative Technology", description: "Object-oriented programming for creative applications and tools" },
            
            // Visual Design
            { skill: "Visual Design Principles", proficiency: 9, experience: 3.0, category: "design", description: "Applying fundamental design principles to create compelling visual experiences" },
            { skill: "Typography & Hierarchy", proficiency: 8, experience: 2.6, category: "design", description: "Creating effective type systems and visual information hierarchies" },
            { skill: "Color Theory & Psychology", proficiency: 8, experience: 2.3, category: "design", description: "Using color strategically to evoke emotions and improve usability" },
            { skill: "Interaction Design", proficiency: 7, experience: 2.0, category: "design", description: "Designing intuitive user interactions and seamless digital experiences" },
            
            // Animation
            { skill: "Character Animation", proficiency: 8, experience: 2.1, category: "Animation", description: "Creating lifelike character movements and expressive animations" },
            { skill: "Renderman", proficiency: 7, experience: 1.6, category: "Animation", description: "Producing high-quality renders with advanced lighting and materials" },
            { skill: "Rigging", proficiency: 5, experience: 0.8, category: "Animation", description: "Building character skeletons and control systems for animation" },
            { skill: "Modeling", proficiency: 7, experience: 1.4, category: "Animation", description: "Creating 3D models with proper topology and detail" },
            
            // Design Tools
            { skill: "Figma Design Systems", proficiency: 9, experience: 2.5, category: "tools", description: "Creating comprehensive design systems and prototypes in Figma" },
            { skill: "Maya", proficiency: 7, experience: 2, category: "tools", description: "3D modeling, animation, and rendering using Autodesk Maya" },
            { skill: "Adobe Illustrator", proficiency: 7, experience: 2.5, category: "tools", description: "Creating vector illustrations and graphic designs" },
            { skill: "Adobe Photoshop", proficiency: 7, experience: 2.5, category: "tools", description: "Photo editing, compositing, and digital painting" }
        ];

        // Set up dimensions and margins with expanded width
        const margin = { top: 50, right: 100, bottom: 70, left: 70 };
        const width = 1000 - margin.left - margin.right; // Increased width
        const height = 500 - margin.top - margin.bottom;

        // Create SVG
        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create scales
        const xScale = d3.scaleLinear()
            .domain([4, 10])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0.5, 3.5])
            .range([height, 0]);

        // Color scale for categories
        const colorScale = d3.scaleOrdinal()
            .domain(["Creative Technology", "design", "Animation", "tools"])
            .range(["#3498db", "#e74c3c", "#2ecc71", "#f39c12"]);

        // Create axes
        const xAxis = d3.axisBottom(xScale)
            .ticks(6)
            .tickFormat(d => d === 10 ? "Expert" : d === 4 ? "Intermediate" : d);

        const yAxis = d3.axisLeft(yScale)
            .ticks(7)
            .tickFormat(d => d === 0.5 ? "0.5 years" : d === 3.5 ? "3.5+ years" : `${d} years`);

        // Add X axis
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", 40)
            .attr("text-anchor", "middle")
            .text("Proficiency Level");

        // Add Y axis
        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .text("Years of Experience");

        // Add chart title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .style("fill", "#2c3e50")
            .text("Design & Creative Skills Matrix");

        // Create tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Function to add slight jitter to prevent overlapping
        function addJitter(data, jitterAmount = 0.15) {
            return data.map(d => {
                const skillId = d.skill.split(' ').join('').toLowerCase();
                const seed = skillId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
                
                const jitterX = (Math.sin(seed) * jitterAmount);
                const jitterY = (Math.cos(seed) * jitterAmount);
                
                return {
                    ...d,
                    proficiency: Math.max(4, Math.min(10, d.proficiency + jitterX)),
                    experience: Math.max(0.5, Math.min(3.5, d.experience + jitterY))
                };
            });
        }

        // Track if animation has been triggered
        let animationTriggered = false;

        // Function to animate points from center
        function animatePointsFromCenter(data) {
            // Remove existing circles and labels
            svg.selectAll(".skill-circle").remove();
            svg.selectAll(".skill-label").remove();
            
            // Add circles for each data point starting from center
            const circles = svg.selectAll(".skill-circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "skill-circle")
                .attr("cx", width / 2) // Start from center
                .attr("cy", height / 2) // Start from center
                .attr("r", 0)
                .style("fill", d => colorScale(d.category))
                .style("opacity", 0)
                .style("stroke", "#fff")
                .style("stroke-width", 2);
            
            // Animate circles to their positions
            circles.transition()
                .duration(1000)
                .delay((d, i) => i * 100)
                .attr("cx", d => xScale(d.proficiency))
                .attr("cy", d => yScale(d.experience))
                .attr("r", 8)
                .style("opacity", 0.9);
            
            // Add skill labels with animation
            const labels = svg.selectAll(".skill-label")
                .data(data)
                .enter()
                .append("text")
                .attr("class", "skill-label")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .text(d => d.skill)
                .style("font-size", "10px")
                .style("fill", "#2c3e50")
                .style("text-anchor", "middle")
                .style("opacity", 0);
            
            // Animate labels to their positions
            labels.transition()
                .duration(1000)
                .delay((d, i) => i * 100 + 500)
                .attr("x", d => xScale(d.proficiency))
                .attr("y", d => yScale(d.experience) - 12)
                .style("opacity", 1);
            
            // Add interactivity
            circles.on("mouseover", function(event, d) {
                tooltip
                    .style("opacity", 1)
                    .html(`
                        <strong>${d.skill}</strong><br/>
                        Proficiency: ${Math.round(d.proficiency * 10)/10}/10<br/>
                        Experience: ${Math.round(d.experience * 10)/10} years<br/>
                        Category: ${d.category}<br/>
                        <em>${d.description}</em>
                    `)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 15) + "px");
                
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 12)
                    .style("opacity", 1)
                    .style("filter", "url(#glow)");
            })
            .on("mouseout", function() {
                tooltip
                    .style("opacity", 0);
                
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 8)
                    .style("opacity", 0.9)
                    .style("filter", "none");
            });
        }

        // Function to update the scatter plot based on category filter
        function updateScatterPlot(category, useJitter = true) {
            // Filter data based on category
            let filteredData = category === "all" 
                ? skillsData 
                : skillsData.filter(d => d.category === category);
            
            // Apply jitter to prevent overlapping (only when showing all skills)
            if (useJitter && category === "all") {
                filteredData = addJitter(filteredData, 0.2);
            }
            
            // Animate points from center
            animatePointsFromCenter(filteredData);
        }

        // Add glow filter for hover effect
        const defs = svg.append("defs");
        const filter = defs.append("filter")
            .attr("id", "glow")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");
            
        filter.append("feGaussianBlur")
            .attr("stdDeviation", "3.5")
            .attr("result", "coloredBlur");
            
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "coloredBlur");
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        // Add legend
        const legend = svg.selectAll(".legend")
            .data(colorScale.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${width + 10}, ${i * 20})`);

        legend.append("rect")
            .attr("x", 0)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colorScale);

        legend.append("text")
            .attr("x", 25)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(d => d);

        // Add event listeners to filter buttons
        document.querySelectorAll('.control-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                document.querySelectorAll('.control-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Update chart
                const category = this.getAttribute('data-category');
                updateScatterPlot(category, false);
            });
        });

        // Scroll-triggered animation
        function checkScroll() {
            const element = document.getElementById('scatterplot');
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // If element is in viewport and animation hasn't been triggered yet
            if (elementTop < windowHeight * 0.8 && !animationTriggered) {
                animationTriggered = true;
                updateScatterPlot("all", true);
            }
        }

        // Initial state - show empty chart
        svg.selectAll(".skill-circle").remove();
        svg.selectAll(".skill-label").remove();

        // Add scroll event listener
        window.addEventListener('scroll', checkScroll);
        
        // Check on initial load in case the element is already in view
        checkScroll();