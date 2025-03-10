import React, { useEffect, useRef, useState } from "react";
import { useTag } from "../../../hooks/useTags";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface SubcategoryListProps {
    categoryId?: string;
    activeSubcategoryId?: string;
}

const TagsDropDown: React.FC<SubcategoryListProps> = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
        null
    );
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setOpen(!open);
    };
    const { tags, isTagsLoading, loadMoreTags, tagsError, hasMoreTags } =
        useTag();

    if (isTagsLoading) {
        return (
            <div className="animate-pulse text-gray-500 py-2">
                {t("loading")}
            </div>
        );
    }

    if (tagsError) {
        return <div className="text-red-500 text-sm">{tagsError}</div>;
    }

    if (tags.length === 0) {
        return (
            <div className="text-gray-500 text-sm">
                {t("no_categories_available")}
            </div>
        );
    }

    return (
        <div
            className="relative  text-left focus:border-[#e7a334] z-[50] overflow-visible"
            ref={dropdownRef}
        >
            <button
                aria-label="dropdown"
                onClick={toggleDropdown}
                className={`w-full relative inline-flex justify-between px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#e7a334] `}
            >
                <span className="inline  pr-2">{t("Select Category")}</span>
                <span className="flex items-center gap-2 justify-between">
                    {activeCategoryId}
                    <ChevronDown
                        className="h-4 w-4 transition-transform duration-200"
                        style={{
                            transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                    />
                </span>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-full min-w-[150px]  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-2 p-2">
                        {tags.map((option, index) => (
                            <button
                                aria-label={option.name ?? undefined}
                                key={index}
                                onClick={() => {
                                    navigate(`/tags/${option.id}/packages`);
                                    setActiveCategoryId(option.name);
                                    toggleDropdown();
                                }}
                                className={`block w-full px-4 py-2 mb-1 text-sm text-gray-700 rounded-md bg-white hover:bg-gray-100 text-left ${
                                    option.name === activeCategoryId
                                        ? "bg-gray-50 font-medium text-primary"
                                        : ""
                                }`}
                            >
                                {option.name}
                            </button>
                        ))}
                        {hasMoreTags && (
                            <button
                                onClick={() => loadMoreTags()}
                                className="w-full text-center text-sm text-primary hover:text-secondary"
                            >
                                {t("loadMore")}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TagsDropDown;
