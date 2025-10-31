
import React from 'react';

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.868 2.884c.321-.772 1.305-.772 1.626 0l.414.992a.75.75 0 00.563.41l1.096.158c.86.124 1.228 1.132.626 1.706l-.788.79a.75.75 0 00-.212.663l.186 1.091c.148.865-.721 1.534-1.528 1.182l-.976-.412a.75.75 0 00-.696 0l-.976.412c-.807.352-1.676-.317-1.528-1.182l.186-1.091a.75.75 0 00-.212-.663l-.788-.79c-.602-.574-.234-1.582.626-1.706l1.096-.158a.75.75 0 00.563-.41l.414-.992zM6.5 10.334c.321-.772 1.305-.772 1.626 0l.414.992a.75.75 0 00.563.41l1.096.158c.86.124 1.228 1.132.626 1.706l-.788.79a.75.75 0 00-.212.663l.186 1.091c.148.865-.721 1.534-1.528 1.182l-.976-.412a.75.75 0 00-.696 0l-.976.412c-.807.352-1.676-.317-1.528-1.182l.186-1.091a.75.75 0 00-.212-.663l-.788-.79c-.602-.574-.234-1.582.626-1.706l1.096-.158a.75.75 0 00.563-.41l.414-.992z" clipRule="evenodd" />
    </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);
