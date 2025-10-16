'use client'
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center px-4", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center font-poppins flex-wrap justify-center gap-2 sm:gap-0", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
  style?: React.CSSProperties
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "small",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm text-[#262626] border hover:bg-gray-100 transition-colors cursor-pointer select-none",
        className
      )}
      style={{
        padding: "6px 7px",
        boxSizing: "border-box",
        fontFamily: "var(--font-poppins)",
        fontWeight: 500,
        color: "var(--primitives-color-neutral-contrast-800)",
        borderWidth: "var(--primitives-border-weight-sm)",
        borderColor: isActive
          ? "var(--primitives-color-neutral-light-300)"
          : "white",
        borderRadius: "var(--border-radius-round)",
        backgroundColor: isActive
          ? "var(--primitives-color-neutral-light-200)"
          : "var(--primitives-color-neutral-100)",
        textAlign: "center",
      }}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn("w-7 h-7 sm:w-8 sm:h-8 p-1.5 sm:p-2", className)}
      style={{
        padding: "8px",
        boxSizing: "border-box",
        borderRadius: "var(--border-radius-round)",
        borderColor: "var(--primitives-color-neutral-light-300)",
      }}
      {...props}
    >
      <img
        src="/LeftArrow.svg"
        alt="Previous"
        className="w-[7px] h-[7.5px] sm:w-[8.99px] sm:h-[9px]"
      />
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn("w-7 h-7 sm:w-8 sm:h-8 p-1.5 sm:p-2", className)}
      style={{
        padding: "8px",
        boxSizing: "border-box",
        borderRadius: "var(--border-radius-round)",
        borderColor: "var(--primitives-color-neutral-light-300)",
      }}
      {...props}
    >
      <img
        src="/RightArrow.svg"
        alt="Next"
        className="w-[7px] h-[7.5px] sm:w-[8.99px] sm:h-[9px]"
      />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm text-[#262626]",
        className
      )}
      style={{ padding: "6px 7px" }}
      {...props}
    >
      <span>...</span>
      <span className="sr-only">More pages</span>
    </span>
  )
}

// Generate pagination items based on current page
function getPaginationItems(currentPage: number, totalPages: number) {
  const items: (number | 'ellipsis')[] = []
  
  // Always show first page
  items.push(1)
  
  if (totalPages <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 2; i <= totalPages; i++) {
      items.push(i)
    }
  } else {
    // Complex pagination logic for more than 7 pages
    if (currentPage <= 3) {
      // Near the beginning
      items.push(2, 3, 4, 'ellipsis', totalPages)
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      items.push('ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      // In the middle
      items.push('ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages)
    }
  }
  
  return items
}

export default function PaginationView() {
  const totalPages = 10
  const [currentPage, setCurrentPage] = React.useState(1)

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const paginationItems = getPaginationItems(currentPage, totalPages)

  return (
    <Pagination>
      <PaginationContent className="flex items-center">
        <PaginationItem>
          <PaginationPrevious onClick={handlePrevious} />
        </PaginationItem>

        <div className="flex items-center ml-4 sm:ml-[32px] gap-1 sm:gap-[4px]">
          {paginationItems.map((item, index) => (
            <PaginationItem key={`${item}-${index}`}>
              {item === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageClick(item)}
                  isActive={currentPage === item}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem className="ml-4 sm:ml-[32px]">
          <PaginationNext onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}