
import React, { useState, useCallback, useRef } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes?: string;
  multiple?: boolean;
  fileTypeDescription?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFilesSelected, 
  acceptedFileTypes = "*", 
  multiple = false,
  fileTypeDescription
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  }, [onFilesSelected]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };
  
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };
  
  const onBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed border-border rounded-xl p-10 text-center transition-colors duration-200 cursor-pointer",
          isDragging ? "border-primary bg-primary/10" : ""
        )}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={onBrowseClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedFileTypes}
          multiple={multiple}
          onChange={onFileInputChange}
        />
        <Upload size={40} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Drag and drop files here, or click to browse
        </p>
        {fileTypeDescription && (
             <p className="text-xs text-muted-foreground mt-2">
                {fileTypeDescription}
             </p>
        )}
        <Button 
            type="button" 
            variant="default"
            onClick={(e) => { e.stopPropagation(); onBrowseClick(); }}
            className="mt-4"
        >
          Browse Files
        </Button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Selected Files:</h4>
          <ul className="list-disc list-inside bg-card p-4 rounded-lg border max-h-40 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="text-sm text-muted-foreground">
                {file.name} - {(file.size / 1024).toFixed(2)} KB
              </li>
            ))}
          </ul>
           <Button 
                variant="secondary" 
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFiles([]);
                    onFilesSelected([]);
                }}
            >
                Clear selection
            </Button>
        </div>
      )}
    </div>
  );
};
