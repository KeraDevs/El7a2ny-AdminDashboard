# FloatingDownloadButton Component

A reusable React component that provides a floating action button for downloading data as PDF or CSV files.

## Features

- **Floating Design**: Fixed position button that stays visible on screen
- **Dual Export**: Support for both PDF and CSV downloads
- **Animated UI**: Smooth animations for button interactions
- **Tooltip Support**: Helpful tooltips for better UX
- **Customizable**: Configurable filename, headers, and PDF title
- **Auto-format**: Automatically formats data for export

## Installation

Required dependencies:

```bash
pnpm add react-csv jspdf framer-motion lucide-react
pnpm add -D @types/react-csv
```

## Usage

```tsx
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";

// Example usage in a component
<FloatingDownloadButton
  data={users.map((user) => ({
    id: user.id,
    name: user.fullName,
    email: user.email,
    phone: user.phone,
    status: user.isActive ? "Active" : "Inactive",
  }))}
  filename="users-list"
  pdfTitle="Users List Report"
  headers={[
    { label: "ID", key: "id" },
    { label: "Full Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Status", key: "status" },
  ]}
/>;
```

## Props

| Prop        | Type                                  | Required | Description                                  |
| ----------- | ------------------------------------- | -------- | -------------------------------------------- |
| `data`      | `Array<Record<string, any>>`          | ✅       | Array of objects to export                   |
| `filename`  | `string`                              | ✅       | Base filename (without extension)            |
| `headers`   | `Array<{label: string, key: string}>` | ❌       | CSV headers (auto-generated if not provided) |
| `pdfTitle`  | `string`                              | ❌       | Title for PDF document                       |
| `className` | `string`                              | ❌       | Additional CSS classes                       |

## Component Structure

The component consists of:

1. **Main Download Button**: Blue circular button with download icon
2. **PDF Export Button**: Red button with document icon
3. **CSV Export Button**: Green button with spreadsheet icon

## Styling

The component uses Tailwind CSS classes and can be customized by:

- Passing `className` prop for additional styling
- Modifying button colors in the component file
- Adjusting positioning via CSS

## Button Actions

- **Main Button**: Toggles the export options menu
- **PDF Button**: Generates and downloads PDF using jsPDF
- **CSV Button**: Downloads CSV file using react-csv

## Current Implementation

Currently implemented on:

- ✅ Users List page (`/users`)

## Future Enhancements

- Add Excel export support
- Add custom PDF styling options
- Add data filtering before export
- Add progress indicators for large datasets
- Make button position configurable
- Add keyboard shortcuts

## Notes

- PDF generation handles pagination automatically
- Long text values are truncated in PDF to fit layout
- CSV download starts immediately via browser download
- Component includes error handling and user feedback via toast notifications
