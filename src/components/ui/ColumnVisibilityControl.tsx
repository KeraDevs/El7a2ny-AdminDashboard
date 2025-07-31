"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Settings } from "lucide-react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";

interface ColumnVisibilityControlProps {
  columns: Array<{
    key: string;
    label: string;
    visible: boolean;
  }>;
  onToggleColumn: (key: string) => void;
  className?: string;
}

export const ColumnVisibilityControl: React.FC<
  ColumnVisibilityControlProps
> = ({ columns, onToggleColumn, className = "" }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Column Options - Positioned above main button */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-4 min-w-[200px] z-50"
          >
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show/Hide Columns
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {columns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`column-${column.key}`}
                      checked={column.visible}
                      onCheckedChange={() => onToggleColumn(column.key)}
                    />
                    <label
                      htmlFor={`column-${column.key}`}
                      className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer flex-1"
                    >
                      {column.label}
                    </label>
                    {column.visible ? (
                      <Eye className="h-3 w-3 text-green-500" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        title="Column Visibility"
        className="gap-2"
      >
        <Settings className="h-4 w-4" />
        Columns
      </Button>
    </div>
  );
};
