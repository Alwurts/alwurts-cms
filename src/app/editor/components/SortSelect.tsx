"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";
import type { SortOption, SortDirection } from "@/proxies/posts";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

export function SortSelect({ currentSort, currentDirection }: { currentSort: SortOption; currentDirection: SortDirection }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSortChange = (value: SortOption) => {
    const params = new URLSearchParams();
    params.set("sort", value);
    params.set("direction", currentDirection);
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleDirection = () => {
    const params = new URLSearchParams();
    params.set("sort", currentSort);
    params.set("direction", currentDirection === "asc" ? "desc" : "asc");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={handleSortChange} defaultValue={currentSort}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="url">URL</SelectItem>
          <SelectItem value="tags">Tags</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={toggleDirection} className="w-[140px]">
        {currentDirection === "asc" ? (
          <>
            <ArrowUp className="mr-2 h-4 w-4" />
            Ascending
          </>
        ) : (
          <>
            <ArrowDown className="mr-2 h-4 w-4" />
            Descending
          </>
        )}
      </Button>
    </div>
  );
}