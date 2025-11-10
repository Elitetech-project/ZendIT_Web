// components/Onboarding.jsx
"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingScreenProps {
  onFinish: () => void;
}

// --- SLIDES ---
const SlideOne = () => (
  <div className="w-full h-full flex flex-col text-white items-center justify-evenly gap-20">
    <div className="h-full w-full max-h-[500px]">
      <Image
        src="/onboardingScreens/slide-one-image.svg"
        alt="slide-one-image"
        height={500}
        width={500}
        className="w-full h-full object-center"
      />
    </div>
    <div className="w-full px-[9%] mb-[6%]">
      <h1 className="mr-auto text-start font-semibold text-4xl leading-[170%]">
        Welcome To
        <br />
        Zend<span className="text-[#F5C249]">It</span>
      </h1>
    </div>
  </div>
);

const SlideTwo = () => (
  <div className="w-full h-full flex flex-col text-white items-center justify-evenly gap-20">
    <div className="h-full w-full max-h-[500px]">
      <Image
        src="/onboardingScreens/screenTwo.svg"
        alt="slide-two-image"
        height={500}
        width={500}
        className="w-full h-full object-center"
      />
    </div>
    <div className="w-full px-[9%] mb-[6%]">
      <h1 className="mr-auto text-start font-semibold text-4xl leading-[170%]">
        Transaction
        <br /> Security
      </h1>
    </div>
  </div>
);

const SlideThree = () => (
  <div className="w-full h-full flex flex-col text-white items-center justify-evenly gap-20">
    <div className="h-full w-full max-h-[500px]">
      <Image
        src="/onboardingScreens/screen-three.svg"
        alt="slide-three-image"
        height={500}
        width={500}
        className="w-full h-full object-center"
      />
    </div>
    <div className="w-full px-[9%] mb-[6%]">
      <h1 className="mr-auto text-start font-semibold text-4xl leading-[170%]">
        Fast and reliable
        <br /> Market updates
      </h1>
    </div>
  </div>
);



const slides = [<SlideOne />, <SlideTwo />, <SlideThree />];



// main component
export default function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  return (
    <div className="flex flex-col items-center justify-between h-screen w-full bg-[#16171D] font-poppins overflow-hidden">
      {/* Skip Button */}
      <div className="px-[7%] py-[6%] w-full flex items-center justify-end">
        <button
          onClick={handleSkip}
          className="text-[#F5C249] text-xl font-normal tracking-wider cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Animated Slide Section */}
      <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            {slides[current]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="px-[7%] py-[9%] w-full flex items-center justify-between gap-20">
        <div className="w-fit flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <span
            onClick={() => setCurrent(idx)}
              key={idx}
              className={`block h-1.5 w-2.5 rounded-lg transition-all duration-300 ${
                idx === current ? "bg-[#F5C249] w-5" : "bg-[#494D58]"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="bg-[#F5C249] h-12 w-12 rounded-full flex items-center justify-center cursor-pointer font-bold"
          aria-label="next"
        >
          <ChevronRight size={25} />
        </button>
      </div>
    </div>
  );
}
