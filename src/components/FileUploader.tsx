import React, { useState, useRef } from 'react';
import { Upload, X, File, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from './ui';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFilesChange: (files: string[]) => void;
  maxFiles?: number;
  accept?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFilesChange, 
  maxFiles = 3,
  accept = "image/*,application/pdf"
}) => {
  const [files, setFiles] = useState<{ name: string, data: string, type: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []) as File[];
    if (files.length + selectedFiles.length > maxFiles) {
      toast.error(`Você pode enviar no máximo ${maxFiles} arquivos.`);
      return;
    }

    setUploading(true);
    const newFiles: { name: string, data: string, type: string }[] = [];

    for (const file of selectedFiles) {
      if (file.size > 500 * 1024) { // 500KB limit for base64 in Firestore
        toast.error(`O arquivo ${file.name} é muito grande. O limite é 500KB.`);
        continue;
      }

      try {
        const base64 = await convertToBase64(file);
        newFiles.push({
          name: file.name,
          data: base64,
          type: file.type
        });
      } catch (error) {
        toast.error(`Erro ao processar ${file.name}`);
      }
    }

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles.map(f => f.data));
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles.map(f => f.data));
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          multiple
          className="hidden"
        />
        <div className="flex flex-col items-center">
          {uploading ? (
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-3" />
          ) : (
            <Upload className="w-10 h-10 text-zinc-600 group-hover:text-orange-500 transition-colors mb-3" />
          )}
          <p className="text-zinc-400 font-medium">Clique para enviar arquivos</p>
          <p className="text-zinc-600 text-xs mt-1">Imagens ou PDF (Máx. 500KB cada)</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg group">
              <div className="flex items-center gap-3 overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img src={file.data} alt={file.name} className="w-10 h-10 rounded object-cover border border-zinc-800" />
                ) : (
                  <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center">
                    <File className="w-5 h-5 text-zinc-500" />
                  </div>
                )}
                <div className="truncate">
                  <p className="text-sm text-zinc-300 truncate font-medium">{file.name}</p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{file.type.split('/')[1]}</p>
                </div>
              </div>
              <button 
                onClick={() => removeFile(index)}
                className="p-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
