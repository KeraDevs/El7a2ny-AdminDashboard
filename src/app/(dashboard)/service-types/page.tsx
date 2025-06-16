"use client";
import { ServiceTypesTable } from "@/components/service-types/ServiceTypesTable";
import { ServiceTypesTableHeader } from "@/components/service-types/ServiceTypesTableHeader";
import { Card } from "@/components/ui/card";
import { ServiceType } from "@/types/serviceTypes";
import { motion } from "framer-motion";
import React, { useState } from "react";

const ServiceTypesPage = ({
  ServiceTypes,
}: {
  ServiceTypes: ServiceType[];
}) => {
  const totalServiceTypes = ServiceTypes.length;
  return (
    <div
      className="container mx-auto p-4 space-y-4 overflow-y-auto"
      style={{ scrollbarGutter: "stable" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Service Types Management
          </h1>
          <p className="text-muted-foreground">
            Manage your service types effectively.
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <Card className="overflow-hidden">
          <ServiceTypesTableHeader
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onAddNew={() => setIsAddDialogOpen(true)}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <ServiceTypesTable
            searchTerm={searchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder}
            currentPage={currentPage}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            onPageChange={setCurrentPage}
          />
          <div>ServiceTypes Pagination</div>
        </Card>
        {/* Dialogs */}
        <div>
          <div>Add ServiceType Dialog</div>
          <div>Edit ServiceType Dialog</div>
          <div>View ServiceType Dialog</div>
          <div>Delete ServiceType Dialog</div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceTypesPage;
