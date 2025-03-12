import React from "react";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
};