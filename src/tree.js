(function() {
    const flowData = {
        "name": "Creative Skills Ecosystem",
        "children": [
            {
                "name": "Digital Design",
                "children": [
                    {
                        "name": "UI/UX Design",
                        "children": [
                            {"name": "Figma"},
                            {"name": "Adobe XD"},
                            {"name": "Prototyping"},
                            {"name": "User Research"}
                        ]
                    },
                    {
                        "name": "Web Design",
                        "children": [
                            {"name": "Responsive Design"},
                            {"name": "Wireframing"},
                            {"name": "Design Systems"}
                        ]
                    },
                    {
                        "name": "Interaction Design",
                        "children": [
                            {"name": "Microinteractions"},
                            {"name": "Animation Principles"}
                        ]
                    }
                ]
            },
            {
                "name": "3D & Animation",
                "children": [
                    {
                        "name": "3D Modeling",
                        "children": [
                            {"name": "Maya"},
                            {"name": "Blender"},
                            {"name": "ZBrush"}
                        ]
                    },
                    {
                        "name": "Animation",
                        "children": [
                            {"name": "Character Animation"},
                            {"name": "Motion Graphics"},
                            {"name": "Rigging"}
                        ]
                    },
                    {
                        "name": "Rendering",
                        "children": [
                            {"name": "Arnold"},
                            {"name": "VRay"},
                            {"name": "Real-time Rendering"}
                        ]
                    }
                ]
            },
            {
                "name": "Visual Design",
                "children": [
                    {
                        "name": "Graphic Design",
                        "children": [
                            {"name": "Adobe Illustrator"},
                            {"name": "Brand Identity"},
                            {"name": "Typography"}
                        ]
                    },
                    {
                        "name": "Digital Illustration",
                        "children": [
                            {"name": "Procreate"},
                            {"name": "Adobe Fresco"},
                            {"name": "Vector Art"}
                        ]
                    },
                    {
                        "name": "Print Design",
                        "children": [
                            {"name": "Layout Design"},
                            {"name": "Pre-press"}
                        ]
                    }
                ]
            },
            {
                "name": "Photography & Video",
                "children": [
                    {
                        "name": "Photography",
                        "children": [
                            {"name": "Adobe Lightroom"},
                            {"name": "Photoshop"},
                            {"name": "Portrait Photography"},
                            {"name": "Event Coverage"}
                        ]
                    },
                    {
                        "name": "Video Production",
                        "children": [
                            {"name": "Premiere Pro"},
                            {"name": "After Effects"},
                            {"name": "Color Grading"}
                        ]
                    },
                    {
                        "name": "Cinematography",
                        "children": [
                            {"name": "Lighting"},
                            {"name": "Composition"}
                        ]
                    }
                ]
            },
            {
                "name": "Creative Technology",
                "children": [
                    {
                        "name": "Frontend Development",
                        "children": [
                            {"name": "HTML/CSS"},
                            {"name": "JavaScript"},
                            {"name": "React"}
                        ]
                    },
                    {
                        "name": "Creative Coding",
                        "children": [
                            {"name": "p5.js"},
                            {"name": "Processing"},
                            {"name": "Generative Art"}
                        ]
                    },
                    {
                        "name": "XR Development",
                        "children": [
                            {"name": "AR/VR Design"},
                            {"name": "Unity Basics"}
                        ]
                    }
                ]
            }
        ]
    };

    // Setup dimensions
    const margin = { top: 40, right: 120, bottom: 40, left: 120 };
    const container = d3.select("#tree");
    const containerWidth = container.node().getBoundingClientRect().width;
    const containerHeight = 800;

    // Calculate internal dimensions
    const width = Math.max(1000, containerWidth - margin.left - margin.right);
    const height = containerHeight - margin.top - margin.bottom;

    // Append SVG
    const svg = container.append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add gradient definitions
    const defs = svg.append("defs");
    
    const gradient = defs.append("linearGradient")
        .attr("id", "link-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
    
    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#4facfe");
    
    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#00f2fe");

    // Color scale based on depth
    const colorScale = d3.scaleSequential(d3.interpolatePlasma)
        .domain([0, 4]);

    let i = 0;
    const duration = 750;

    // Define the tree layout
    const treemap = d3.tree().size([height, width]);

    // Create hierarchy
    let root = d3.hierarchy(flowData, d => d.children);
    root.x0 = height / 2;
    root.y0 = 0;

    // Update function
    function update(source) {
        const treeData = treemap(root);
        const nodeDepth = 160;
        
        treeData.descendants().forEach(d => { 
            d.y = d.depth * nodeDepth; 
        });

        // ****************** Nodes section ***************************
        const node = svg.selectAll('g.node')
            .data(treeData.descendants(), d => d.id || (d.id = ++i));

        // Enter new nodes
        const nodeEnter = node.enter().append('g')
            .attr('class', d => `node node--level-${d.depth} ${d.children ? 'node--internal' : 'node--leaf'} ${d.depth === 0 ? 'node--root' : ''}`)
            .attr("transform", d => `translate(${source.y0},${source.x0})`)
            .on('click', click)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout);

        // Add glow filter for nodes
        const filter = defs.append("filter")
            .attr("id", "glow")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");
            
        filter.append("feGaussianBlur")
            .attr("in", "SourceGraphic")
            .attr("stdDeviation", "3")
            .attr("result", "blur");
            
        filter.append("feMerge")
            .selectAll("feMergeNode")
            .data(["blur", "SourceGraphic"])
            .enter().append("feMergeNode")
            .attr("in", d => d);

        // Add circles with gradients
        nodeEnter.each(function(d) {
            const nodeGradient = defs.append("linearGradient")
                .attr("id", `node-gradient-${d.id}`)
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "100%");
                
            nodeGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", colorScale(d.depth));
                
            nodeGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", d3.color(colorScale(d.depth)).brighter(0.5));
        });

        nodeEnter.append('circle')
            .attr('r', 1e-6)
            .style("fill", d => `url(#node-gradient-${d.id})`)
            .style("stroke", d => d3.color(colorScale(d.depth)).darker(0.5))
            .style("stroke-width", "2px")
            .style("filter", "url(#glow)");

        // Add labels with better styling
        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("x", d => d.children || d._children ? -15 : 15)
            .attr("text-anchor", d => d.children || d._children ? "end" : "start")
            .style("fill", "#2c3e50")
            .style("font-weight", d => d.depth === 0 ? "bold" : "normal")
            .style("font-size", d => Math.max(10, 14 - d.depth * 1.5) + "px")
            .style("font-family", "Arial, sans-serif")
            .text(d => d.data.name);

        // UPDATE nodes
        const nodeUpdate = nodeEnter.merge(node);

        nodeUpdate.transition()
            .duration(duration)
            .attr("transform", d => `translate(${d.y},${d.x})`);

        nodeUpdate.select('circle')
            .attr('r', d => Math.max(6, 12 - d.depth * 1.5))
            .style("fill", d => `url(#node-gradient-${d.id})`)
            .style("stroke", d => d3.color(colorScale(d.depth)).darker(0.5))
            .style("stroke-width", "2px");

        // Remove exiting nodes
        const nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", d => `translate(${source.y},${source.x})`)
            .remove();

        nodeExit.select('circle')
            .attr('r', 1e-6);

        nodeExit.select('text')
            .style('fill-opacity', 1e-6);

        // ****************** Links section ***************************
        const link = svg.selectAll('path.link')
            .data(treeData.links(), d => d.target.id);

        // Enter new links
        const linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', d => {
                const o = { x: source.x0, y: source.y0 };
                return diagonal(o, o);
            })
            .style("fill", "none")
            .style("stroke", d => colorScale(d.source.depth))
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
            .style("stroke-dasharray", "5,5");

        // UPDATE links
        const linkUpdate = linkEnter.merge(link);

        linkUpdate.transition()
            .duration(duration)
            .attr('d', d => diagonal(d.source, d.target))
            .style("stroke", d => colorScale(d.source.depth));

        // Remove exiting links
        link.exit().transition()
            .duration(duration)
            .attr('d', d => {
                const o = { x: source.x, y: source.y };
                return diagonal(o, o);
            })
            .remove();

        // Store old positions
        treeData.descendants().forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // Diagonal generator with smooth curves
        function diagonal(s, d) {
            const curvature = 0.5;
            const sourceX = s.y;
            const sourceY = s.x;
            const targetX = d.y;
            const targetY = d.x;
            
            const midX = (sourceX + targetX) * curvature;
            
            return `M ${sourceX} ${sourceY}
                    C ${midX} ${sourceY},
                      ${midX} ${targetY},
                      ${targetX} ${targetY}`;
        }

        // Interaction functions
        function click(event, d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }

        function mouseover(event, d) {
            // Highlight connected nodes and links
            svg.selectAll('.link')
                .style('opacity', 0.1);
                
            svg.selectAll('.node')
                .style('opacity', 0.3);
                
            // Highlight path to root
            let current = d;
            while (current) {
                d3.selectAll(`.node[id="${current.id}"]`)
                    .style('opacity', 1)
                    .select('circle')
                    .transition()
                    .duration(200)
                    .attr('r', d => Math.max(8, 14 - d.depth * 1.5));
                    
                if (current.parent) {
                    d3.selectAll(`.link[data-target="${current.id}"]`)
                        .style('opacity', 0.8)
                        .style('stroke-width', '3px');
                }
                current = current.parent;
            }
            
            // Highlight direct children
            if (d.children) {
                d.children.forEach(child => {
                    d3.selectAll(`.node[id="${child.id}"]`)
                        .style('opacity', 1);
                        
                    d3.selectAll(`.link[data-target="${child.id}"]`)
                        .style('opacity', 0.8)
                        .style('stroke-width', '3px');
                });
            }
        }

        function mouseout(event, d) {
            // Reset all opacities and sizes
            svg.selectAll('.link')
                .style('opacity', 0.7)
                .style('stroke-width', '2px');
                
            svg.selectAll('.node')
                .style('opacity', 1)
                .select('circle')
                .transition()
                .duration(200)
                .attr('r', d => Math.max(6, 12 - d.depth * 1.5));
        }

        // Add data attributes for targeting
        link.attr('data-target', d => d.target.id);
        node.attr('id', d => d.id);
    }

    // Add background
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "transparent");

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("fill", "#2c3e50")
        .text("Creative Skills Flow Map");

    // Initial render
    update(root);

    // Add zoom capability
    const zoom = d3.zoom()
        .scaleExtent([0.5, 2])
        .on('zoom', (event) => {
            svg.attr('transform', event.transform);
        });

    container.select("svg").call(zoom);

})();