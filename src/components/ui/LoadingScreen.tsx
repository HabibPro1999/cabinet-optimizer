
import React from "react";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-muted-foreground animate-pulse">Chargement...</p>
      </div>
    </div>
  );
};
