'use client'
import * as React from "react"
import { cn } from "@/lib/utils"

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
      className={cn("flex flex-row items-center flex-wrap justify-center gap-1 md:gap-2", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "flex items-center justify-center w-8 h-8 md:w-9 md:h-9 text-sm md:text-base border transition-colors cursor-pointer select-none",
        "py-1.5 px-[7px]",
        "font-family-brandprimary font-medium", 
        "text-color-pagination-color-text", 
        "border-sm", 
        "rounded-pagination-border-radius-default",
        "text-center", 
        isActive
          ? "border-pagination-color-stroke bg-pagination-color-selected" // Active state
          : "bg-neutral-light-100 border-pagination-color-bg", // Inactive state
        className
      )}
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
      className={cn(
        "w-8 h-8 md:w-9 md:h-9 p-2 md:p-2.5",
        "box-border", 
        "rounded-pagination-border-radius-default", 
        "border-pagination-color-stroke", 
        className
      )}
      {...props}
    >
      <img
        src="/LeftArrow.svg"
        alt="Previous"
        className="w-2.5 h-2.5 md:w-3 md:h-3"
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
      className={cn(
        "w-8 h-8 md:w-9 md:h-9 p-2 md:p-2.5",
        "box-border",
        "rounded-pagination-border-radius-default", 
        "border-pagination-color-stroke", 
        className
      )}
      {...props}
    >
      <img
        src="/RightArrow.svg"
        alt="Next"
        className="w-2.5 h-2.5 md:w-3 md:h-3"
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
        "flex items-center justify-center w-8 h-8 md:w-9 md:h-9 text-sm md:text-base",
        "py-1.5 px-[7px]",
        "font-family-brandprimary font-medium",
        "text-color-pagination-color-text",
        className
      )}
      {...props}
    >
      <span>...</span>
      <span className="sr-only">More pages</span>
    </span>
  )
}

function getPaginationItems(currentPage: number, totalPages: number) {
  const items: (number | 'ellipsis')[] = []
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      items.push(i)
    }
  } else {
    items.push(1)
    if (currentPage > 3) {
      items.push('ellipsis')
    }
    if (currentPage === totalPages) {
       items.push(currentPage-2)
    }
    if (currentPage > 2) {
      items.push(currentPage - 1)
    }
    if (currentPage !== 1 && currentPage !== totalPages) {
      items.push(currentPage)
    }
    if (currentPage < totalPages - 1) {
      items.push(currentPage + 1)
    }
     if (currentPage === 1) {
       items.push(currentPage+2)
    }
    if (currentPage < totalPages - 2) {
      items.push('ellipsis')
    }
    items.push(totalPages)
  }
  
  return [...new Set(items)];
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
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrevious} />
        </PaginationItem>

        <div className="flex items-center mx-2 md:mx-4 gap-1 md:gap-2">
          {paginationItems.map((item, index) => (
            <PaginationItem key={`${item}-${index}`}>
              {item === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageClick(item as number)}
                  isActive={currentPage === item}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </div>

        <PaginationItem>
          <PaginationNext onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}