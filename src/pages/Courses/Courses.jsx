import React, { useState, useEffect } from "react";
import "./style.css";
import { Header, Footer } from "../../components";
import { CourseCard } from "../../modules/CourseCard";
import { service } from "../../store";
import leftButtonIcon from "../../icons/left-button.svg"
import activeLeftButtonIcon from "../../icons/active-left-button.svg"
import rightButtonIcon from "../../icons/right-button.svg"
import activeRightButtonIcon from "../../icons/active-right-button.svg"

export const Courses = () => {
  const getServices = service((state) => state.getServices);
  const services = service((state) => state.services);
  const isLoading = service((state) => state.isLoading);

  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(services?.length / coursesPerPage);

  // 현재 페이지에 해당하는 코스 목록 추출
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = services?.slice(indexOfFirstCourse, indexOfLastCourse);

  console.log(currentCourses)

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

  // 페이지 이동 함수
  // const prevPage2 = () => {
  //   if (currentPage2 > 1) {
  //     setCurrentPage(currentPage2 - 1);
  //   }
  // };

  // const nextPage2 = () => {
  //   if (currentPage2 < totalPages2) {
  //     setCurrentPage(currentPage2 + 1);
  //   }
  // };

  useEffect(() => {
    getServices();
  }, []);

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
            <ol className="course-list">
              {isLoading ? (
                <>
                {Array(4).fill(1).map((val, index)=>(
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
                  ({ id, title, thumbnail, price, discounted_price, created_at }) => (
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
                  )
                )
              )}
            </ol>
          </div>
          {/* <div className="courses-section-body">
            <div className="courses-section-pagenation">
              <img
                className="icon-button"
                alt="Go To Prev Page"
                src={
                  currentPage === 1
                    ? leftButtonIcon
                    : activeLeftButtonIcon
                }
                onClick={prevPage2}
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
                onClick={nextPage2}
                disabled={currentPage === totalPages}
              />
            </div>
            <ol className="course-list">
              {isLoading ? (
                <>
                {Array(4).fill(1).map((val, index)=>(
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
                  ({ id, title, thumbnail, price, discounted_price, created_at }) => (
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
                  )
                )
              )}
            </ol>
          </div> */}
        </section>
      </main>
      <Footer />
    </>
  );
};
