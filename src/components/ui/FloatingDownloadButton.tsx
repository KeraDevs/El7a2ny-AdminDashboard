"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "./button";
import { CSVLink } from "react-csv";
import { toast } from "react-hot-toast";

type CsvDataRow = Record<string, string | number | boolean | null | undefined>;
type CsvValue = string | number | boolean | null | undefined;

interface FloatingDownloadButtonProps {
  data: Array<CsvDataRow>;
  filename: string;
  headers?: Array<{ label: string; key: string }>;
  className?: string;
  columnVisibility?: Record<string, boolean | undefined>;
}

export const FloatingDownloadButton: React.FC<FloatingDownloadButtonProps> = ({
  data,
  filename,
  headers,
  className = "",
  columnVisibility,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate CSV headers automatically if not provided
  const csvHeaders =
    headers ||
    (data.length > 0
      ? Object.keys(data[0])
          .filter((key) => !columnVisibility || columnVisibility[key] !== false)
          .map((key) => ({ label: key, key }))
      : []);

  // Filter data based on column visibility
  const getVisibleData = () => {
    if (!columnVisibility) return data;

    return data.map((row) => {
      const filteredRow: Record<string, CsvValue> = {};
      Object.keys(row).forEach((key) => {
        if (columnVisibility[key] !== false) {
          filteredRow[key] = row[key];
        }
      });
      return filteredRow;
    });
  };

  const visibleData = getVisibleData();

  // Helper function to format numbers properly
  const formatValue = (value: CsvValue): string => {
    if (value === null || value === undefined) return "";

    // Convert to string first
    const strValue = String(value);

    // Check if it's a large number that might be in scientific notation
    if (
      typeof value === "number" &&
      (value > 999999999 || strValue.includes("E"))
    ) {
      // Convert back to regular number format
      return value.toFixed(0);
    }

    // For scientific notation strings, convert them back
    if (strValue.includes("E") || strValue.includes("e")) {
      const num = parseFloat(strValue);
      if (!isNaN(num)) {
        return num.toFixed(0);
      }
    }

    return strValue;
  };

  // Helper function to format phone numbers with + prefix
  const formatPhoneNumber = (phone: CsvValue): string => {
    if (!phone) return "";
    const cleanPhone = formatValue(phone);
    // Add + prefix if it's a valid phone number (all digits and reasonable length)
    if (cleanPhone && /^\d+$/.test(cleanPhone) && cleanPhone.length >= 8) {
      return `+${cleanPhone}`;
    }
    return cleanPhone;
  };

  // Process data for CSV export with proper formatting
  const processedData = visibleData.map((row) => {
    const processedRow: Record<string, string> = {};
    Object.keys(row).forEach((key) => {
      if (key === "phone") {
        processedRow[key] = formatPhoneNumber(row[key]);
      } else {
        processedRow[key] = formatValue(row[key]);
      }
    });
    return processedRow;
  });

  const handleCSVDownload = () => {
    toast.success(
      "Excel download started! ✅ Full Arabic text support included."
    );
    setIsOpen(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Export Options - Positioned above main button */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-3 mb-4"
          >
            {/* CSV/Excel Download Button */}
            <CSVLink
              data={processedData}
              headers={csvHeaders}
              filename={`${filename}.csv`}
              onClick={handleCSVDownload}
              className="inline-block"
            >
              <Button
                size="icon"
                variant="secondary"
                className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl bg-green-500 hover:bg-green-600 text-white border-0"
                title="Download as Excel (Includes Arabic columns)"
              >
                <FileSpreadsheet className="h-5 w-5" />
              </Button>
            </CSVLink>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Download Button */}
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl bg-blue-600 hover:bg-blue-700 text-white border-0"
        onClick={() => setIsOpen(!isOpen)}
        title="Download Data"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Download className="h-6 w-6" />
        </motion.div>
      </Button>
    </div>
  );
};
