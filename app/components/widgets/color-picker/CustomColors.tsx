import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CustomColorProps {

  value: string;

  onChange: (color: string) => void;

}

const CustomColor = ({ value, onChange }: CustomColorProps) => {

  const [hexValue, setHexValue] = useState(value);

  const [isValid, setIsValid] = useState(true);

  useEffect(() => {

    setHexValue(value);

  }, [value]);

  const validateAndUpdateColor = (input: string) => {

    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    const newValue = input.startsWith("#") ? input : `#${input}`;

    setHexValue(newValue);

    

    if (hexRegex.test(newValue)) {

      setIsValid(true);

      onChange(newValue);

    } else {

      setIsValid(false);

    }

  };

  return (

    <div className="space-y-4">

      <div className="relative">

        <input

          type="text"

          value={hexValue}

          onChange={(e) => validateAndUpdateColor(e.target.value)}

          className={`w-full px-4 py-2 rounded-lg border ${

            isValid ? "border-gray-200" : "border-red-500"

          } focus:outline-none focus:ring-2 focus:ring-gray-200`}

          placeholder="#000000"

        />

        {!isValid && (

          <motion.p

            initial={{ opacity: 0, y: -10 }}

            animate={{ opacity: 1, y: 0 }}

            className="absolute text-xs text-red-500 mt-1"

          >

            Please enter a valid HEX color code

          </motion.p>

        )}

      </div>

      <motion.div

        className="w-full h-32 rounded-lg shadow-inner"

        style={{ backgroundColor: isValid ? hexValue : "#ffffff" }}

        animate={{ scale: isValid ? 1 : 0.98 }}

        transition={{ duration: 0.2 }}

      />

    </div>

  );

};

export default CustomColor;