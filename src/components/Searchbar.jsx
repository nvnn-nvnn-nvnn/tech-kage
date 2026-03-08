// Add partType as a prop parameter
function Searchbar({ partType }) {

    // Define the T theme constant
    const T = {
        card: "#0D0F14",
        border: "rgba(255,255,255,0.08)",
        text: "#f0f0f2",
    };

    // Map part types to proper display names
    const partTypeNames = {
        "cpu": "CPUs",
        "cpu-cooler": "CPU Coolers",
        "motherboard": "Motherboards",
        "memory": "Memory",
        "storage": "Storage Drives",
        "internal-hard-drive": "Storage Drives",
        "videocard": "Video Cards",
        "video-card": "Video Cards",
        "case": "Cases",
        "powersupply": "Power Supplies",
        "psu": "Power Supplies",
    };

    const displayName = partTypeNames[partType] || partType;

    return (
        <div>
            <input
                type="text"
                placeholder={`Search ${displayName}...`}
                style={{
                    width: "100%",
                    padding: "0.5rem",
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: "5px",
                    color: T.text
                }}
            />
        </div>
    );
}

export default Searchbar;