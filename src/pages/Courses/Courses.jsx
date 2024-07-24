import React, { useState, useEffect } from "react";
import "./style.css";
import { Header, Footer } from "../../components";
import { CourseCard } from "../../modules/CourseCard";
import { service } from "../../store";
import leftButtonIcon from "../../icons/left-button.svg"
import activeLeftButtonIcon from "../../icons/active-left-button.svg"
import rightButtonIcon from "../../icons/right-button.svg"
import activeRightButtonIcon from "../../icons/active-right-button.svg"
import playButtonIcon from "../../icons/play-button.svg"

export const Courses = () => {
  const getServicesbyGroup = service((state) => state.getServicesbyGroup);
  const isLoading = service((state) => state.isLoading);
  const [lectureServices, setLectureServices] = useState([]);
  const [nomalServices, setNomalServices] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const coursesPerPage = 3;
  const coursesPerPage2 = 3;

  // 전체 페이지 수 계산
  const totalPages = Math.ceil((Array.isArray(lectureServices) ? lectureServices.length : 0) / coursesPerPage);
  const totalPages2 = Math.ceil((Array.isArray(nomalServices) ? nomalServices.length : 0) / coursesPerPage2);

  // 현재 페이지에 해당하는 코스 목록 추출
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses =  Array.isArray(lectureServices) ? lectureServices?.slice(indexOfFirstCourse, indexOfLastCourse) : [];

  const indexOfLastCourse2 = currentPage2 * coursesPerPage2;
  const indexOfFirstCourse2 = indexOfLastCourse2 - coursesPerPage2;
  const currentCourses2 = Array.isArray(nomalServices) ? nomalServices?.slice(indexOfFirstCourse2, indexOfLastCourse2) : [];


  // 페이지 이동 함수
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage2 = () => {
    if (currentPage2 > 1) {
      setCurrentPage2(currentPage2 - 1);
    }
  };

  const nextPage2 = () => {
    if (currentPage2 < totalPages2) {
      setCurrentPage2(currentPage2 + 1);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      const lectureServicesData = await getServicesbyGroup(1);
      if (Array.isArray(lectureServicesData)) {
        setLectureServices(lectureServicesData);
      }
      
      const nomalServicesData = await getServicesbyGroup(2);
      if (Array.isArray(nomalServicesData)) {
        setNomalServices(nomalServicesData);
      }
    };
  
    fetchServices();
  }, [getServicesbyGroup]);

  return (
    <>
      <Header />
      <main className="courses-background">
        <section className="courses-section">
          <div className="courses-section-header">
            <h4 className="courses-section-header-h4">Services</h4>
            <h3 className="courses-section-header-h3">
              원하시는 서비스를 클릭해주세요
            </h3>
          </div>
          <div className="courses-section-body">
            <div className="courses-section-pagenation">
              <div className="courses-section-title-wrap">
                <img
                  className="button-play-6"
                  alt="Button play"
                  src={playButtonIcon}
                />
                <h3 className="courses-section-title">강의 서비스</h3>
              </div>
              <div className="courses-section-icon-button-wrap">
                <img
                  className="icon-button"
                  alt="Go To Prev Page"
                  src={
                    currentPage === 1
                      ? leftButtonIcon
                      : activeLeftButtonIcon
                  }
                  onClick={prevPage}
                  disabled={currentPage === 1}
                />
                <img
                  className="icon-button"
                  alt="Go To Next Page"
                  src={
                    currentPage === totalPages
                      ? rightButtonIcon
                      : activeRightButtonIcon
                  }
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                />
              </div>
            </div>
            <ol className="course-list">
              {isLoading ? (
                <>
                {Array(3).fill(1).map((val, index)=>(
                  <li className="skeleton-card" key={index}>
                    <div className="image-skeleton"></div>
                    <div className="title-skeleton"></div>
                    <div className="price-skeleton"></div>
                    <span className="tag-skeleton"></span>
                  </li>
                ))}
                </>
              ) : (
                currentCourses.map(
                  ({ id, title, thumbnail, price, discounted_price, created_at, is_active }) => (
                    (is_active===true) ?
                    <li key={id}>
                      <CourseCard
                        id={id}
                        title={title}
                        src={
                          thumbnail
                        }
                        price={price}
                        discountedPrice={discounted_price}
                        createdAt={created_at}
                      />
                    </li>
                    :""
                  )
                )
              )}
            </ol>
          </div>
          <div className="courses-section-body">
            <div className="courses-section-pagenation">
              <div className="courses-section-title-wrap">
                <img
                  className="button-play-6"
                  alt="Button play"
                  src={playButtonIcon}
                />
                <h3 className="courses-section-title">일반 서비스</h3>
              </div>
              <div className="courses-section-icon-button-wrap">
                <img
                  className="icon-button"
                  alt="Go To Prev Page"
                  src={
                    currentPage2 === 1
                      ? leftButtonIcon
                      : activeLeftButtonIcon
                  }
                  onClick={prevPage2}
                  disabled={currentPage2 === 1}
                />
                <img
                  className="icon-button"
                  alt="Go To Next Page"
                  src={
                    currentPage2 === totalPages2
                      ? rightButtonIcon
                      : activeRightButtonIcon
                  }
                  onClick={nextPage2}
                  disabled={currentPage2 === totalPages2}
                />
              </div>
            </div>
            <ol className="course-list">
              {isLoading ? (
                <>
                {Array(3).fill(1).map((val, index)=>(
                  <li className="skeleton-card" key={index}>
                    <div className="image-skeleton"></div>
                    <div className="title-skeleton"></div>
                    <div className="price-skeleton"></div>
                    <span className="tag-skeleton"></span>
                  </li>
                ))}
                </>
              ) : (
                currentCourses2.map(
                  ({ id, title, thumbnail, price, discounted_price, created_at, is_active }) => (
                    (is_active===true) ?
                    <li key={id}>
                      <CourseCard
                        id={id}
                        title={title}
                        src={
                          thumbnail
                        }
                        price={price}
                        discountedPrice={discounted_price}
                        createdAt={created_at}
                      />
                    </li>
                    : ""
                  )
                )
              )}
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
