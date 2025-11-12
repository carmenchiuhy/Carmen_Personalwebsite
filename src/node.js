(function() {
// Create nodes data
const nodesData = [
    // Companies
    { id: "Caritas Jockey Club Artkids Studio", type: "company" },
    { id: "St. James' Settlement", type: "company" },
    { id: "BrainChamp", type: "company" },
    { id: "Pokeguide limited", type: "company" },

    // Fields
    { id: "Animation", type: "field", group: 1 },
    { id: "Web Design", type: "field", group: 2 },
    { id: "UX/UI Design", type: "field", group: 3 },
    { id: "Graphic Design", type: "field", group: 4 },
    { id: "Game Development", type: "field", group: 5 },
    { id: "Event Management", type: "field", group: 6 }
];

// Create links data with ALL properties - UPDATED CONNECTIONS
const linksData = [
    { 
        source: "Caritas Jockey Club Artkids Studio", 
        target: "Graphic Design", 
        role: "Multimedia Production Intern",
        details: "Designed promotional materials, created visual assets for educational programs"
    },
    { 
        source: "Caritas Jockey Club Artkids Studio", 
        target: "Event Management", 
        role: "Event Coordinator",
        details: "Organized educational workshops and community art events for children"
    },
    { 
        source: "St. James' Settlement", 
        target: "Event Management", 
        role: "Event Intern",
        details: "Coordinated community events, managed logistics for charity functions, organized volunteer activities"
    },
    { 
        source: "St. James' Settlement", 
        target: "Graphic Design", 
        role: "Design Intern",
        details: "Created visual materials for community outreach programs and event promotions"
    },
    { 
        source: "BrainChamp", 
        target: "Game Development", 
        role: "Games Dev & Design Intern",
        details: "Developed educational games using Unity, implemented game mechanics and user interactions"
    },
    { 
        source: "BrainChamp", 
        target: "Graphic Design", 
        role: "Games Dev & Design Intern",
        details: "Designed one-page website with SEN and game elements, created UI assets and visual designs"
    },
    { 
        source: "BrainChamp", 
        target: "Web Design", 
        role: "Web Design Intern",
        details: "Developed responsive educational website with interactive learning modules"
    },
    { 
        source: "Pokeguide limited", 
        target: "UX/UI Design", 
        role: "UI / UX Designer",
        details: "Designed user interfaces for mobile applications, created wireframes and prototypes"
    },
    { 
        source: "Pokeguide limited", 
        target: "Web Design", 
        role: "UI / UX Designer",
        details: "Developed responsive web designs, implemented front-end components and user interactions"
    },
    { 
        source: "Pokeguide limited", 
        target: "Animation", 
        role: "Animator",
        details: "Created motion graphics and animated elements for web and mobile applications"
    }
];

const container = d3.select("#node");
const width = parseInt(container.style("width")) || 800;
const height = parseInt(container.style("height")) || 600;

// Create SVG element
const svg = container.append("svg")
    .attr("class", "node-graph-svg")
    .attr("width", width)
    .attr("height", height);

const color = d3.scaleOrdinal(d3.schemeCategory10);

// Create tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "white")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("padding", "8px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("box-shadow", "0 2px 10px rgba(0,0,0,0.1)")
    .style("max-width", "300px");

// Convert links to use node objects but keep all properties
const linksForViz = linksData.map(link => {
    const sourceNode = nodesData.find(node => node.id === link.source);
    const targetNode = nodesData.find(node => node.id === link.target);
    return {
        source: sourceNode,
        target: targetNode,
        role: link.role,
        details: link.details,
        originalSource: link.source,  // Keep original string IDs for filtering
        originalTarget: link.target
    };
});

// Force simulation
const simulation = d3.forceSimulation(nodesData)
    .force("link", d3.forceLink(linksForViz).id(d => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(d => (d.type === 'company' ? 80 : 50)))
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05));

// Create groups
const linkGroup = svg.append("g").attr("class", "links");
const nodeGroup = svg.append("g").attr("class", "nodes");

// Draw links
const link = linkGroup.selectAll("line")
    .data(linksForViz)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke", "#999")
    .attr("stroke-width", 2)
    .attr("stroke-opacity", 0.6);

// Draw link labels
const linkLabel = linkGroup.selectAll(".link-label")
    .data(linksForViz)
    .enter().append("text")
    .attr("class", "link-label")
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .attr("fill", "#666")
    .style("opacity", 0.7)
    .text(d => d.role);

// Draw nodes
const node = nodeGroup.selectAll(".node")
    .data(nodesData)
    .enter().append("g")
    .attr("class", "node")
    .call(drag(simulation));

node.append("circle")
    .attr("r", d => d.type === 'company' ? 40 : 30)
    .attr("fill", d => d.type === 'company' ? '#ddd' : color(d.group))
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .style("cursor", "pointer");

node.append("text")
    .attr("class", "node-label")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .attr("fill", "#333")
    .style("pointer-events", "none")
    .text(d => d.id)
    .call(wrap, d => d.type === 'company' ? 100 : 80);

// HOVER FUNCTION
node.on("mouseover", function(event, d) {
    // Show tooltip immediately on hover
    tooltip.transition()
        .duration(100)
        .style("opacity", 0.9);
    
    if (d.type === 'company') {
        // SIMPLE FILTERING - Use the original linksData array
        const companyLinks = linksData.filter(link => link.source === d.id);
        
        let tooltipContent = `<strong>${d.id}</strong><br/><br/>`;
        
        if (companyLinks.length > 0) {
            tooltipContent += `<strong>Work Details:</strong><br/><br/>`;
            companyLinks.forEach((link, index) => {
                tooltipContent += `<div style="margin-bottom: 8px;">`;
                tooltipContent += `<strong>${link.target}:</strong><br/>`;
                tooltipContent += `${link.details}`;
                tooltipContent += `</div>`;
            });
        } else {
            tooltipContent += "No work details available";
        }
        
        tooltip.html(tooltipContent);
    } else {
        // For field nodes
        tooltip.html(`<strong>${d.id}</strong><br/>Field: ${d.type}`);
    }
    
    tooltip.style("left", (event.pageX + 10) + "px")
           .style("top", (event.pageY - 28) + "px");

    // Highlight connected nodes and links - use linksForViz for visualization
    const connectedNodeIds = new Set();
    const connectedLinks = linksForViz.filter(link => {
        if (link.source.id === d.id || link.target.id === d.id) {
            connectedNodeIds.add(link.source.id);
            connectedNodeIds.add(link.target.id);
            return true;
        }
        return false;
    });

    // Update link styles
    link
        .style("stroke", l => connectedLinks.includes(l) ? "#ff6b6b" : "#999")
        .style("stroke-width", l => connectedLinks.includes(l) ? 3 : 2)
        .style("stroke-opacity", l => connectedLinks.includes(l) ? 1 : 0.3);

    linkLabel
        .style("opacity", l => connectedLinks.includes(l) ? 1 : 0.2);

    // Update node styles
    node.select("circle")
        .style("fill", n => {
            if (n.id === d.id) return d.type === 'company' ? '#ff6b6b' : color(n.group);
            return connectedNodeIds.has(n.id) ? 
                (n.type === 'company' ? '#ff6b6b' : color(n.group)) : 
                (n.type === 'company' ? '#ddd' : color(n.group));
        })
        .style("opacity", n => connectedNodeIds.has(n.id) ? 1 : 0.3);

    node.select("text")
        .style("opacity", n => connectedNodeIds.has(n.id) ? 1 : 0.3);
})
.on("mousemove", function(event, d) {
    tooltip.style("left", (event.pageX + 10) + "px")
           .style("top", (event.pageY - 28) + "px");
})
.on("mouseout", function(event, d) {
    // Reset all styles
    link
        .style("stroke", "#999")
        .style("stroke-width", 2)
        .style("stroke-opacity", 0.6);

    linkLabel
        .style("opacity", 0.7);

    node.select("circle")
        .style("fill", n => n.type === 'company' ? '#ddd' : color(n.group))
        .style("opacity", 1);

    node.select("text")
        .style("opacity", 1);

    // Hide tooltip
    tooltip.transition()
        .duration(200)
        .style("opacity", 0);
})
.on("click", function(event, d) {
    // Toggle fixed position on click
    d.fx = d.fx ? null : d.x;
    d.fy = d.fy ? null : d.y;
    
    // Update simulation
    simulation.alpha(0.3).restart();
    
    // Visual feedback for fixed nodes
    d3.select(this).select("circle")
        .transition()
        .duration(300)
        .attr("stroke-width", d.fx ? 4 : 2)
        .attr("stroke", d.fx ? "#ff6b6b" : "#fff");
});

// // Add zoom behavior
// const zoom = d3.zoom()
//     .scaleExtent([0.1, 4])
//     .on("zoom", function(event) {
//         linkGroup.attr("transform", event.transform);
//         nodeGroup.attr("transform", event.transform);
//     });

// svg.call(zoom);

// // Double click to reset zoom and pan
// svg.on("dblclick", function() {
//     svg.transition()
//         .duration(750)
//         .call(zoom.transform, d3.zoomIdentity);
// });

// Tick function
simulation.on("tick", () => {
    const padding = 60;
    
    nodesData.forEach(d => {
        d.x = Math.max(padding, Math.min(width - padding, d.x));
        d.y = Math.max(padding, Math.min(height - padding, d.y));
    });

    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    linkLabel
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2);

    node
        .attr("transform", d => `translate(${d.x}, ${d.y})`);
});

// Drag functions
function drag(simulation) {
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

// Wrap function
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1,
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}

})();