import React from "react";

const TwitterIcon = ({ size = 16, color = "#111111", ...props }) => {
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
        d="M1.16675 1.5H5.44453L14.8334 14.5H10.5556L1.16675 1.5Z"
        fill={color}
      />
      <path
        d="M14.8334 1.49951L2.96994 14.4995H1.16675L13.0302 1.49951H14.8334Z"
        fill={color}
      />
    </svg>
  );
};

export default TwitterIcon;
