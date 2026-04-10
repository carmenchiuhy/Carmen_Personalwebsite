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

        // Create the matrix
        const matrix = d3.select("#matrix");
        
        // Extract companies and fields
        const companies = nodesData.filter(d => d.type === "company").map(d => d.id);
        const fields = nodesData.filter(d => d.type === "field").map(d => d.id);
        
        // Create header row
        const headerRow = matrix.append("tr");
        headerRow.append("th"); // Empty cell for top-left corner
        
        // Add field headers
        fields.forEach(field => {
            headerRow.append("th")
                .attr("class", "field-header")
                .text(field);
        });
        
        // Create rows for each company
        companies.forEach(company => {
            const row = matrix.append("tr");
            
            // Add company header
            row.append("th")
                .attr("class", "company-header")
                .text(company);
            
            // Add cells for each field
            fields.forEach(field => {
                const cell = row.append("td");
                
                // Check if there's a relationship
                const relationships = linksData.filter(link => 
                    link.source === company && link.target === field
                );
                
                if (relationships.length > 0) {
                    const box = cell.append("div")
                        .attr("class", "relationship-box")
                        .style("background-color", getColorForField(field))
                        .on("mouseover", function(event) {
                            // Show tooltip
                            d3.select("body").append("div")
                                .attr("class", "tooltip")
                                .style("left", (event.pageX + 10) + "px")
                                .style("top", (event.pageY - 10) + "px")
                                .style("opacity", 1)
                                .html(getTooltipContent(company, field, relationships));
                        })
                        .on("mouseout", function() {
                            // Remove tooltip
                            d3.selectAll(".tooltip").remove();
                        });
                    
                    // Add role count if multiple roles
                    if (relationships.length > 1) {
                        box.text(`${relationships.length} roles`);
                        cell.append("div")
                            .attr("class", "role-count")
                            .text(`${relationships.length} roles`);
                    } else {
                        box.text(relationships[0].role.split(' ')[0]);
                    }
                    
                    // Add click functionality
                    box.on("click", function() {
                        showRelationshipDetails(company, field, relationships);
                    });
                }
            });
        });

        // Function to get color for each field
        function getColorForField(field) {
            const colorMap = {
                "Animation": "#2196F3",
                "Web Design": "#4CAF50",
                "UX/UI Design": "#9C27B0",
                "Graphic Design": "#FF9800",
                "Game Development": "#F44336",
                "Event Management": "#607D8B"
            };
            return colorMap[field] || "#4CAF50";
        }

        // Function to generate tooltip content
        function getTooltipContent(company, field, relationships) {
            let content = `<strong>${company} - ${field}</strong><br>`;
            relationships.forEach(rel => {
                content += `• ${rel.role}<br>`;
            });
            return content;
        }

        // Function to show relationship details
        function showRelationshipDetails(company, field, relationships) {
            let details = `Company: ${company}\nField: ${field}\n\nRoles:\n`;
            relationships.forEach(rel => {
                details += `• ${rel.role}\n`;
            });
            alert(details);
        }