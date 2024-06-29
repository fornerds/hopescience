import React, { useState } from "react";
import { Button } from "../../components/Button";
import "./TabWithCourses.css";
import mainImage from "../../images/main.png"
import exampleImage from "../../images/example.png"
import opengraphImage from "../../images/opengraph.png"

const tabButtons = [
  { key: "all", label: "전체" },
  { key: "enrolled", label: "수강중" },
  { key: "completed", label: "수강완료" },
];

const buttonStyle = {
  backgroundColor: "transparent",
  width: "104px",
  height: "44px",
  fontFamily: '"Manrope", Helvetica',
  fontSize: "14px",
};

export const TabWithCourses = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState({
    all: [],
    enrolled: [],
    completed: [],
  });

  const allCourses = [
    {
      id: 1,
      title: "마약범죄 재범방지교육 및 인지행동 개선훈련",
      img: mainImage,
      progress: 50,
      status: "수강중",
      paymentDate: "2024-04-10",
      lastAccessed: "2024-04-01",
    },
    {
      id: 2,
      title: "직장내 성희롱 예방교육",
      img: exampleImage,
      progress: 100,
      status: "수강완료",
      paymentDate: "2024-03-15",
      lastAccessed: "2024-03-05",
    },
    {
      id: 3,
      title: "음주폐혜 예방 심리교육",
      img: opengraphImage,
      progress: 23,
      status: "수강중",
      paymentDate: "2024-03-19",
      lastAccessed: "2024-03-15",
    },
    {
      id: 4,
      title: "중독범죄 예방 심리교육",
      img: opengraphImage,
      progress: 99,
      status: "설문조사중",
      paymentDate: "2024-04-03",
      lastAccessed: "2024-03-01",
    },
  ];

  const enrolledCourses = [
    {
      id: 1,
      title: "마약범죄 재범방지교육 및 인지행동 개선훈련",
      img: mainImage,
      progress: 50,
      status: "수강중",
      paymentDate: "2024-04-10",
      lastAccessed: "2024-04-01",
    },
    {
      id: 3,
      title: "음주폐혜 예방 심리교육",
      img: opengraphImage,
      progress: 23,
      status: "수강중",
      paymentDate: "2024-03-19",
      lastAccessed: "2024-03-15",
    },
    {
      id: 4,
      title: "중독범죄 예방 심리교육",
      img: opengraphImage,
      progress: 99,
      status: "설문조사중",
      paymentDate: "2024-04-03",
      lastAccessed: "2024-03-15",
    },
  ];

  const completedCourses = [
    {
      id: 2,
      title: "직장내 성희롱 예방교육",
      img: exampleImage,
      progress: 100,
      status: "수강완료",
      paymentDate: "2024-03-15",
      lastAccessed: "2024-03-05",
    },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleCourseSelection = (courseId) => {
    setSelectedCourses((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].includes(courseId)
        ? prev[activeTab].filter((id) => id !== courseId)
        : [...prev[activeTab], courseId],
    }));
  };

  const toggleSelectAll = () => {
    const currentCourses = getCoursesByTab(activeTab);
    const allSelected = currentCourses.every((course) =>
      selectedCourses[activeTab].includes(course.id)
    );
    setSelectedCourses((prev) => ({
      ...prev,
      [activeTab]: allSelected ? [] : currentCourses.map((course) => course.id),
    }));
  };

  const getCoursesByTab = (tab) => {
    switch (tab) {
      case "all":
        return allCourses;
      case "enrolled":
        return enrolledCourses;
      case "completed":
        return completedCourses;
      default:
        return [];
    }
  };

  const renderCourses = (courses) => {
    return (
      <ul className="mypage-course-list">
        <div className="mypage-course-header">
          <div>
            <input
              type="checkbox"
              name="mypage-course-checkbox-all"
              id="mypage-course-checkbox-all"
              checked={
                courses.length &&
                courses.every((course) =>
                  selectedCourses[activeTab].includes(course.id)
                )
              }
              onChange={toggleSelectAll}
            />
          </div>
          <div className="mypage-course-index-center-align">강의명</div>
          <div className="mypage-course-index-center-align">진도율</div>
          <div className="mypage-course-index-start-align">상태</div>
          <div className="mypage-course-index-start-align">결제일</div>
          <div className="mypage-course-index-start-align">수강신청일</div>
        </div>
        {courses.map((course) => (
          <li key={course.id} className="mypage-course-item">
            <div className="mypage-course-info">
              <div>
                <input
                  type="checkbox"
                  name={`mypage-course-item-${course.id}`}
                  id={course.id}
                  checked={selectedCourses[activeTab].includes(course.id)}
                  onChange={() => toggleCourseSelection(course.id)}
                />
              </div>
              <div className="mypage-course-title">
                <div className="mypage-course-image-wrap">
                  <img
                    className="mypage-course-image"
                    src={course.img}
                    alt={course.title}
                  />
                </div>
                <h3>{course.title}</h3>
              </div>
              <div className="mypage-course-progress-wrap">
                <progress
                  id={course.id}
                  max="100"
                  value={course.progress}
                  className="mypage-course-progress"
                >
                </progress>
                {course.progress}%
              </div>
              <p
                className={`mypage-course-state ${getStatusClassName(course.status)}`}
              >
                {course.status}
              </p>
              <p className="payment-date">{course.paymentDate}</p>
              <p className="last-accessed">{course.lastAccessed}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const getStatusClassName = (status) => {
    const statusClassMap = {
      수강중: "watching",
      설문조사중: "surveying",
      수강완료: "finished",
    };
    return statusClassMap[status] || "";
  };

  return (
    <>
      <div className="tabs">
        {tabButtons.map(({ key, label }) => (
          <Button
            key={key}
            onClick={() => handleTabClick(key)}
            className={activeTab === key ? "active" : ""}
            style={buttonStyle}
            label={label}
          />
        ))}
      </div>
      <div className="course-list">
        {activeTab === "all" && renderCourses(allCourses)}
        {activeTab === "enrolled" && renderCourses(enrolledCourses)}
        {activeTab === "completed" && renderCourses(completedCourses)}
      </div>
    </>
  );
};
