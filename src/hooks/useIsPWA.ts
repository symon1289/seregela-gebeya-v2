import { useEffect, useState } from "react";

const useIsPWA = (): boolean => {
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        const checkPWA = () => {
            setIsStandalone(
                window.matchMedia("(display-mode: standalone)").matches ||
                    (navigator as any).standalone // For iOS Safari
            );
        };

        checkPWA();
        window.addEventListener("resize", checkPWA); // Optional: recheck on resize
        return () => window.removeEventListener("resize", checkPWA);
    }, []);

    return isStandalone;
};

export default useIsPWA;
