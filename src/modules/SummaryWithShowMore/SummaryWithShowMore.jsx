import React, { useState, useRef, useEffect } from "react";

export const SummaryWithShowMore = ({ summary }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSummaryLong, setIsSummaryLong] = useState(false);
  const summaryRef = useRef(null);

  useEffect(() => {
    if (summaryRef.current) {
      const { scrollHeight, offsetHeight } = summaryRef.current;
      setIsSummaryLong(scrollHeight > offsetHeight);
    }
  }, []);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div
        ref={summaryRef}
        style={{
          width: "100%",
          height: "78px",
          marginTop: "16px",
          fontFamily: '"Manrope", Helvetica',
          fontSize: "15px",
          lineHeight: "24px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: isExpanded ? "unset" : 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {summary}
      </div>
      {isSummaryLong && (
        <button
          onClick={toggleExpansion}
          style={{
            color: "#A5A5A5",
            backgroundColor: "transparent",
            border: "0",
            margin: "16px 0 0",
            padding: "0",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          {isExpanded ? "간략히" : "Show More"}
        </button>
      )}
    </>
  );
};
