import React, { useState } from "react";
import "./Accordion.css";
import "./FAQAccordion.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import arrowUpIcon from "../../icons/chevron-up-large.svg";
import arrowUpBigIcon from "../../icons/chevron-up-large02.svg";
import arrowDownIcon from "../../icons/chevron-down-large.svg";
import arrowDownBigIcon from "../../icons/chevron-down-large02.svg";
import videoIcon from "../../icons/video.svg";
import lockIcon from "../../icons/lock.svg";
import checkIcon from "../../icons/lock-1.svg"

export const Accordion = ({ section, enrollmentData, enrollmentProgress }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  let { course_id } = useParams();

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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
            {section.title}
          </h3>
          <span className="accordion-icon">
            {activeIndex === section.id ? (
              <img
                alt="강의 목록 간략히"
                src={arrowUpBigIcon}
                className="accodion-icon"
              />
            ) : (
              <img
                alt="강의 목록 더보기"
                src={arrowDownBigIcon}
                className="accodion-icon"
              />
            )}
          </span>
        </div>
        <div className="accordion-content">
        {section.lectures.map((lecture) => (
          enrollmentData ? (
            <Link
              key={`${section.id}-${lecture.id}`}
              className="accordion-content-item"
              to={`/courses/${course_id}/${lecture.id}`}
            >
              <div className="accordion-content-item-title">
                <img
                  className="play-media"
                  alt="Play media"
                  src={videoIcon}
                />{" "}
                {lecture.title} &#40;
                {lecture.video_duration}&#41;
              </div>
              {enrollmentProgress.filter(videoProcess => videoProcess.is_completed === true).some(progress => progress.lecture_id === lecture.id) ? (
                <img
                  className="img-9"
                  alt="checkIcon"
                  src={checkIcon}
                />
              ) : (
                <></>
              )}
            </Link>
          ) : (
            <div
              key={`${section.id}-${lecture.id}`}
              className="accordion-content-item"
              onClick={() => alert("구매 후에 이용이 가능합니다.")}
            >
              <div className="accordion-content-item-title">
                <img
                  className="play-media"
                  alt="Play media"
                  src={videoIcon}
                />{" "}
                {section.order}-{lecture.order}. {lecture.title} &#40;
                {lecture.video_duration}&#41;
              </div>
              <img className="lock" alt="Lock" src={lockIcon} />
            </div>
          )
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
                  src={arrowUpIcon}
                />
              ) : (
                <img
                  className="img-9"
                  alt="Chevron down large"
                  src={arrowDownIcon}
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
