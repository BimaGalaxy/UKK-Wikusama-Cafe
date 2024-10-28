import React from "react";

export default function UnauthorizedPage() {
  return (
    <div className="h-screen w-screen bg-red-700 overflow-hidden flex flex-col items-center justify-center">
      <h1 className="text-yellow-400 text-3xl text-center absolute top-1/3 ">
        Error: 403
      </h1>
      <h1 className="text-yellow-400 text-3xl text-center absolute">
        Forbidden
      </h1>
    </div>
  );
}
