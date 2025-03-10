"use client";
import React from "react";
import MiniSearchBar from "@/components/MiniSearchBar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationComponent from "@/components/users/Pagination";
import { Eye, Pencil } from "lucide-react";

const UsersList: React.FC = () => {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="p-4">
        <MiniSearchBar />
      </div>

      <div className="overflow-x-auto flex-grow">
        <Table>
          <TableHeader>
            <TableRow key={1}>
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Phone</TableHead>
              <TableHead className="font-bold">Gender</TableHead>
              <TableHead className="font-bold">User Type</TableHead>
              <TableHead className="font-bold">Labels</TableHead>
              <TableHead className="cursor-pointer w-10">
                <Pencil size={16} />
              </TableHead>
              <TableHead className="cursor-pointer w-10">
                <Eye size={16} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{/* Your data mapping would go here */}</TableBody>
        </Table>
      </div>

      <div className="mt-auto p-4 flex flex-col items-center">
        <PaginationComponent />
      </div>
    </div>
  );
};

export default UsersList;
