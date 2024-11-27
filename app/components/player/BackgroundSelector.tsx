import React from "react";

interface BackgroundSelectorProps {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  backgroundColor,
  setBackgroundColor,
}) => {
  const handleBackgroundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBackgroundColor(e.target.value);
  };

  return (
    <div className="mb-6 text-center">
      <label
        htmlFor="color-picker"
        className="block text-sm font-medium text-gray-800 dark:text-gray-100"
      >
        Change Background Color:
      </label>
      <select
        id="color-picker"
        value={backgroundColor}
        onChange={handleBackgroundChange}
        className="mt-2 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-100"
      >
        <option value="bg-blue-100">Blue</option>
        <option value="bg-gray-50">Light Gray</option>
        <option value="bg-gray-800 text-white">Dark Gray</option>
        <option value="bg-green-100">Green</option>
        <option value="bg-yellow-100">Yellow</option>
      </select>
    </div>
  );
};

export default BackgroundSelector;
