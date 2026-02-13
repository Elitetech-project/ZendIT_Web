import React from "react";

const TelegramIcon = ({ size = 16, color = "#111111", ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.666 2L11.9994 14L7.33271 9.3056L10.1598 6.50273L6.28567 9.182L7.96164 10.7716L5.66603 13.3333L4.99937 9.3056L1.33325 7.33333L14.666 2Z"
        fill={color}
      />
    </svg>
  );
};

export default TelegramIcon;
