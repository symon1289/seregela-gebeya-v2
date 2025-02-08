import { useEffect, useState } from "react";

type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl";

const useScreenSize = (): ScreenSize => {
    const [screenSize, setScreenSize] = useState<ScreenSize>("lg");

    const updateScreenSize = () => {
        const width = window.innerWidth;

        if (width < 640) {
            setScreenSize("xs");
        } else if (width < 768) {
            setScreenSize("sm");
        } else if (width < 1024) {
            setScreenSize("md");
        } else if (width < 1280) {
            setScreenSize("lg");
        } else {
            setScreenSize("xl");
        }
    };

    useEffect(() => {
        updateScreenSize();
        window.addEventListener("resize", updateScreenSize);

        return () => window.removeEventListener("resize", updateScreenSize);
    }, []);

    return screenSize;
};

export default useScreenSize;
