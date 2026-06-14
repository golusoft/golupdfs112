"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sheet, 
  Sparkles, 
  Download, 
  Loader2, 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  FileText, 
  Table,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Tool } from "@/lib/tools";
import { getPdfJs } from "@/lib/pdf/pdfjs";
import { ToolDropzone } from "./dropzone";
import { createWorker } from "tesseract.js";

interface TableSheet {
  name: string;
  headers: string[];
  columnMappings: string[]; // mapped types (Date, Amount, etc.)
  rows: string[][];
}

interface TableExtractorWorkspaceProps {
  tool: Omit<Tool, "icon">;
  files: File[];
  setFiles: (files: File[]) => void;
  onReset: () => void;
}

interface ExtractedCell {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export function TableExtractorWorkspace({ tool, files, setFiles, onReset }: TableExtractorWorkspaceProps) {
  const [sheets, setSheets] = useState<TableSheet[]>([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrLog, setOcrLog] = useState<string[]>([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pdfThumbnail, setPdfThumbnail] = useState("");
  
  // Debug telemetry state
  const [debugMethod, setDebugMethod] = useState<"None" | "Vector text extraction" | "Scanned OCR extraction">("None");
  const [debugOcrConfidence, setDebugOcrConfidence] = useState(0);

  const COLUMN_TYPES = [
    { label: "Unmapped", value: "none" },
    { label: "Date", value: "date" },
    { label: "Description", value: "description" },
    { label: "Quantity", value: "quantity" },
    { label: "Unit Price", value: "price" },
    { label: "Debit (Withdrawal)", value: "debit" },
    { label: "Credit (Deposit)", value: "credit" },
    { label: "Balance", value: "balance" },
    { label: "Amount / Total", value: "amount" }
  ];

  // 1. Initial Load: Parse text vector tables from all pages
  useEffect(() => {
    async function loadPdfAndAutoScan() {
      if (!files.length) return;
      setLoading(true);
      setSheets([]);
      setDebugMethod("None");
      setDebugOcrConfidence(0);
      try {
        const file = files[0];
        const pdfjs = await getPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        setTotalPages(pdfDoc.numPages);

        // Render first page thumbnail
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          setPdfThumbnail(canvas.toDataURL("image/jpeg", 0.8));
        }

        // Auto Scan all pages for vector text tables
        const parsedSheets: TableSheet[] = [];
        let detected = false;
        
        for (let pNum = 1; pNum <= pdfDoc.numPages; pNum++) {
          const pg = await pdfDoc.getPage(pNum);
          const sheet = await extractPageVectorTable(pg);
          if (sheet) {
            parsedSheets.push(sheet);
            detected = true;
          }
        }

        if (detected) {
          const mergedSheets = mergeSimilarSheets(parsedSheets);
          setSheets(mergedSheets);
          setActiveSheetIndex(0);
          setDebugMethod("Vector text extraction");
          toast.success(`Successfully extracted ${mergedSheets.length} structured tables!`);
        } else {
          toast.warning("No structured vector tables detected. Try running OCR Table Recovery for scanned/image pages.");
        }
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to parse PDF document.");
      } finally {
        setLoading(false);
      }
    }
    loadPdfAndAutoScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // Coordinate-based table builder
  function buildTableFromCoordinates(rawCells: ExtractedCell[], tableName: string): TableSheet | null {
    // Sort cells by top (y) coordinate
    rawCells.sort((a, b) => a.y - b.y);

    // Group cells into rows based on y coordinate overlap
    const rows: ExtractedCell[][] = [];
    const rowTolerance = 12; // vertical overlap threshold in pixels

    rawCells.forEach((cell) => {
      let added = false;
      for (const row of rows) {
        const avgY = row.reduce((sum, c) => sum + c.y, 0) / row.length;
        if (Math.abs(cell.y - avgY) < rowTolerance) {
          row.push(cell);
          added = true;
          break;
        }
      }
      if (!added) {
        rows.push([cell]);
      }
    });

    // Sort each row horizontally by x
    rows.forEach((row) => {
      row.sort((a, b) => a.x - b.x);
    });

    // Sort rows vertically from top to bottom
    rows.sort((a, b) => {
      const avgYA = a.reduce((sum, c) => sum + c.y, 0) / a.length;
      const avgYB = b.reduce((sum, c) => sum + c.y, 0) / b.length;
      return avgYA - avgYB;
    });

    // Merge horizontally adjacent items that are part of the same cell text
    const horizontalMergeTolerance = 15; // pixels
    const mergedRows: ExtractedCell[][] = [];

    rows.forEach((row) => {
      const newRow: ExtractedCell[] = [];
      row.forEach((cell) => {
        if (newRow.length === 0) {
          newRow.push({ ...cell });
        } else {
          const lastCell = newRow[newRow.length - 1];
          const gap = cell.x - (lastCell.x + lastCell.w);
          if (gap >= 0 && gap < horizontalMergeTolerance) {
            lastCell.text += " " + cell.text;
            lastCell.w = (cell.x + cell.w) - lastCell.x;
          } else {
            newRow.push({ ...cell });
          }
        }
      });
      mergedRows.push(newRow);
    });

    // Filter out completely empty or extremely short rows
    const cleanRows = mergedRows.filter((r) => r.length > 0 && r.some((c) => c.text !== ""));
    if (cleanRows.length === 0) return null;

    // Align cells to a global column grid based on their x coordinates
    const xCoords: number[] = [];
    cleanRows.forEach((row) => {
      row.forEach((cell) => {
        xCoords.push(cell.x);
      });
    });

    xCoords.sort((a, b) => a - b);

    // Cluster x coordinates to find global columns
    const colsX: number[] = [];
    const colTolerance = 30; // pixels
    xCoords.forEach((x) => {
      let added = false;
      for (let i = 0; i < colsX.length; i++) {
        if (Math.abs(x - colsX[i]) < colTolerance) {
          colsX[i] = (colsX[i] * 4 + x) / 5;
          added = true;
          break;
        }
      }
      if (!added) {
        colsX.push(x);
      }
    });

    colsX.sort((a, b) => a - b);

    // If column count is less than 2, it's not a table
    if (colsX.length < 2) {
      return null;
    }

    // Populate grid values aligned to global column coordinates
    const finalRows: string[][] = [];
    cleanRows.forEach((row) => {
      const finalRow = Array(colsX.length).fill("");
      row.forEach((cell) => {
        let closestIdx = 0;
        let minDiff = Infinity;
        colsX.forEach((cx, colIdx) => {
          const diff = Math.abs(cell.x - cx);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = colIdx;
          }
        });
        
        if (finalRow[closestIdx]) {
          finalRow[closestIdx] += " " + cell.text;
        } else {
          finalRow[closestIdx] = cell.text;
        }
      });
      finalRows.push(finalRow);
    });

    const formattedRows = finalRows.filter((r) => r.some((val) => val.trim() !== ""));
    if (formattedRows.length === 0) return null;

    const headers = formattedRows[0].map((val, idx) => val.trim() !== "" ? val.trim() : `Column ${idx + 1}`);
    const dataRows = formattedRows.slice(1);

    return {
      name: tableName,
      headers: headers,
      columnMappings: Array(headers.length).fill("none"),
      rows: dataRows.length > 0 ? dataRows : [Array(headers.length).fill("")],
    };
  }

  // Extract vector table from single page
  async function extractPageVectorTable(page: any): Promise<TableSheet | null> {
    const textContent = await page.getTextContent();
    const items = textContent.items;
    if (!items || items.length < 5) return null;

    const viewport = page.getViewport({ scale: 1.0 });
    const pageHeight = viewport.height;

    const rawCells: ExtractedCell[] = items
      .map((item: any) => {
        const tx = item.transform;
        return {
          text: item.str.trim(),
          x: tx[4],
          y: pageHeight - tx[5], // Convert to top-down y
          w: item.width || 0,
          h: item.height || 0,
        };
      })
      .filter((c: ExtractedCell) => c.text !== "");

    return buildTableFromCoordinates(rawCells, `Page ${page.pageNumber} Table`);
  }

  // Merge similar tables across pages
  function mergeSimilarSheets(sheets: TableSheet[]): TableSheet[] {
    if (sheets.length <= 1) return sheets;

    const merged: TableSheet[] = [];
    
    sheets.forEach((sheet) => {
      let found = false;
      for (const mSheet of merged) {
        if (areSheetsMergeable(mSheet, sheet)) {
          mSheet.rows = [...mSheet.rows, ...sheet.rows];
          found = true;
          break;
        }
      }
      if (!found) {
        merged.push({ ...sheet });
      }
    });

    return merged;
  }

  function areSheetsMergeable(s1: TableSheet, s2: TableSheet): boolean {
    if (s1.headers.length !== s2.headers.length) return false;
    
    let matchCount = 0;
    s1.headers.forEach((h1, idx) => {
      const h2 = s2.headers[idx];
      if (h1.toLowerCase() === h2.toLowerCase()) {
        matchCount++;
      }
    });
    
    const matchRatio = matchCount / s1.headers.length;
    if (matchRatio >= 0.5) return true;
    
    const isPlaceholder1 = s1.headers.every(h => h.startsWith("Column "));
    const isPlaceholder2 = s2.headers.every(h => h.startsWith("Column "));
    if (isPlaceholder1 && isPlaceholder2) return true;

    return false;
  }

  // OCR recovery
  const handleOcrRun = async () => {
    if (!files.length) return;
    setOcrScanning(true);
    setOcrProgress(0);
    setOcrLog(["Initializing Tesseract WebAssembly engine..."]);
    
    try {
      const file = files[0];
      const pdfjs = await getPdfJs();
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      
      const parsedSheets: TableSheet[] = [];
      let totalConfidence = 0;
      let ocrRanCount = 0;
      
      for (let pNum = 1; pNum <= pdfDoc.numPages; pNum++) {
        setOcrProgress(Math.floor(((pNum - 1) / pdfDoc.numPages) * 100));
        setOcrLog(prev => [...prev, `Rendering page ${pNum} to high-resolution canvas...`]);
        
        const page = await pdfDoc.getPage(pNum);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for high resolution OCR
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          setOcrLog(prev => [...prev, `Running OCR table structure recovery on page ${pNum}...`]);
          
          const worker = await createWorker("eng");
          const { data } = (await worker.recognize(canvas)) as any;
          await worker.terminate();
          
          if (data.words && data.words.length > 0) {
            const rawCells: ExtractedCell[] = data.words.map((w: any) => ({
              text: w.text.trim(),
              x: w.bbox.x0,
              y: w.bbox.y0,
              w: w.bbox.x1 - w.bbox.x0,
              h: w.bbox.y1 - w.bbox.y0
            })).filter((c: any) => c.text !== "");
            
            const sheet = buildTableFromCoordinates(rawCells, `Page ${pNum} Scanned Table`);
            if (sheet) {
              parsedSheets.push(sheet);
            }
            totalConfidence += data.confidence || 85;
            ocrRanCount++;
          }
        }
      }
      
      setOcrProgress(100);
      const mergedSheets = mergeSimilarSheets(parsedSheets);
      
      if (mergedSheets.length > 0) {
        setSheets(mergedSheets);
        setActiveSheetIndex(0);
        setDebugMethod("Scanned OCR extraction");
        setDebugOcrConfidence(ocrRanCount > 0 ? totalConfidence / ocrRanCount : 85);
        toast.success(`OCR parsed ${mergedSheets.length} tables from scanned PDF successfully!`);
      } else {
        setSheets([]);
        setDebugMethod("None");
        setDebugOcrConfidence(0);
        toast.error("No tables detected after OCR processing.");
      }
    } catch (err: any) {
      console.error(err);
      setOcrLog(prev => [...prev, `❌ Error: ${err.message}`]);
      toast.error("OCR table recovery failed.");
    } finally {
      setTimeout(() => {
        setOcrScanning(false);
      }, 500);
    }
  };

  // Modify cell value
  const handleCellChange = (rIdx: number, cIdx: number, val: string) => {
    setSheets(prev => {
      const copy = [...prev];
      const sheet = copy[activeSheetIndex];
      const nextRows = [...sheet.rows];
      nextRows[rIdx] = [...nextRows[rIdx]];
      nextRows[rIdx][cIdx] = val;
      copy[activeSheetIndex] = { ...sheet, rows: nextRows };
      return copy;
    });
  };

  // Modify header title
  const handleHeaderChange = (cIdx: number, val: string) => {
    setSheets(prev => {
      const copy = [...prev];
      const sheet = copy[activeSheetIndex];
      const nextHeaders = [...sheet.headers];
      nextHeaders[cIdx] = val;
      copy[activeSheetIndex] = { ...sheet, headers: nextHeaders };
      return copy;
    });
  };

  // Column mapping dropdown change
  const handleColumnMappingChange = (cIdx: number, val: string) => {
    setSheets(prev => {
      const copy = [...prev];
      const sheet = copy[activeSheetIndex];
      const nextMappings = [...sheet.columnMappings];
      nextMappings[cIdx] = val;
      copy[activeSheetIndex] = { ...sheet, columnMappings: nextMappings };
      return copy;
    });
  };

  // Add row
  const addRow = () => {
    setSheets(prev => {
      const copy = [...prev];
      const sheet = copy[activeSheetIndex];
      const nextRows = [...sheet.rows, Array(sheet.headers.length).fill("")];
      copy[activeSheetIndex] = { ...sheet, rows: nextRows };
      return copy;
    });
  };

  // Add column
  const addColumn = () => {
    setSheets(prev => {
      const copy = [...prev];
      const sheet = copy[activeSheetIndex];
      const colNum = sheet.headers.length + 1;
      const nextHeaders = [...sheet.headers, `Column ${colNum}`];
      const nextMappings = [...sheet.columnMappings, "none"];
      const nextRows = sheet.rows.map(row => [...row, ""]);
      copy[activeSheetIndex] = { 
        ...sheet, 
        headers: nextHeaders, 
        columnMappings: nextMappings, 
        rows: nextRows 
      };
      return copy;
    });
  };

  // Delete row
  const deleteRow = (rIdx: number) => {
    setSheets(prev => {
      const copy = [...prev];
      const sheet = copy[activeSheetIndex];
      if (sheet.rows.length <= 1) return prev;
      const nextRows = sheet.rows.filter((_, idx) => idx !== rIdx);
      copy[activeSheetIndex] = { ...sheet, rows: nextRows };
      return copy;
    });
  };

  // Delete column
  const deleteColumn = (cIdx: number) => {
    setSheets(prev => {
      const copy = [...prev];
      const sheet = copy[activeSheetIndex];
      if (sheet.headers.length <= 1) return prev;
      const nextHeaders = sheet.headers.filter((_, idx) => idx !== cIdx);
      const nextMappings = sheet.columnMappings.filter((_, idx) => idx !== cIdx);
      const nextRows = sheet.rows.map(row => row.filter((_, idx) => idx !== cIdx));
      copy[activeSheetIndex] = { 
        ...sheet, 
        headers: nextHeaders, 
        columnMappings: nextMappings, 
        rows: nextRows 
      };
      return copy;
    });
  };

  // Add a sheet tab manually
  const addSheetTab = () => {
    const nextTab: TableSheet = {
      name: `Table ${sheets.length + 1}`,
      headers: ["Column 1", "Column 2"],
      columnMappings: ["none", "none"],
      rows: [["", ""], ["", ""]]
    };
    setSheets(prev => [...prev, nextTab]);
    setActiveSheetIndex(sheets.length);
    toast.success("Created new table sheet tab");
  };

  // Delete sheet tab manually
  const deleteSheetTab = (idx: number) => {
    if (sheets.length <= 1) return;
    setSheets(prev => prev.filter((_, i) => i !== idx));
    setActiveSheetIndex(0);
    toast.success("Deleted table tab");
  };

  // Export Spreadsheet XML format (.xls)
  const handleExportExcel = () => {
    if (sheets.length === 0) return;
    let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Author>GoluPDF Table Extractor Pro</Author>
    <Created>${new Date().toISOString()}</Created>
  </DocumentProperties>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Bottom"/>
      <Borders/>
      <Font ss:FontName="Calibri" x:CharSet="1" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>
    <Style ss:ID="Header">
      <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
      <Interior ss:Color="#4F81BD" ss:Pattern="Solid"/>
    </Style>
  </Styles>
`;

    sheets.forEach(sheet => {
      xml += `  <Worksheet ss:Name="${sheet.name}">
    <Table>
`;
      // Write headers
      xml += `      <Row ss:Height="20">\n`;
      sheet.headers.forEach(h => {
        xml += `        <Cell ss:StyleID="Header"><Data ss:Type="String">${h}</Data></Cell>\n`;
      });
      xml += `      </Row>\n`;

      // Write rows
      sheet.rows.forEach(row => {
        xml += `      <Row>\n`;
        row.forEach(val => {
          const isNum = !isNaN(Number(val)) && val.trim() !== "";
          const type = isNum ? "Number" : "String";
          xml += `        <Cell><Data ss:Type="${type}">${val}</Data></Cell>\n`;
        });
        xml += `      </Row>\n`;
      });

      xml += `    </Table>
  </Worksheet>
`;
    });

    xml += `</Workbook>`;

    const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${files[0].name.replace(/\.pdf$/i, "")}-tables.xls`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Excel worksheets exported successfully!");
  };

  // Export Comma Separated Values (.csv)
  const handleExportCsv = () => {
    if (sheets.length === 0) return;
    const sheet = sheets[activeSheetIndex];
    
    let csvContent = "";
    // Write headers
    csvContent += sheet.headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";
    
    // Write rows
    sheet.rows.forEach(row => {
      csvContent += row.map(val => `"${val.replace(/"/g, '""')}"`).join(",") + "\n";
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${files[0].name.replace(/\.pdf$/i, "")}-${sheet.name}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${sheet.name} as CSV`);
  };

  // Export JSON structured layout
  const handleExportJson = () => {
    if (sheets.length === 0) return;
    const data = sheets.map(s => ({
      tableName: s.name,
      columns: s.headers.map((h, i) => ({ header: h, mapping: s.columnMappings[i] })),
      data: s.rows.map(row => {
        const obj: Record<string, string> = {};
        s.headers.forEach((h, i) => {
          obj[h] = row[i];
        });
        return obj;
      })
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${files[0].name.replace(/\.pdf$/i, "")}-tables.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Structured tables exported as JSON");
  };

  if (files.length === 0) {
    return (
      <ToolDropzone
        files={files}
        onFiles={setFiles}
        accept={tool.accept}
        maxFiles={tool.maxFiles}
        multiple={false}
      />
    );
  }

  const activeSheet = sheets[activeSheetIndex] || null;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Visual PDF page viewer side */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-6 shadow-xl border-border/40 bg-card/30 backdrop-blur-md flex flex-col justify-between min-h-[380px]">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="text-primary h-5 w-5" /> Document Visual Scan
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Identify tables from document layers</p>
          </div>

          <div className="my-6 border border-border/20 rounded-xl overflow-hidden bg-background/50 relative flex items-center justify-center p-4">
            {pdfThumbnail ? (
              <div className="relative">
                <img src={pdfThumbnail} alt="PDF preview" className="max-h-[220px] rounded shadow-md border border-border/10" />
                {ocrScanning && (
                  <div className="absolute inset-0 bg-primary/10 overflow-hidden">
                    {/* Glowing scanning bar overlay */}
                    <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent w-full animate-bounce mt-10 shadow-[0_0_8px_hsl(var(--primary))]" />
                  </div>
                )}
              </div>
            ) : (
              <div className="animate-pulse h-40 w-32 bg-muted/40 rounded" />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Select Page to scan:</span>
              <span className="font-semibold">{selectedPage} / {totalPages}</span>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="w-full text-xs font-semibold" onClick={handleOcrRun} disabled={ocrScanning || loading}>
                <Sparkles className="h-3.5 w-3.5" /> Run OCR Table Recovery
              </Button>
            </div>
          </div>
        </Card>

        {/* Debug Telemetry Panel */}
        <Card className="p-5 shadow-xl border-border/40 bg-card/30 backdrop-blur-md space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Debug Telemetry Panel
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground block">Tables Detected:</span>
              <span className="font-semibold text-foreground">{sheets.length}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Scan Method:</span>
              <span className="font-semibold text-foreground">{debugMethod}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Rows Extracted:</span>
              <span className="font-semibold text-foreground">
                {sheets.reduce((sum, s) => sum + s.rows.length, 0)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Columns Extracted:</span>
              <span className="font-semibold text-foreground">
                {sheets.length > 0 ? activeSheet?.headers.length || 0 : 0}
              </span>
            </div>
            {debugOcrConfidence > 0 && (
              <div className="col-span-2 border-t pt-2 mt-1 border-border/10">
                <span className="text-muted-foreground block">OCR Confidence Rating:</span>
                <span className="font-semibold text-emerald-500">{debugOcrConfidence.toFixed(1)}%</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Spreadsheet Workspace Editor */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="p-6 shadow-xl border-border/40 bg-card/30 backdrop-blur-md space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <h4 className="font-semibold text-sm">Scanning PDF vectors for tables...</h4>
            </div>
          ) : ocrScanning ? (
            <div className="space-y-4 py-8 max-w-sm mx-auto text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <h4 className="font-semibold text-sm">Recovering scanned PDF tables...</h4>
              <Progress value={ocrProgress} />
              <div className="bg-zinc-950/5 dark:bg-white/[0.02] p-3 rounded-lg border border-border/10 text-left font-mono text-[10px] space-y-1 h-[100px] overflow-y-auto">
                {ocrLog.map((log, i) => (
                  <div key={i} className="text-muted-foreground flex gap-1">
                    <span className="text-emerald-500">▶</span> {log}
                  </div>
                ))}
              </div>
            </div>
          ) : sheets.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border/40 rounded-2xl min-h-[300px]">
              <Table className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No tables detected in this document</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                We couldn't extract any structured data grids. Try running OCR Table Recovery for scanned/image pages.
              </p>
              <Button onClick={handleOcrRun} variant="outline" className="mt-4 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 mr-1" /> Run OCR Table Recovery
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-center border-b pb-4 border-border/40 gap-3">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Sheet className="text-primary h-5 w-5" /> Interactive Spreadsheet
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Review and adjust tabular data grids</p>
                </div>
                
                {/* Sheet Tabs */}
                <div className="flex gap-1 overflow-x-auto max-w-[200px] scrollbar-hide">
                  {sheets.map((sheet, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveSheetIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                          activeSheetIndex === idx
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {sheet.name}
                      </button>
                      {sheets.length > 1 && (
                        <button className="text-muted-foreground hover:text-destructive p-0.5 font-bold" onClick={() => deleteSheetTab(idx)}>
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button className="p-1 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-white" onClick={addSheetTab}>
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {activeSheet && (
                <div className="space-y-4">
                  {/* Column Mapping Selector Row */}
                  <div className="flex gap-1 py-1 overflow-x-auto">
                    {activeSheet.headers.map((_, hIdx) => (
                      <div key={hIdx} className="min-w-[110px] flex-1">
                        <select
                          value={activeSheet.columnMappings[hIdx] || "none"}
                          onChange={(e) => handleColumnMappingChange(hIdx, e.target.value)}
                          className="w-full text-[10px] font-semibold border rounded px-1 py-1 bg-background/60 border-border/30"
                        >
                          {COLUMN_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                    <div className="w-8 shrink-0" />
                  </div>

                  {/* Main Spreadsheet grid */}
                  <div className="overflow-x-auto border border-border/30 rounded-xl bg-background/40">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-border/30 bg-muted/40 font-semibold text-muted-foreground">
                          {activeSheet.headers.map((header, hIdx) => (
                            <th key={hIdx} className="p-2 border-r border-border/20 min-w-[110px]">
                              <div className="flex justify-between items-center">
                                <input
                                  type="text"
                                  value={header}
                                  onChange={(e) => handleHeaderChange(hIdx, e.target.value)}
                                  className="bg-transparent font-semibold border-none w-full outline-none focus:bg-background/80 focus:px-1 rounded"
                                />
                                <button onClick={() => deleteColumn(hIdx)} className="text-muted-foreground hover:text-destructive pl-1 font-bold">
                                  ×
                                </button>
                              </div>
                            </th>
                          ))}
                          <th className="w-8 p-2" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {activeSheet.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-primary/5">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-1.5 border-r border-border/20">
                                <input
                                  type="text"
                                  value={cell}
                                  onChange={(e) => handleCellChange(rIdx, cIdx, e.target.value)}
                                  className="w-full bg-transparent outline-none focus:bg-background/80 px-1 py-0.5 rounded focus:ring-1 focus:ring-primary"
                                />
                              </td>
                            ))}
                            <td className="p-1.5 text-center">
                              <button onClick={() => deleteRow(rIdx)} className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Append Buttons */}
                  <div className="flex gap-2 justify-start">
                    <Button size="sm" variant="outline" className="text-xs" onClick={addRow}>
                      <Plus className="h-3 w-3 mr-1" /> Add Row
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs" onClick={addColumn}>
                      <Plus className="h-3 w-3 mr-1" /> Add Column
                    </Button>
                  </div>

                  {/* Export Card */}
                  <div className="flex justify-between items-center border-t pt-4 border-border/40">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-xs" onClick={handleExportJson}>
                        Export JSON
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs" onClick={handleExportCsv}>
                        Export CSV
                      </Button>
                    </div>
                    <Button variant="gradient" size="sm" className="text-xs" onClick={handleExportExcel}>
                      <Download className="h-3.5 w-3.5 mr-1" /> Export Excel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
