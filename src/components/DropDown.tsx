import React, { useState, useRef } from "react";

interface DropDownProps {
    options: string[];
    defaultLabel?: string;
    onSelect?: (selected: string) => void;
    style?: string;
}

const DropDown: React.FC<DropDownProps> = ({
    options,
    defaultLabel = "",
    onSelect,
    style,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div
            className="relative inline-block text-left focus:border-[#e7a334] z-50"
            ref={dropdownRef}
        >
            <button
                aria-label="dropdown"
                onClick={toggleDropdown}
                className={`inline-flex justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#e7a334] ${style}`}
            >
                {selectedItem || defaultLabel}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 ml-2 -mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-2 p-2">
                        {options.map((option, index) => (
                            <button
                                aria-label={option}
                                key={index}
                                onClick={() => {
                                    setSelectedItem(option);
                                    onSelect?.(option);
                                    setIsOpen(false);
                                }}
                                className="block w-full px-4 py-2 mb-1 text-sm text-gray-700 rounded-md bg-white hover:bg-gray-100 text-left"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropDown;
