import React from "react";

function Loading({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b">
      {icon}
      <h3 className="mt-6 text-xl font-medium">{text}</h3>
      <div className="mt-4 flex gap-1">
        <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.1s]"></span>
        <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.2s]"></span>
        <span className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.3s]"></span>
      </div>
    </div>
  );
}

export default Loading;
