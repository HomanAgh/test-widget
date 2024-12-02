import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/app/lib/utils"; 

interface PresetColorsProps {

  selectedColor: string;

  onColorSelect: (color: string) => void;

}

const PRESET_COLORS = [

  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD",

  "#D4A5A5", "#9B6B6B", "#E9967A", "#FFB6C1", "#DDA0DD",

  "#B19CD9", "#87CEEB", "#98FB98", "#DEB887", "#F0E68C",

  "#FFE4B5", "#F08080", "#E6E6FA", "#90EE90", "#FFA07A"

];

const PresetColors = ({ selectedColor, onColorSelect }: PresetColorsProps) => {

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {

    if (scrollContainerRef.current) {

      const scrollAmount = direction === "left" ? -200 : 200;

      scrollContainerRef.current.scrollBy({

        left: scrollAmount,

        behavior: "smooth"

      });

    }

  };

  return (

    <div className="relative">

      <button

        onClick={() => scroll("left")}

        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"

      >

        <ChevronLeft className="w-4 h-4" />

      </button>

      

      <div

        ref={scrollContainerRef}

        className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-8 snap-x snap-mandatory"

      >

        {PRESET_COLORS.map((color) => (

          <motion.button

            key={color}

            whileHover={{ scale: 1.1 }}

            whileTap={{ scale: 0.95 }}

            onClick={() => onColorSelect(color)}

            className={cn(

              "w-12 h-12 rounded-full relative shrink-0 snap-center",

              "border-2 transition-transform duration-200",

              selectedColor === color ? "border-gray-900" : "border-transparent"

            )}

            style={{ backgroundColor: color }}

          >

            {selectedColor === color && (

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">

                  <div className="w-2 h-2 rounded-full bg-gray-900" />

                </div>

              </div>

            )}

          </motion.button>

        ))}

      </div>

      <button

        onClick={() => scroll("right")}

        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white/80 rounded-full shadow-md hover:bg-white transition-colors"

      >

        <ChevronRight className="w-4 h-4" />

      </button>

    </div>

  );

};

export default PresetColors;