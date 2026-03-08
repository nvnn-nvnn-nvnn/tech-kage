import { useParams } from "react-router-dom";
import CPU from "../../parts/CPU";
import CPUCooler from "../../parts/cpu-cooler";
import Motherboard from "../../parts/motherboard";
import Memory from "../../parts/memory";
import InternalHardDrive from "../../parts/internal-hard-drive";
import VideoCard from "../../parts/video-card";
import Case from "../../parts/case";
import PSU from "../../parts/powersupply";



// PartsList will contain the parts information. 
// Each part will have a name, where it can be bought, availability, price, promo, shipping, tax, and a link to the product page.

export default function PartsPage() {
    const { category } = useParams();

    // Map category to component
    const componentMap = {
        "cpu": <CPU />,
        "cpu-cooler": <CPUCooler />,
        "motherboard": <Motherboard />,
        "memory": <Memory />,
        "storage": <InternalHardDrive />,
        "internal-hard-drive": <InternalHardDrive />,
        "videocard": <VideoCard />,
        "video-card": <VideoCard />,
        "case": <Case />,
        "powersupply": <PSU />,
    };

    // Render the component for the category, or show error if not found
    return componentMap[category] || (
        <div style={{ minHeight: "100vh", background: "#050608", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h1>Category "{category}" not found</h1>
        </div>
    );
}