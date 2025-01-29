import React from "react";
import { Link } from "react-router-dom";

interface BreadcrumbProps {
  paths: {
    name: string;
    url: string;
  }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
  return (
    <nav
      aria-label="breadcrumb"
      className="flex px-5 py-3  border border-gray-50 rounded-lg bg-gray-50"
    >
      <ol className="flex items-center space-x-2 text-gray-600">
        <li>
          <Link
            to="/seregela-gebeya-v2"
            className="hover:text-[#e9a83a] inline-flex items-center text-base font-medium  "
          >
            <svg
              className="w-3 h-3 me-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
            Home
          </Link>
        </li>
        {paths.map((path, index) => (
          <React.Fragment key={path.url}>
            <li className="text-gray-400">/</li>
            <li
              className={
                index === paths.length - 1
                  ? "text-black font-semibold sm:line-clamp-1 md:line-clamp-1 line-clamp-2"
                  : " sm:line-clamp-1 md:line-clamp-1 line-clamp-2"
              }
            >
              {index === paths.length - 1 ? (
                <span className="sm:line-clamp-1 md:line-clamp-1 line-clamp-2">
                  {path.name}
                </span>
              ) : (
                <Link
                  to={path.url}
                  className="hover:text-[#e9a83a] sm:line-clamp-1 md:line-clamp-1 line-clamp-2"
                >
                  {path.name}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
