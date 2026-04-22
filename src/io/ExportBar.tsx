import { useRef, useState } from 'react';
import type { Combination } from '../types';
import {
  copyToClipboard,
  downloadJson,
  downloadPng,
  downloadSvg,
  encodeCombinationToUrl,
  parseCombinationJson,
} from './exporters';

interface ExportBarProps {
  combination: Combination;
  svgRef: React.RefObject<SVGSVGElement>;
  onImport: (combination: Combination) => void;
}

const buttonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  fontSize: 13,
  fontFamily: 'system-ui, sans-serif',
  color: '#111827',
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 6,
  cursor: 'pointer',
  lineHeight: 1.2,
};

const barStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center',
  padding: '10px 12px',
  background: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: 6,
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
  fontSize: 13,
  fontFamily: 'system-ui, sans-serif',
};

const errorStyle: React.CSSProperties = {
  color: '#b91c1c',
  fontSize: 12,
  marginLeft: 8,
};

const hintStyle: React.CSSProperties = {
  color: '#047857',
  fontSize: 12,
  marginLeft: 8,
};

export function ExportBar({ combination, svgRef, onImport }: ExportBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportingPng, setExportingPng] = useState(false);
  const [copied, setCopied] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const safeName = (combination.name || 'truck-combination')
    .trim()
    .replace(/[^a-z0-9\-_]+/gi, '-')
    .toLowerCase() || 'truck-combination';

  const handleSvg = () => {
    if (!svgRef.current) return;
    downloadSvg(svgRef.current, `${safeName}.svg`);
  };

  const handlePng = async () => {
    if (!svgRef.current || exportingPng) return;
    setExportingPng(true);
    try {
      await downloadPng(svgRef.current, `${safeName}.png`);
    } catch (err) {
      setImportError(`PNG export failed: ${(err as Error).message}`);
    } finally {
      setExportingPng(false);
    }
  };

  const handleJson = () => {
    downloadJson(combination, `${safeName}.json`);
  };

  const handleUploadClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset so the same file can be selected again later.
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const result = parseCombinationJson(text);
      if (!result.ok) {
        setImportError(result.error);
        return;
      }
      setImportError(null);
      onImport(result.combination);
    } catch (err) {
      setImportError(`Could not read file: ${(err as Error).message}`);
    }
  };

  const handleCopyShare = async () => {
    const encoded = encodeCombinationToUrl(combination);
    const url = `${window.location.origin}${window.location.pathname}#c=${encoded}`;
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } else {
      setImportError('Failed to copy to clipboard.');
    }
  };

  const handleResetUrl = () => {
    const { pathname, search } = window.location;
    window.history.replaceState(null, '', `${pathname}${search}`);
  };

  return (
    <div style={barStyle} role="toolbar" aria-label="Export and share">
      <button type="button" style={buttonStyle} onClick={handleSvg} title="Download SVG">
        <span aria-hidden>&#x2B07;</span> SVG
      </button>
      <button
        type="button"
        style={buttonStyle}
        onClick={handlePng}
        disabled={exportingPng}
        title="Download PNG"
      >
        <span aria-hidden>&#x1F5BC;</span>
        {exportingPng ? ' Exporting…' : ' PNG'}
      </button>
      <button type="button" style={buttonStyle} onClick={handleJson} title="Download JSON">
        <span aria-hidden>&#x7B;&#x7D;</span> JSON
      </button>
      <button type="button" style={buttonStyle} onClick={handleUploadClick} title="Upload JSON">
        <span aria-hidden>&#x2B06;</span> Upload
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button type="button" style={buttonStyle} onClick={handleCopyShare} title="Copy share URL">
        <span aria-hidden>&#x1F517;</span>
        {copied ? ' Copied ✓' : ' Copy share URL'}
      </button>
      <button type="button" style={buttonStyle} onClick={handleResetUrl} title="Reset URL">
        <span aria-hidden>&#x21BA;</span> Reset URL
      </button>
      {importError && <span style={errorStyle}>{importError}</span>}
      {copied && !importError && <span style={hintStyle}>Link copied to clipboard</span>}
    </div>
  );
}

export default ExportBar;
