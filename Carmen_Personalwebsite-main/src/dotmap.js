(function(){
    const width = 800;
    const height = 600;

    // Create SVG container
    const svg = d3.select("#dotmap")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid #ccc")
        .style("background", "#f8f8f8")
        .style("cursor", "grab");

    // Create a group for all zoomable content
    const g = svg.append("g");

    // Create a tooltip
    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "rgba(255, 255, 255, 0.9)")
        .style("padding", "8px 12px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("z-index", 1000);

    // Define projection to focus on Asia
    const projection = d3.geoMercator()
        .scale(350)
        .center([100, 30])
        .translate([width / 2, height / 2]);

    // Create path generator
    const path = d3.geoPath().projection(projection);

    // Define visited cities with coordinates
    const visitedCities = [
        { name: "Hong Kong", lat: 22.3193, lon: 114.1694 },
        { name: "Shenzhen", lat: 22.5431, lon: 114.0579 },
        { name: "Guangzhou", lat: 23.1291, lon: 113.2644 },
        { name: "Shanghai", lat: 31.2304, lon: 121.4737 },
        { name: "Hangzhou", lat: 30.2741, lon: 120.1551 },
        { name: "Kyoto, Japan", lat: 35.0116, lon: 135.7681 },
        { name: "Nara, Japan", lat: 34.6851, lon: 135.8048 }
    ];

    // Set up zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.5, 20])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    // Apply zoom to the SVG
    svg.call(zoom);

    // Load and draw the world map
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(function(world) {
        // Convert TopoJSON to GeoJSON
        const countries = topojson.feature(world, world.objects.countries);
        
        // Draw countries
        g.selectAll(".country")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("d", path)
            .style("fill", "#e6f3ff")
            .style("stroke", "#999")
            .style("stroke-width", "0.5px")
            .style("pointer-events", "none"); // Prevent countries from blocking zoom

        // Add dots for visited cities
        const dots = g.selectAll(".visited-dot")
            .data(visitedCities)
            .enter()
            .append("circle")
            .attr("class", "visited-dot")
            .attr("r", 6)
            .attr("cx", d => {
                const coords = projection([d.lon, d.lat]);
                return coords ? coords[0] : width/2;
            })
            .attr("cy", d => {
                const coords = projection([d.lon, d.lat]);
                return coords ? coords[1] : height/2;
            })
            .style("fill", "#e74c3c")
            .style("stroke", "#c0392b")
            .style("stroke-width", "2px")
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 8)
                    .style("fill", "#ff6b6b");
                
                tooltip
                    .style("opacity", 1)
                    .html(`${d.name}`)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 35) + "px");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 6)
                    .style("fill", "#e74c3c");
                tooltip.style("opacity", 0);
            });

        // Add cursor style for dragging
        svg.on("mousedown", () => {
            svg.style("cursor", "grabbing");
        });

        svg.on("mouseup", () => {
            svg.style("cursor", "grab");
        });

        // Add title (outside the zoom group so it stays fixed)
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 25)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .style("fill", "#2c3e50")
            .style("pointer-events", "none")
            .text("My Travels in Asia");

        // Add instructions
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 15)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#7f8c8d")
            .style("pointer-events", "none")
            .text("Use mouse wheel to zoom • Click and drag to pan");

    }).catch(function(error) {
        console.error("Error loading the map data:", error);
        // Fallback: create a simple background
        g.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "#ecf0f1");

        // Draw dots even if map fails to load
        visitedCities.forEach(city => {
            const coords = projection([city.lon, city.lat]);
            if (coords) {
                g.append("circle")
                    .attr("class", "visited-dot")
                    .attr("r", 6)
                    .attr("cx", coords[0])
                    .attr("cy", coords[1])
                    .style("fill", "#e74c3c")
                    .style("stroke", "#c0392b")
                    .style("stroke-width", "2px");
            }
        });
    });

})();