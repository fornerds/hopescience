import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../../components/Button";
import "./TabWithCourses.css";
import { enrollment } from "../../store";
import { Link } from "react-router-dom";

// 링크 스타일 정의
const linkStyle = {
  color: "#dee1e6",
  textDecoration: "none",
};

const hoverLinkStyle = {
  textDecoration: "underline",
}; // Link 컴포넌트 추가

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

  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);

  const { getUserEnrollments, enrollments, clearEnrollments, isLoading } =
    enrollment((state) => ({
      getUserEnrollments: state.getUserEnrollments,
      enrollments: state.enrollments,
      clearEnrollments: state.clearEnrollments,
      isLoading: state.isLoading,
    }));

  const myUserId = useMemo(() => {
    const data = sessionStorage.getItem("auth-storage");
    return data ? JSON.parse(data).state?.user?.userId : null;
  }, []);

  useEffect(() => {
    clearEnrollments();
    getUserEnrollments(myUserId);
  }, []);

  useEffect(() => {
    if (enrollments.length > 0) {
      const formattedCourses = enrollments.map((course) => ({
        id: course.id,
        title: course.course_title,
        progress: course.progress,
        status: course.is_completed ? "수강완료" : "수강중",
        paymentDate: new Date(course.enrolled_at).toISOString().split("T")[0],
        completedDate: course.completed_at
          ? new Date(course.completed_at).toISOString().split("T")[0]
          : "미완료",
      }));
      setAllCourses(formattedCourses);
      setEnrolledCourses(
        formattedCourses.filter((course) => course.status !== "수강완료")
      );
      setCompletedCourses(
        formattedCourses.filter((course) => course.status === "수강완료")
      );
    }
  }, [enrollments]);

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
    if (isLoading) {
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
            <div className="mypage-course-index-start-align">수강완료일</div>
          </div>
          <div className="mypage-course-loading">Loading...</div>
        </ul>
      );
    }

    if (courses.length === 0) {
      return <div className="no-courses">수강 중인 과정이 없습니다.</div>;
    }

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
          <div className="mypage-course-index-start-align">수강완료일</div>
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
                <Link
                  to={`/courses/${course.id}`}
                  style={linkStyle}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.textDecoration = "underline")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.textDecoration = "none")
                  }
                >
                  <h3>{course.title}</h3>
                </Link>
              </div>
              <div className="mypage-course-progress-wrap">
                <progress
                  id={course.id}
                  max="100"
                  value={course.progress}
                  className="mypage-course-progress"
                ></progress>
                {course.progress}%
              </div>
              <p
                className={`mypage-course-state ${getStatusClassName(
                  course.status
                )}`}
              >
                {course.status}
              </p>
              <p className="payment-date">{course.paymentDate}</p>
              <p className="last-accessed">{course.completedDate}</p>
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
