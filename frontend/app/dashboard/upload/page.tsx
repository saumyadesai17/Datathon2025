'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

export default function UploadData() {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsText(file);
      toast.success('File uploaded successfully!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold gradient-text">Upload Data</h1>

      <div
        {...getRootProps()}
        className={`glass-card p-12 rounded-xl border-2 border-dashed transition-colors text-center cursor-pointer
          ${isDragActive ? 'border-[#00f3ff]' : 'border-gray-700'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="text-4xl">📤</div>
          <p className="text-xl font-medium">
            {isDragActive ? 'Drop your CSV file here' : 'Drag & drop your CSV file here'}
          </p>
          <p className="text-gray-400">or click to select a file</p>
        </div>
      </div>

      {preview && (
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Data Preview</h2>
          <pre className="text-sm text-gray-400 overflow-auto max-h-60">
            {preview}
          </pre>
        </div>
      )}
    </div>
  );
}