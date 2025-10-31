(function(){

        const visitorData = [
            { country: "United States", visitors: 150, lat: 39.8283, lon: -98.5795 },
            { country: "United Kingdom", visitors: 85, lat: 55.3781, lon: -3.4360 },
            { country: "Germany", visitors: 120, lat: 51.1657, lon: 10.4515 },
            { country: "France", visitors: 95, lat: 46.6034, lon: 1.8883 },
            { country: "Canada", visitors: 65, lat: 56.1304, lon: -106.3468 },
            { country: "Australia", visitors: 70, lat: -25.2744, lon: 133.7751 },
            { country: "Japan", visitors: 110, lat: 36.2048, lon: 138.2529 },
            { country: "Brazil", visitors: 45, lat: -14.2350, lon: -51.9253 },
            { country: "India", visitors: 130, lat: 20.5937, lon: 78.9629 },
            { country: "China", visitors: 160, lat: 35.8617, lon: 104.1954 },
            { country: "South Africa", visitors: 30, lat: -30.5595, lon: 22.9375 },
            { country: "Mexico", visitors: 55, lat: 23.6345, lon: -102.5528 },
            { country: "Spain", visitors: 75, lat: 40.4637, lon: -3.7492 },
            { country: "Italy", visitors: 80, lat: 41.8719, lon: 12.5674 },
            { country: "Netherlands", visitors: 50, lat: 52.1326, lon: 5.2913 },
            { country: "South Korea", visitors: 60, lat: 35.9078, lon: 127.7669 },
            { country: "Singapore", visitors: 40, lat: 1.3521, lon: 103.8198 },
            { country: "Sweden", visitors: 35, lat: 60.1282, lon: 18.6435 },
            { country: "Norway", visitors: 25, lat: 60.4720, lon: 8.4689 },
            { country: "New Zealand", visitors: 20, lat: -40.9006, lon: 174.8860 }
        ];

        // Set up dimensions and margins
        const width = document.getElementById('symbolmap').clientWidth;
        const height = document.getElementById('symbolmap').clientHeight;
        
        // Create SVG container
        const svg = d3.select("#symbolmap")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
            
        // Create a projection for the world map with proper centering
        const projection = d3.geoNaturalEarth1()
            .scale(width / 5.5)
            .translate([width / 2, height / 2]);
            
        // Create a path generator
        const path = d3.geoPath().projection(projection);
        
        // Load world map data
        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(function(world) {
            // Draw the world map
            const countries = topojson.feature(world, world.objects.countries);
            
            svg.append("g")
                .selectAll("path")
                .data(countries.features)
                .enter()
                .append("path")
                .attr("class", "country")
                .attr("d", path);
                
            // Add symbols for visitor data
            const maxVisitors = d3.max(visitorData, d => d.visitors);
            const radiusScale = d3.scaleSqrt()
                .domain([0, maxVisitors])
                .range([8, 35]); // Increased the size range
                
            // Create symbols for each country with visitors
            const symbols = svg.selectAll(".symbol")
                .data(visitorData)
                .enter()
                .append("circle")
                .attr("class", "symbol")
                .attr("cx", d => projection([d.lon, d.lat])[0])
                .attr("cy", d => projection([d.lon, d.lat])[1])
                .attr("r", d => radiusScale(d.visitors))
                .on("mouseover", function(event, d) {
                    // Show tooltip on hover
                    d3.select(".tooltip")
                        .style("opacity", 1)
                        .html(`<strong>${d.country}</strong><br>Visitors: ${d.visitors}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    // Hide tooltip
                    d3.select(".tooltip").style("opacity", 0);
                });
                
            // Update stats
            function updateStats() {
                const totalVisitors = visitorData.reduce((sum, country) => sum + country.visitors, 0);
                document.getElementById('totalVisitors').textContent = totalVisitors;
                document.getElementById('activeCountries').textContent = visitorData.length;
            }
            
            // Function to simulate real-time updates
            function updateVisitors() {
                // Randomly update visitor counts
                visitorData.forEach(country => {
                    // 70% chance to increase visitors by 1-5
                    if (Math.random() < 0.7) {
                        country.visitors += Math.floor(Math.random() * 5) + 1;
                    }
                    // 10% chance to add a new visitor to a random country
                    if (Math.random() < 0.1) {
                        const randomCountry = visitorData[Math.floor(Math.random() * visitorData.length)];
                        randomCountry.visitors += 1;
                    }
                });
                
                // Update the symbols
                svg.selectAll(".symbol")
                    .data(visitorData)
                    .transition()
                    .duration(1000)
                    .attr("r", d => radiusScale(d.visitors));
                    
                // Update stats
                updateStats();
                    
                // Schedule next update
                setTimeout(updateVisitors, 2000);
            }
            
            // Initial stats update
            updateStats();
            
            // Start the updates
            updateVisitors();
        }).catch(function(error) {
            console.error("Error loading world map data:", error);
            // Fallback: Create a simple grid with just the symbols
            const fallbackGroup = svg.append("g");
            
            // Add symbols for visitor data
            const maxVisitors = d3.max(visitorData, d => d.visitors);
            const radiusScale = d3.scaleSqrt()
                .domain([0, maxVisitors])
                .range([8, 35]);
                
            // Create symbols for each country with visitors
            fallbackGroup.selectAll(".symbol")
                .data(visitorData)
                .enter()
                .append("circle")
                .attr("class", "symbol")
                .attr("cx", (d, i) => 50 + (i % 5) * 150)
                .attr("cy", (d, i) => 100 + Math.floor(i / 5) * 120)
                .attr("r", d => radiusScale(d.visitors))
                .on("mouseover", function(event, d) {
                    d3.select(".tooltip")
                        .style("opacity", 1)
                        .html(`<strong>${d.country}</strong><br>Visitors: ${d.visitors}`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    d3.select(".tooltip").style("opacity", 0);
                });
                
            // Start updates even without map
            function updateVisitors() {
                visitorData.forEach(country => {
                    if (Math.random() < 0.7) {
                        country.visitors += Math.floor(Math.random() * 5) + 1;
                    }
                });
                
                fallbackGroup.selectAll(".symbol")
                    .data(visitorData)
                    .transition()
                    .duration(1000)
                    .attr("r", d => radiusScale(d.visitors));
                    
                updateStats();
                setTimeout(updateVisitors, 2000);
            }
            
            updateStats();
            updateVisitors();
        });



})();