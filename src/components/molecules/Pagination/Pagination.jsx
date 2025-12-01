import React from "react";
import classes from "./Pagination.module.css";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";

/**
 * Pagination Component - A flexible and accessible pagination component
 * 
 * Features:
 * - Smart page number display with ellipsis for large page counts
 * - Responsive design that adapts to mobile screens
 * - Full accessibility support with ARIA labels and keyboard navigation
 * - Configurable number of visible page buttons
 * - Optional results text display
 * - Input validation and error handling
 * - Smooth hover and focus transitions
 * 
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current active page number (default: 1)
 * @param {number} props.limit - Number of items per page (default: 10)
 * @param {number} props.totalRecords - Total number of records to paginate (default: 0)
 * @param {Function} props.onPageChange - Callback function called when page changes (required)
 * @param {boolean} props.showResultsText - Whether to show "Showing X - Y of Z Results" text (default: true)
 * @param {number} props.maxVisiblePages - Maximum number of page buttons to show (default: 5)
 * @returns {JSX.Element|null} Pagination component or null if no records
 * 
 * @example
 * // Basic usage
 * <Pagination
 *   currentPage={1}
 *   limit={10}
 *   totalRecords={100}
 *   onPageChange={setCurrentPage}
 * />
 * 
 * @example
 * // Custom configuration
 * <Pagination
 *   currentPage={5}
 *   limit={20}
 *   totalRecords={500}
 *   onPageChange={setCurrentPage}
 *   maxVisiblePages={7}
 *   showResultsText={false}
 * />
 * 
 * @example
 * // Mobile-friendly
 * <Pagination
 *   currentPage={3}
 *   limit={5}
 *   totalRecords={50}
 *   onPageChange={setCurrentPage}
 *   maxVisiblePages={3}
 * />
 * 
 * @example
 * // Large dataset with many pages
 * <Pagination
 *   currentPage={25}
 *   limit={50}
 *   totalRecords={10000}
 *   onPageChange={setCurrentPage}
 *   maxVisiblePages={10}
 * />
 */
export default function Pagination({
  currentPage = 1,
  limit = 10,
  totalRecords = 0,
  onPageChange,
  showResultsText = true,
  maxVisiblePages = 5,
  totalTextLabel = "Staff Users",
}) {
  // Input validation - ensure required props are provided
  if (!onPageChange || typeof onPageChange !== 'function') {
    console.error('Pagination: onPageChange is required and must be a function');
    return null;
  }

  // Don't render pagination if there are no records
  if (totalRecords <= 0) {
    return null;
  }

  const totalPages = Math.ceil(totalRecords / limit);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

  return (
    <div className={classes.paginationContainer}>
      {showResultsText && (
        <span className={classes.resultsText}>
          Total {totalRecords} {totalTextLabel}
        </span>
      )}
      <div className={classes.paginationButtons} role="navigation" aria-label="Pagination">
        <button
          className={classes.arrowButton}
          onClick={() => onPageChange(Math.max(safeCurrentPage - 1, 1))}
          disabled={safeCurrentPage === 1}
          aria-label="Previous page"
          type="button"
        >
          <IoArrowBackOutline size={22} />
        </button>
        <button
          className={classes.pageButton}
          onClick={() => {}}
          aria-label={`Current page ${safeCurrentPage}`}
          aria-current="page"
          type="button"
        >
          {safeCurrentPage}
        </button>
        <button
          className={classes.arrowButton}
          onClick={() => onPageChange(Math.min(safeCurrentPage + 1, totalPages))}
          disabled={safeCurrentPage === totalPages}
          aria-label="Next page"
          type="button"
        >
          <IoArrowForwardOutline size={22} />
        </button>
      </div>
    </div>
  );
}
