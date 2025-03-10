import React from "react";
import { Grid, List } from "lucide-react";

type ViewMode = "grid" | "list";

interface ViewToggleProps {
    activeView: ViewMode;
    onChange: (view: ViewMode) => void;
    className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
    activeView,
    onChange,
    className,
}) => {
    return (
        <div className={`flex rounded-md border ml-auto ${className || ""}`}>
            <button
                className={`flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    activeView === "grid"
                        ? "bg-primary text-white hover:bg-white hover:text-primary border-primary"
                        : ""
                }`}
                onClick={() => onChange("grid")}
                aria-label="Grid View"
            >
                <Grid className="h-5 w-5" />
            </button>
            <button
                className={`flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    activeView === "list"
                        ? "bg-primary text-white hover:bg-white hover:text-primary border-primary"
                        : ""
                }`}
                onClick={() => onChange("list")}
                aria-label="List View"
            >
                <List className="h-5 w-5" />
            </button>
        </div>
    );
};

export default ViewToggle;
