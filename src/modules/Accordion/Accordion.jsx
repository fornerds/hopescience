import React, { useState } from "react";
import "./Accordion.css";
import "./FAQAccordion.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export const Accordion = ({ section }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  let { course_id } = useParams();

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // console.log(section);

  return (
    <div className="accordion-container">
      <div
        className={`accordion-item ${
          activeIndex === section.id ? "active" : ""
        }`}
        key={section.id}
        onClick={() => toggleAccordion(section.id)}
      >
        <div className="accordion-header">
          <h3>
            {section.order}. {section.title}
          </h3>
          <span className="accordion-icon">
            {activeIndex === section.id ? (
              <img
                alt="강의 목록 간략히"
                src="/img/chevron-up-large-8.svg"
                className="accodion-icon"
              />
            ) : (
              <img
                alt="강의 목록 더보기"
                src="/img/chevron-down-large-8.svg"
                className="accodion-icon"
              />
            )}
          </span>
        </div>
        <div className="accordion-content">
          {section.lectures.map((lecture) => (
            <Link
              key={`${section.id}-${lecture.id}`}
              className="accordion-content-item"
              to={`/courses/${course_id}/${lecture.id}`}
            >
              <div className="accordion-content-item-title">
                <img
                  className="play-media"
                  alt="Play media"
                  src="/img/play-media.svg"
                />{" "}
                {section.order}-{lecture.order}. {lecture.title} &#40;
                {lecture.video_duration}&#41;
              </div>
              <img className="lock" alt="Lock" src="/img/lock-1.svg" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FaqAccordion = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-accordion">
      {faqs.map((faq, index) => (
        <div className="faq-item" key={index}>
          <div className="faq-question-wrap">
            <div className="faq-question">{faq.question}</div>
            <button className="faq-icon" onClick={() => handleToggle(index)}>
              {activeIndex === index ? (
                <img
                  className="img-9"
                  alt="Chevron up large"
                  src="/icons/chevron-up-large.svg"
                />
              ) : (
                <img
                  className="img-9"
                  alt="Chevron down large"
                  src="/icons/chevron-down-large.svg"
                />
              )}
            </button>
          </div>
          <div
            className={`faq-answer ${activeIndex === index ? "active" : ""}`}
          >
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
};
