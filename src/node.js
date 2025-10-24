(function() {


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

const linksData = [
    { source: "Caritas Jockey Club Artkids Studio", target: "Animation", role: "Multimedia Production Intern" },
    { source: "Caritas Jockey Club Artkids Studio", target: "Graphic Design", role: "Multimedia Production Intern" },
    { source: "St. James' Settlement", target: "Event Management", role: "Event Intern" },
    { source: "BrainChamp", target: "Game Development", role: "Games Dev & Design Intern" },
    { source: "BrainChamp", target: "Animation", role: "Games Dev & Design Intern" },
    { source: "BrainChamp", target: "Graphic Design", role: "Games Dev & Design Intern" },
    { source: "Pokeguide limited", target: "UX/UI Design", role: "UI / UX Designer" },
    { source: "Pokeguide limited", target: "Web Design", role: "UI / UX Designer" },
    { source: "Pokeguide limited", target: "Animation", role: "Animator" }
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

// Force simulation with boundaries
const simulation = d3.forceSimulation(nodesData)
    .force("link", d3.forceLink(linksData).id(d => d.id).distance(150))
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
    .data(linksData)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke", "#999")
    .attr("stroke-width", 2);

// Draw link labels
const linkLabel = linkGroup.selectAll(".link-label")
    .data(linksData)
    .enter().append("text")
    .attr("class", "link-label")
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .attr("fill", "#666")
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
    .attr("stroke-width", 2);

node.append("text")
    .attr("class", "node-label")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .attr("fill", "#333")
    .text(d => d.id)
    .call(wrap, d => d.type === 'company' ? 100 : 80);

// Tick function with boundary constraints
simulation.on("tick", () => {
    const padding = 60;
    
    // Apply boundaries
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

// Drag functions (keep your existing drag function)
function drag(simulation) {
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

// Wrap function (keep your existing wrap function)
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


