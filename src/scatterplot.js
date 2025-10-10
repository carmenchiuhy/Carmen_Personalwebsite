 // --- 1. MOCK DATA ---
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

        // --- 3. RESPONSIVE CHART FUNCTION ---
        function drawChart() {
            // Clear previous SVG to allow for redrawing
            d3.select("#scatterplot").html("");
            // Remove any stray tooltips
            d3.select(".tooltip").remove();

            // --- A. SETUP & DIMENSIONS ---
            const margin = { top: 10, right: 200, bottom: 80, left: 70 };
            
            const container = d3.select("#scatterplot");
            // Use getBoundingClientRect() to measure the container's width reliably.
            const containerRect = container.node().getBoundingClientRect();
            
            // **CORRECTION**: Calculate height based on the container's width to ensure a consistent aspect ratio.
            // This prevents the height from being 0 on an empty element.
            const svgWidth = containerRect.width;
            const svgHeight = svgWidth * 0.35; // Aspect ratio (e.g., 0.6 means height is 60% of width)

            const width = svgWidth - margin.left - margin.right;
            const height = svgHeight - margin.top - margin.bottom;

            // Ensure height is not negative if the container is too small
            if (height < 0) return;

            // Create the SVG container
            const svg = container.append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight);

            // Create the main chart group, translated by the margins
            const chartGroup = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

            // --- B. SCALES ---
            const xScale = d3.scaleTime()
                .domain(d3.extent(artworkData, d => d.completionDate))
                .range([0, width])
                .nice();

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(artworkData, d => d.hoursSpent)])
                .range([height, 0])
                .nice();

            const uniqueTypes = [...new Set(artworkData.map(d => d.type))];
            const colorScale = d3.scaleOrdinal()
                .domain(uniqueTypes)
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
                .attr("y", height + margin.bottom - 15) // Adjust position
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
            chartGroup.selectAll("circle")
                .data(artworkData)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d.completionDate))
                .attr("cy", d => yScale(d.hoursSpent))
                .attr("r", 7)
                .attr("fill", d => colorScale(d.type))
                .attr("stroke", "#fff")
                .attr("stroke-width", 1.5)
                .style("opacity", 0.8)
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
                });

            // --- F. LEGEND ---
            const legend = chartGroup.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width + 20}, 0)`);

            legend.selectAll("rect")
                .data(uniqueTypes)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", (d, i) => i * 25)
                .attr("width", 18)
                .attr("height", 18)
                .attr("fill", d => colorScale(d));

            legend.selectAll("text")
                .data(uniqueTypes)
                .enter()
                .append("text")
                .attr("x", 24)
                .attr("y", (d, i) => i * 25 + 14)
                .text(d => d)
                .attr("fill", "#333")
                .style("font-size", "14px");
        }

        // --- 4. INITIAL DRAW & RESIZE LISTENER ---
        
        // Initial call to draw the chart
        drawChart();

        // Redraw chart on window resize
        window.addEventListener('resize', drawChart);