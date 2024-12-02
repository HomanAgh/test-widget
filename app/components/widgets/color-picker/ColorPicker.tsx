import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import PresetColors from "./PresetColors";
import CustomColor from "./CustomColors";

interface ColorPickerProps {

  onColorChange?: (color: string) => void;

  className?: string;

}

const ColorPicker = ({ onColorChange, className = "" }: ColorPickerProps) => {

  const [activeTab, setActiveTab] = useState<"preset" | "custom">("preset");

  const [selectedColor, setSelectedColor] = useState<string>("#000000");

  const handleColorChange = (color: string) => {

    setSelectedColor(color);

    onColorChange?.(color);

  };

  const copyToClipboard = () => {

    navigator.clipboard.writeText(selectedColor);

    toast("Color code copied!", {

      description: `${selectedColor} has been copied to your clipboard.`,

      duration: 2000,

    });

  };

  return (

    <div className={cn(

      "w-full max-w-md rounded-xl bg-white/90 backdrop-blur-lg p-4 shadow-lg border border-gray-200/50",

      className

    )}>

      <div className="flex items-center justify-between mb-6 bg-gray-100/50 rounded-lg p-1">

        {["preset", "custom"].map((tab) => (

          <button

            key={tab}

            onClick={() => setActiveTab(tab as "preset" | "custom")}

            className={cn(

              "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",

              activeTab === tab 

                ? "bg-white text-gray-900 shadow-sm" 

                : "text-gray-600 hover:text-gray-900"

            )}

          >

            {tab.charAt(0).toUpperCase() + tab.slice(1)}

          </button>

        ))}

      </div>

      <AnimatePresence mode="wait">

        <motion.div

          key={activeTab}

          initial={{ opacity: 0, y: 10 }}

          animate={{ opacity: 1, y: 0 }}

          exit={{ opacity: 0, y: -10 }}

          transition={{ duration: 0.2 }}

        >

          {activeTab === "preset" ? (

            <PresetColors

              selectedColor={selectedColor}

              onColorSelect={handleColorChange}

            />

          ) : (

            <CustomColor

              value={selectedColor}

              onChange={handleColorChange}

            />

          )}

        </motion.div>

      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between bg-gray-50 rounded-lg p-3">

        <div className="flex items-center gap-3">

          <div

            className="w-6 h-6 rounded-full border border-gray-200"

            style={{ backgroundColor: selectedColor }}

          />

          <span className="text-sm font-medium">{selectedColor}</span>

        </div>

        <button

          onClick={copyToClipboard}

          className="p-2 hover:bg-gray-100 rounded-md transition-colors"

        >

          <Copy className="w-4 h-4 text-gray-600" />

        </button>

      </div>

    </div>

  );

};

export default ColorPicker;