import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DeployButton = ({ projectId }) => {
    const navigate = useNavigate();

    const handleDeploy = () => {
        if (!projectId) {
            console.error("Project ID is missing");
            return;
        }

        navigate("/deployment", { state: { projectId } });
    };

    return (
        <button
            onClick={handleDeploy}
            disabled={!projectId}
            title={!projectId ? "Project is not ready to deploy" : undefined}
            className="
                flex
                items-center
                gap-2
                px-5
                py-2.5
                bg-[#34170A]
                hover:bg-[#A35100]
                disabled:opacity-60
                disabled:cursor-not-allowed
                text-[#FDF3E4]
                rounded-xl
                text-[10px]
                font-bold
                uppercase
                tracking-[0.15em]
                transition-all
                active:scale-95
                shadow-md
                shrink-0
            "
        >
            <Zap
                size={14}
                fill="currentColor"
            />

            <span>
                Deploy Vision
            </span>
        </button>
    );
};

export default DeployButton;