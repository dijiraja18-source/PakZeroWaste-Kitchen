import React, { useState } from 'react';
import {
  Code,
  Copy,
  Check,
  Download,
  FileText,
  Folder,
  Layers,
  Sparkles,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { FLUTTER_CODEBASE, FlutterFile } from '../data/flutterCodebase';

export const FlutterCodeViewer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const currentFile = FLUTTER_CODEBASE[selectedFileIndex];

  const handleCopyCurrent = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const combinedContent = FLUTTER_CODEBASE.map(
      (f) => `// ==========================================\n// FILE: ${f.path}\n// ${f.description}\n// ==========================================\n\n${f.code}\n\n`
    ).join('\n');

    const blob = new Blob([combinedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pak_zerowaste_kitchen_flutter_source.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-5 text-white shadow-md border border-emerald-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                Flutter 3.x Production Codebase
              </span>
              <span className="text-xs text-emerald-400">·</span>
              <span className="text-xs text-emerald-200">Strict Null-Safety</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
              Complete Cross-Platform Flutter Source
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              Fully written, error-free Dart source code for Android, iOS, and Web. Uses local storage with zero external API dependencies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAll}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Export All Files (.txt)</span>
            </button>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-emerald-800/80 text-xs">
          <div className="flex items-center gap-2 text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Offline (Local Storage)</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-200">
            <Layers className="w-4 h-4 text-teal-400" />
            <span>Provider State Architecture</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-200">
            <Code className="w-4 h-4 text-amber-400" />
            <span>Strict Null Safety</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Material 3 Eco Theme</span>
          </div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left File Tree Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-3 shadow-xs space-y-1">
          <div className="px-2 py-1.5 text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5 text-stone-400" />
            <span>Project File Tree</span>
          </div>

          <div className="space-y-1">
            {FLUTTER_CODEBASE.map((file, idx) => {
              const isSelected = selectedFileIndex === idx;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white font-medium shadow-xs'
                      : 'hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <FileText
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isSelected ? 'text-emerald-300' : 'text-stone-400'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-semibold truncate">
                      {file.filename}
                    </div>
                    <div
                      className={`text-[10px] truncate ${
                        isSelected ? 'text-emerald-200' : 'text-stone-400'
                      }`}
                    >
                      {file.path}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Terminal Guide */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1.5 mt-3">
            <div className="font-semibold text-stone-800 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-emerald-700" />
              <span>How to run in Flutter CLI:</span>
            </div>
            <pre className="bg-stone-900 text-emerald-300 p-2 rounded-lg font-mono text-[11px] overflow-x-auto">
              flutter pub get{'\n'}
              flutter run
            </pre>
          </div>
        </div>

        {/* Right Code Display Area */}
        <div className="lg:col-span-8 bg-stone-950 rounded-2xl border border-stone-800 shadow-xl overflow-hidden flex flex-col">
          {/* Top Code Bar */}
          <div className="bg-stone-900 px-4 py-3 border-b border-stone-800 flex items-center justify-between text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <span className="font-mono text-emerald-400 font-semibold">{currentFile.path}</span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-400 hidden sm:inline">{currentFile.description}</span>
            </div>

            <button
              onClick={handleCopyCurrent}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Code Body */}
          <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto text-xs font-mono leading-relaxed text-stone-200">
            <pre className="font-mono">
              <code>{currentFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
