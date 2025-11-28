import React, { useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';

const FileUpload = ({ label, accept, onChange, preview, type = 'image' }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
          dragActive
            ? 'border-neon-green bg-neon-green/5'
            : 'border-dark-600 hover:border-neon-green/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {preview ? (
          <div className="relative">
            {type === 'image' ? (
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-40 rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <FileText size={40} className="text-neon-green" />
                <span className="text-gray-300">{preview}</span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center">
              {type === 'image' ? (
                <ImageIcon size={24} className="text-neon-green" />
              ) : (
                <FileText size={24} className="text-neon-green" />
              )}
            </div>
            <p className="text-gray-400 text-sm">
              Glissez-déposez ou cliquez pour sélectionner un fichier
            </p>
            <p className="text-gray-500 text-xs">{accept}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;