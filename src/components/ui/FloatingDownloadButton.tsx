"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { Button } from "./button";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast";

interface FloatingDownloadButtonProps {
  data: Array<Record<string, string | number | boolean | null | undefined>>;
  filename: string;
  headers?: Array<{ label: string; key: string }>;
  pdfTitle?: string;
  pageName?: string; // New prop for dynamic page name
  className?: string;
  columnVisibility?: Record<string, boolean | undefined>; // New prop for column visibility
}

export const FloatingDownloadButton: React.FC<FloatingDownloadButtonProps> = ({
  data,
  filename,
  headers,
  pdfTitle,
  pageName,
  className = "",
  columnVisibility,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Generate dynamic title based on page name
  const dynamicTitle = pageName
    ? `${pageName} Report`
    : pdfTitle || `${filename} Report`;

  // Generate CSV headers automatically if not provided
  const csvHeaders =
    headers ||
    (data.length > 0
      ? Object.keys(data[0])
          .filter((key) => !columnVisibility || columnVisibility[key] !== false)
          .map((key) => ({ label: key, key }))
      : []);

  // Generate PDF headers (exclude Arabic columns)
  const pdfHeaders = csvHeaders.filter((header) => !header.key.includes("_ar"));

  // Filter data based on column visibility
  const getVisibleData = () => {
    if (!columnVisibility) return data;

    return data.map((row) => {
      const filteredRow: Record<
        string,
        string | number | boolean | null | undefined
      > = {};
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
  const formatValue = (
    value: string | number | boolean | null | undefined
  ): string => {
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
  const formatPhoneNumber = (
    phone: string | number | boolean | null | undefined
  ): string => {
    if (!phone) return "";
    const cleanPhone = formatValue(phone);
    // Add + prefix if it's a valid phone number (all digits and reasonable length)
    if (cleanPhone && /^\d+$/.test(cleanPhone) && cleanPhone.length >= 8) {
      return `+${cleanPhone}`;
    }
    return cleanPhone;
  };

  // Generate PDF with proper table formatting
  const generatePDF = async () => {
    try {
      const pdf = new jsPDF("l", "mm", "a4"); // Landscape orientation for better table fit

      // Set encoding for UTF-8 support
      pdf.setFont("helvetica");

      // Add logo
      try {
        // Create an image element to load the logo
        const img = new Image();
        img.crossOrigin = "anonymous";

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = "/images/logo.png";
        });

        // Add logo to PDF (top-left corner)
        const logoWidth = 30;
        const logoHeight = 20;
        pdf.addImage(img, "PNG", 10, 5, logoWidth, logoHeight);
      } catch (error) {
        console.warn("Could not load logo:", error);
        // Continue without logo if it fails to load
      }

      // Add title (moved down to make room for logo)
      pdf.setFontSize(18);
      pdf.text(dynamicTitle, 50, 15);

      // Add date and page info
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 22);
      pdf.text(`Page data: ${visibleData.length} rows displayed`, 50, 28);

      // Table configuration
      const startY = 35;
      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 10;
      const tableWidth = pageWidth - margin * 2;
      const colWidth = tableWidth / pdfHeaders.length;
      const rowHeight = 8;

      let currentY = startY;

      // Draw table headers
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");

      // Header background
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, currentY - 2, tableWidth, rowHeight, "F");

      // Header borders
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(margin, currentY - 2, tableWidth, rowHeight);

      pdfHeaders.forEach((header, index) => {
        const x = margin + index * colWidth;
        pdf.text(header.label, x + 2, currentY + 4);

        // Vertical lines
        if (index > 0) {
          pdf.line(x, currentY - 2, x, currentY + rowHeight - 2);
        }
      });

      currentY += rowHeight + 2;

      // Draw data rows
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);

      for (let rowIndex = 0; rowIndex < processedData.length; rowIndex++) {
        const row = processedData[rowIndex];
        // Check if we need a new page
        if (currentY + rowHeight > pageHeight - 20) {
          pdf.addPage();

          // Add logo to new page
          try {
            const img = new Image();
            img.crossOrigin = "anonymous";
            await new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve; // Continue even if logo fails
              img.src = "/images/logo.png";
            });
            pdf.addImage(img, "PNG", 10, 5, 30, 20);
          } catch {
            // Continue without logo if it fails
          }

          currentY = 35;

          // Redraw headers on new page
          pdf.setFont("helvetica", "bold");
          pdf.setFillColor(240, 240, 240);
          pdf.rect(margin, currentY - 2, tableWidth, rowHeight, "F");
          pdf.rect(margin, currentY - 2, tableWidth, rowHeight);

          pdfHeaders.forEach((header, index) => {
            const x = margin + index * colWidth;
            pdf.text(header.label, x + 2, currentY + 4);
            if (index > 0) {
              pdf.line(x, currentY - 2, x, currentY + rowHeight - 2);
            }
          });

          currentY += rowHeight + 2;
          pdf.setFont("helvetica", "normal");
        }

        // Row background (alternating)
        if (rowIndex % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(margin, currentY - 2, tableWidth, rowHeight, "F");
        }

        // Row border
        pdf.rect(margin, currentY - 2, tableWidth, rowHeight);

        pdfHeaders.forEach((header, index) => {
          const x = margin + index * colWidth;
          let cellValue = String(row[header.key] || "");

          // Truncate long values to fit in cell
          const maxLength = Math.floor(colWidth / 2.5);
          if (cellValue.length > maxLength) {
            cellValue = cellValue.substring(0, maxLength - 3) + "...";
          }

          pdf.text(cellValue, x + 2, currentY + 4);

          // Vertical lines
          if (index > 0) {
            pdf.line(x, currentY - 2, x, currentY + rowHeight - 2);
          }
        });

        currentY += rowHeight;
      } // End of for loop

      // Save the PDF
      pdf.save(`${filename}.pdf`);
      toast.success("PDF downloaded successfully!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Error generating PDF");
      console.error("PDF generation error:", error);
    }
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

  const handlePDFDownload = async () => {
    try {
      await generatePDF();
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

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
            {/* PDF Download Button */}
            <Button
              size="icon"
              variant="secondary"
              className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl bg-red-500 hover:bg-red-600 text-white border-0"
              onClick={handlePDFDownload}
              title="Download as PDF"
            >
              <FileText className="h-5 w-5" />
            </Button>

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
