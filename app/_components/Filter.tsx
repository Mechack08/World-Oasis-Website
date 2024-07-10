"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

type Filter = "all" | "small" | "medium" | "large";

export default function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedParam = searchParams.get("capacity") ?? "all";

  function handleFilter(filter: Filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="border border-primary-800 flex">
      <Button
        filter="all"
        isActive={selectedParam === "all"}
        handleFilter={handleFilter}
      >
        All cabins
      </Button>
      <Button
        filter="small"
        isActive={selectedParam === "small"}
        handleFilter={handleFilter}
      >
        1&mdash;3 guests
      </Button>
      <Button
        filter="medium"
        isActive={selectedParam === "medium"}
        handleFilter={handleFilter}
      >
        4&mdash;7 guests
      </Button>
      <Button
        filter="large"
        isActive={selectedParam === "large"}
        handleFilter={handleFilter}
      >
        8&mdash;12 guests
      </Button>
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  filter: Filter;
  handleFilter: (filter: Filter) => void;
  isActive: boolean;
}
function Button({ children, isActive, filter, handleFilter }: ButtonProps) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${
        isActive ? "bg-primary-700" : ""
      }`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}
