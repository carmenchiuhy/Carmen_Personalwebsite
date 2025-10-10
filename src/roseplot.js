 // Data representing creative skills for an art portfolio
        const skillsData = [
            { skill: "UX/UI Design", value: 85, color: "#3498db" },
            { skill: "Graphic Design", value: 92, color: "#2ecc71" },
            { skill: "Illustration", value: 78, color: "#e74c3c" },
            { skill: "Typography", value: 88, color: "#f39c12" },
            { skill: "Brand Identity", value: 82, color: "#9b59b6" },
            { skill: "Web Design", value: 90, color: "#1abc9c" },
            { skill: "Photography", value: 75, color: "#34495e" },
            { skill: "Motion Graphics", value: 70, color: "#e67e22" },
            { skill: "Print Design", value: 80, color: "#16a085" },
            { skill: "3D Modeling", value: 65, color: "#8e44ad" }
        ];

        // Set up dimensions and margins
        const width = 500;
        const height = 500;
        const margin = 40;
        const radius = Math.min(width, height) / 2 - margin;

        // Create SVG element
        const svg = d3.select("#roseplot")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Create scales
        const angleScale = d3.scaleBand()
            .domain(skillsData.map(d => d.skill))
            .range([0, 2 * Math.PI])
            .paddingInner(0.1);

        const radiusScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, radius]);

        // Create arcs
        const arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(d => radiusScale(d.value))
            .startAngle(d => angleScale(d.skill))
            .endAngle(d => angleScale(d.skill) + angleScale.bandwidth())
            .padAngle(0.01)
            .padRadius(radius);

        // Draw the rose plot
        const arcs = svg.selectAll(".arc")
            .data(skillsData)
            .enter()
            .append("path")
            .attr("class", "arc")
            .attr("d", arcGenerator)
            .attr("fill", d => d.color)
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .style("opacity", 0.8)
            .on("mouseover", function(event, d) {
                // Highlight the arc on hover
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .attr("stroke-width", 3);
                
                // Show tooltip
                tooltip
                    .style("opacity", 1)
                    .html(`<strong>${d.skill}</strong><br>Proficiency: ${d.value}%`);
            })
            .on("mousemove", function(event) {
                tooltip
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                // Reset the arc
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style("opacity", 0.8)
                    .attr("stroke-width", 2);
                
                // Hide tooltip
                tooltip.style("opacity", 0);
            });

        // Add labels
        svg.selectAll(".label")
            .data(skillsData)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .attr("transform", d => {
                const angle = angleScale(d.skill) + angleScale.bandwidth() / 2;
                const pos = radiusScale(d.value * 0.8); // Position inside the arc
                return `rotate(${angle * 180 / Math.PI}) translate(${pos}, 0) rotate(${angle > Math.PI ? 180 : 0})`;
            })
            .text(d => d.skill)
            .style("font-size", "11px")
            .style("font-weight", "600")
            .style("fill", "white")
            .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.5)");

        // Create tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "rgba(0, 0, 0, 0.8)")
            .style("color", "white")
            .style("padding", "8px 12px")
            .style("border-radius", "4px")
            .style("font-size", "14px")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("z-index", "10");

        // Create legend
        const legend = d3.select("#legend");
        
        const legendItems = legend.selectAll(".legend-item")
            .data(skillsData)
            .enter()
            .append("div")
            .attr("class", "legend-item");
        
        legendItems.append("div")
            .attr("class", "legend-color")
            .style("background-color", d => d.color);
        
        legendItems.append("span")
            .attr("class", "skill-label")
            .text(d => d.skill);
        
        legendItems.append("span")
            .attr("class", "skill-value")
            .text(d => d.value + "%");