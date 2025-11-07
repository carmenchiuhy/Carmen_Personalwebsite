 (function(){
        const artworkData = [
            { title: "Ocean's Breath", completionDate: "2020-03-15", hoursSpent: 45, type: "Painting" },
            { title: "City at Dusk", completionDate: "2020-07-22", hoursSpent: 60, type: "Painting" },
            { title: "Forest Spirit", completionDate: "2020-11-05", hoursSpent: 80, type: "Sculpture" },
            { title: "Cybernetic Dreams", completionDate: "2021-02-10", hoursSpent: 35, type: "Digital" },
            { title: "Still Life with Lemon", completionDate: "2021-05-19", hoursSpent: 25, type: "Painting" },
            { title: "The Thinker's Echo", completionDate: "2021-09-01", hoursSpent: 120, type: "Sculpture" },
            { title: "Abstract No. 5", completionDate: "2022-01-20", hoursSpent: 55, type: "Painting" },
            { title: "Galactic Voyage", completionDate: "2022-04-11", hoursSpent: 70, type: "Digital" },
            { title: "Portrait of a Friend", completionDate: "2022-08-30", hoursSpent: 40, type: "Painting" },
            { title: "Bronze Eagle", completionDate: "2022-12-15", hoursSpent: 150, type: "Sculpture" },
            { title: "Winter's Slumber", completionDate: "2023-02-28", hoursSpent: 50, type: "Painting" },
            { title: "Neon Alley", completionDate: "2023-06-18", hoursSpent: 65, type: "Digital" },
            { title: "Clay Pot Study", completionDate: "2023-07-05", hoursSpent: 15, type: "Sculpture" },
            { title: "Mountain Majesty", completionDate: "2023-10-25", hoursSpent: 90, type: "Painting" },
            { title: "Future Imperfect", completionDate: "2024-01-15", hoursSpent: 85, type: "Digital" },
            { title: "The Dancer", completionDate: "2024-05-20", hoursSpent: 110, type: "Sculpture" },
            { title: "Sunrise over the Plains", completionDate: "2024-09-10", hoursSpent: 75, type: "Painting" },
            { title: "A.I. Self-Portrait", completionDate: "2024-11-30", hoursSpent: 30, type: "Digital" },
            { title: "Projected Work 1", completionDate: "2025-02-01", hoursSpent: 100, type: "Sculpture" },
        ];

        // --- 2. DATA PARSING ---
        const parseDate = d3.timeParse("%Y-%m-%d");
        artworkData.forEach(d => {
            d.completionDate = parseDate(d.completionDate);
        });

        // --- NEW: STATE MANAGEMENT ---
        // This variable will hold the current filter selection to maintain state on resize.
        let currentFilter = "All";

        // --- NEW: FILTER UI CREATION ---
        const uniqueTypes = ["All", ...new Set(artworkData.map(d => d.type))];
        
        const filterDropdown = d3.select("#filter-dropdown")
            .append("select")
            .attr("id", "type-filter");

        filterDropdown.selectAll("option")
            .data(uniqueTypes)
            .enter()
            .append("option")
            .attr("value", d => d)
            .text(d => d === "All" ? "All Types" : d);

        // --- 3. RESPONSIVE CHART FUNCTION (MODIFIED) ---
        // The function now accepts a 'data' parameter to draw.
        function drawChart(data) {
            // Clear previous SVG to allow for redrawing
            d3.select("#scatterplot").html("");
            // Remove any stray tooltips
            d3.select(".tooltip").remove();

            // --- A. SETUP & DIMENSIONS ---
            const margin = { top: 10, right: 200, bottom: 80, left: 70 };
            
            const container = d3.select("#scatterplot");
            const containerRect = container.node().getBoundingClientRect();
            
            const svgWidth = containerRect.width;
            // A taller aspect ratio to better fit the content
            const svgHeight = Math.max(svgWidth * 0.5, 300); 

            const width = svgWidth - margin.left - margin.right;
            const height = svgHeight - margin.top - margin.bottom;

            if (height < 0 || width < 0) return;

            const svg = container.append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);

            const chartGroup = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            // --- B. SCALES ---
            // **IMPORTANT**: Scales are based on the full artworkData to prevent axes from changing during filtering.
            const xScale = d3.scaleTime()
                .domain(d3.extent(artworkData, d => d.completionDate))
                .range([0, width])
                .nice();

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(artworkData, d => d.hoursSpent)])
                .range([height, 0])
                .nice();
            
            const allUniqueTypes = [...new Set(artworkData.map(d => d.type))];
            const colorScale = d3.scaleOrdinal()
                .domain(allUniqueTypes)
                .range(d3.schemeCategory10);

            // --- C. AXES ---
            const xAxis = d3.axisBottom(xScale).ticks(d3.timeYear.every(1));
            chartGroup.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-45)");

            chartGroup.append("text")
                .attr("class", "axis-label")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom - 15)
                .attr("text-anchor", "middle")
                .text("Completion Date");
                
            const yAxis = d3.axisLeft(yScale);
            chartGroup.append("g")
                .call(yAxis);

            chartGroup.append("text")
                .attr("class", "axis-label")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 20)
                .attr("text-anchor", "middle")
                .text("Hours Spent");

            // --- D. TOOLTIP ---
            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip");

            // --- E. DRAW CIRCLES ---
            // Circles are drawn using the filtered 'data' passed to the function.
            // We use an update pattern to handle transitions smoothly.
            const circles = chartGroup.selectAll("circle")
                .data(data, d => d.title); // Use a key function for object constancy

            // Exit: remove old circles
            circles.exit()
                .transition().duration(300)
                .attr("r", 0)
                .remove();

            // Enter: add new circles
            circles.enter()
                .append("circle")
                .attr("cx", d => xScale(d.completionDate))
                .attr("cy", d => yScale(d.hoursSpent))
                .attr("r", 0) // Start with radius 0 for entry animation
                .attr("fill", d => colorScale(d.type))
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
                .style("cursor", "pointer")
                .on("mouseover", function(event, d) {
                    d3.select(this)
                        .transition()
                        .duration(150)
                        .attr("r", 10)
                        .style("opacity", 1);
                    
                    tooltip.style("visibility", "visible")
                           .html(`<strong>${d.title}</strong><br/>
                                  Type: ${d.type}<br/>
                                  Hours: ${d.hoursSpent}<br/>
                                  Date: ${d3.timeFormat("%b %d, %Y")(d.completionDate)}`);
                })
                .on("mousemove", function(event) {
                    tooltip.style("top", (event.pageY - 10) + "px")
                           .style("left", (event.pageX + 10) + "px");
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .transition()
                        .duration(150)
                        .attr("r", 7)
                        .style("opacity", 0.8);
                    
                    tooltip.style("visibility", "hidden");
                })
                .transition().duration(500) // Entry transition
                .attr("r", 7)
                .style("opacity", 0.8);

            // --- F. LEGEND ---
            // The legend is static and always shows all possible types.
            const legend = chartGroup.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width + 20}, 0)`);

            legend.selectAll("rect")
                .data(allUniqueTypes)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", (d, i) => i * 25)
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", d => colorScale(d));

            legend.selectAll("text")
                .data(allUniqueTypes)
                .enter()
                .append("text")
                .attr("x", 24)
                .attr("y", (d, i) => i * 25 + 14)
                .text(d => d)
                .attr("fill", "#333");
        }

        // --- NEW: EVENT HANDLING ---
        filterDropdown.on("change", function() {
            // Get the selected value from the dropdown
            const selectedType = d3.select(this).property("value");
            currentFilter = selectedType; // Update the state variable

            let filteredData;
            if (selectedType === "All") {
                filteredData = artworkData;
            } else {
                filteredData = artworkData.filter(d => d.type === selectedType);
            }
            
            // Redraw the chart with the filtered data
            drawChart(filteredData);
        });

        // --- 4. INITIAL DRAW & RESIZE LISTENER (MODIFIED) ---
        
        // Initial call to draw the chart with all data
        drawChart(artworkData);

        // Redraw chart on window resize, respecting the current filter
        window.addEventListener('resize', () => {
            let filteredData;
            if (currentFilter === "All") {
                filteredData = artworkData;
            } else {
                filteredData = artworkData.filter(d => d.type === currentFilter);
            }
            drawChart(filteredData);
        });

    })();