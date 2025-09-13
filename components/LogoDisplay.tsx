
import React from 'react';

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-400"></div>
  </div>
);

const Alert: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md relative" role="alert">
    <strong className="font-bold">Error: </strong>
    <span className="block sm:inline">{message}</span>
  </div>
);

const LogoCard: React.FC<{ src: string, index: number }> = ({ src, index }) => (
    <div className="group relative aspect-square bg-slate-800 rounded-lg overflow-hidden border border-slate-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/20 hover:border-sky-500">
        <img src={src} alt={`Generated Logo ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <a
                href={src}
                download={`kaar-logo-${index + 1}.png`}
                className="py-2 px-4 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors text-sm font-semibold"
            >
                Download
            </a>
        </div>
    </div>
);

interface LogoDisplayProps {
  logos: string[];
  isLoading: boolean;
  error: string | null;
}

export const LogoDisplay: React.FC<LogoDisplayProps> = ({ logos, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <Spinner />
            <p className="mt-4 text-lg">Generating your masterpiece...</p>
            <p className="text-sm">This may take a moment.</p>
        </div>
      );
    }

    if (error) {
      return <Alert message={error} />;
    }

    if (logos.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {logos.map((logoSrc, index) => (
            <LogoCard key={index} src={logoSrc} index={index} />
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-8 border-2 border-dashed border-slate-700 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-slate-300">Your logos will appear here</h3>
        <p>Fill out the form to generate your brand's new look.</p>
      </div>
    );
  };
  
  return (
    <div className="p-6 bg-slate-900 rounded-lg min-h-[400px] md:min-h-0">
      {renderContent()}
    </div>
  );
};
