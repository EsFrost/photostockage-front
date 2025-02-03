import React from "react";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

const DownloadButton = ({
  onClick,
  isLoading = false,
}: DownloadButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="inline-flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-md 
                 hover:bg-indigo-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className="w-5 h-5" />
      {isLoading ? "Downloading..." : "Download"}
    </button>
  );
};

export default DownloadButton;
