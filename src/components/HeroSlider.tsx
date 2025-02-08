import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useImageAdvert } from "../hooks/useIMageAdvert";

export default function HeroSlider() {
    const { loading, error, filterAdverts } = useImageAdvert();
    const [currentSlide, setCurrentSlide] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const nonPopupAdverts = filterAdverts((advert) => advert.is_popup === 0);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="relative h-[400px] overflow-hidden shadow-lg animate-pulse">
                    <div className="absolute inset-0 bg-gray-200"></div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {[...Array(3)].map((_, index) => (
                            <div
                                key={index}
                                className="w-2 h-2 rounded-full bg-gray-300"
                            ></div>
                        ))}
                    </div>
                </div>
            );
        }

        if (error) return <div>{error}</div>;
        if (nonPopupAdverts.length === 0)
            return <div>No adverts available</div>;

        const handlePrev = () => {
            resetTimeout();
            setCurrentSlide((prev) =>
                prev === 0 ? nonPopupAdverts.length - 1 : prev - 1
            );
        };

        const handleNext = () => {
            resetTimeout();
            setCurrentSlide((prev) =>
                prev === nonPopupAdverts.length - 1 ? 0 : prev + 1
            );
        };

        return (
            <div className="relative group h-[400px] overflow-hidden shadow-lg">
                {nonPopupAdverts.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                            index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <img
                            src={slide.image_path}
                            alt={slide.title}
                            className="w-full h-full object-cover -z-10"
                        />
                    </div>
                ))}

                {nonPopupAdverts.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        >
                            <ChevronRight />
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {nonPopupAdverts.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        resetTimeout();
                                        setCurrentSlide(index);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                        index === currentSlide
                                            ? "bg-[#e7a334]"
                                            : "bg-white"
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        );
    };

    useEffect(() => {
        if (nonPopupAdverts.length > 0) {
            resetTimeout();
            timeoutRef.current = setTimeout(() => {
                setCurrentSlide((prev) =>
                    prev === nonPopupAdverts.length - 1 ? 0 : prev + 1
                );
            }, 3000);

            return () => resetTimeout();
        }
    }, [currentSlide, nonPopupAdverts.length]);

    return renderContent();
}
