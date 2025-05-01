import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnVisibility } from "@/app/(dashboard)/users/page";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { User } from "@/types/userTypes";

interface UsersTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  columnVisibility: ColumnVisibility;
  setColumnVisibility: React.Dispatch<React.SetStateAction<ColumnVisibility>>;
  onAddUser: (userData: Partial<User>) => Promise<void>;
}

export const UsersTableHeader: React.FC<UsersTableHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  columnVisibility,
  setColumnVisibility,
  onAddUser,
}) => {
  return (
    <div className="flex items-center justify-between bg-muted dark:bg-background p-4 rounded-md">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="w-full pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <AddUserDialog onAddUser={onAddUser} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={columnVisibility.name}
              onCheckedChange={(value) =>
                setColumnVisibility((prev) => ({ ...prev, name: !!value }))
              }
            >
              Name
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.email}
              onCheckedChange={(value) =>
                setColumnVisibility((prev) => ({ ...prev, email: !!value }))
              }
            >
              Email
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.phone}
              onCheckedChange={(value) =>
                setColumnVisibility((prev) => ({ ...prev, phone: !!value }))
              }
            >
              Phone
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.gender}
              onCheckedChange={(value) =>
                setColumnVisibility((prev) => ({ ...prev, gender: !!value }))
              }
            >
              Gender
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.userType}
              onCheckedChange={(value) =>
                setColumnVisibility((prev) => ({ ...prev, userType: !!value }))
              }
            >
              User Type
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.labels}
              onCheckedChange={(value) =>
                setColumnVisibility((prev) => ({ ...prev, labels: !!value }))
              }
            >
              Labels
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
