import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useThrottle } from "@uidotdev/usehooks";

const ROW_HEIGHT = 50; // Row height in pixels
const BUFFER_ROWS = 4; // Number of buffer rows for smooth scrolling

interface Column<T> {
  label: string;
  width?: string;
  renderCell: (item: T, index?: number) => React.ReactNode;
}

interface VirtualizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (item: T) => string | number;
  onRowClick?: (item: T) => void;
}

const VirtualizedTable = <T,>({
  data,
  columns,
  rowKey,
  onRowClick,
}: VirtualizedTableProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleRows, setVisibleRows] = useState(10);

  const calculateVisibleRows = useCallback(() => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      setVisibleRows(Math.ceil(containerHeight / ROW_HEIGHT) + BUFFER_ROWS * 2);
    }
  }, []);

  useEffect(() => {
    calculateVisibleRows();
    window.addEventListener("resize", calculateVisibleRows);
    return () => window.removeEventListener("resize", calculateVisibleRows);
  }, [calculateVisibleRows]);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const newStartIndex = Math.max(
        0,
        Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_ROWS
      );
      setStartIndex(newStartIndex);
    }
  };

  const throttledScrollHandler = useThrottle(() => handleScroll(), 300);

  const displayedData = data.slice(startIndex, startIndex + visibleRows);
  const topSpacerHeight = startIndex * ROW_HEIGHT;
  const bottomSpacerHeight =
    (data.length - (startIndex + visibleRows)) * ROW_HEIGHT;

  return (
    <Card className="overflow-hidden shadow-xl">
      <CardContent className="p-0">
        {data.length > 0 ? (
          <div
            ref={containerRef}
            className="overflow-y-auto max-h-[70vh]"
            style={{ maxHeight: "70vh" }}
            // onScroll={throttledScrollHandler}
          >
            <Table>
              <TableHeader className="sticky top-0 z-50">
                <TableRow className="sticky top-0 z-50 bg-background">
                  {columns.map((column, index) => (
                    <TableHead
                      key={index}
                      className="font-semibold bg-background border-r text-primary py-4 text-center"
                      style={{ width: column.width || "auto" }}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Spacer row to take up space before the visible rows */}
                <TableRow style={{ height: topSpacerHeight }}>
                  <TableCell colSpan={columns.length} />
                </TableRow>

                {/* Render only the visible rows */}
                {data.map((item) => (
                  <TableRow
                    key={rowKey(item)}
                    className="border-b hover:bg-background transition-colors duration-200 cursor-pointer"
                    onClick={() => onRowClick && onRowClick(item)}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className="py-4 text-center"
                        style={{ width: column.width || "auto" }}
                      >
                        {column.renderCell(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {/* Spacer row to take up space after the visible rows */}
                <TableRow style={{ height: bottomSpacerHeight }}>
                  <TableCell colSpan={columns.length} />
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-blue-500 text-lg">No records available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VirtualizedTable;
