(function(){

(function(){

        const width = 800;
        const height = 600;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        // Create SVG container
        const svg = d3.select("#dotmap")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Create a tooltip
        const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");

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

        // Load and draw the world map
        d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(function(world) {
            // Convert TopoJSON to GeoJSON
            const countries = topojson.feature(world, world.objects.countries);
            
            // Draw countries
            svg.selectAll(".country")
                .data(countries.features)
                .enter()
                .append("path")
                .attr("class", "country")
                .attr("d", path);

            // Add dots for visited cities
            svg.selectAll(".visited-dot")
                .data(visitedCities)
                .enter()
                .append("circle")
                .attr("class", "visited-dot")
                .attr("r", 6)
                .attr("cx", d => projection([d.lon, d.lat])[0])
                .attr("cy", d => projection([d.lon, d.lat])[1])
                .on("mouseover", function(event, d) {
                    tooltip
                        .style("opacity", 1)
                        .html(d.name)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 20) + "px");
                })
                .on("mouseout", function() {
                    tooltip.style("opacity", 0);
                });

   

           

            // Add title
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", 20)
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .style("font-weight", "bold")
                .text("My Travels in Asia");
        }).catch(function(error) {
            console.error("Error loading the map data:", error);
            // Fallback: draw dots even if map fails to load
            visitedCities.forEach(city => {
                const coords = projection([city.lon, city.lat]);
                svg.append("circle")
                    .attr("class", "visited-dot")
                    .attr("r", 6)
                    .attr("cx", coords[0])
                    .attr("cy", coords[1]);
            });
        });



})();


})();