import React from "react";

const EmptyPageComponent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-xl font-semibold text-gray-700">Page Not Found</h2>
      <p className="text-gray-500">
        The page you are looking for does not exist or could not be loaded.
      </p>
    </div>
  );
};

export default EmptyPageComponent;
