import "./style.css";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Header, Footer, Button, Link } from "../../../components";
import { SummaryWithShowMore } from "../../../modules/SummaryWithShowMore";
import { Accordion } from "../../../modules/Accordion";
import { Pagination } from "../../../modules/Pagination/Pagination";
import { VideoModal } from "../../../modules/VideoModal";
import { service, courseInquiry, enrollment } from "../../../store";
import mainImage from "../../../images/main.png"
import playButtonIcon from "../../../icons/play-button.svg"

export const Course = () => {
  let { course_id } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  
  const { isLoading, getService, course, clearCourse } = service(state => ({
    isLoading: state.isLoading,
    getService: state.getService,
    clearCourse: state.clearCourse,
    course: state.course || null
  }));

  const { 
    getCourseInquiries, 
    isLoading: isCourseInquiriesLoading, 
    courseInquiries 
  } = courseInquiry(state => ({
    getCourseInquiries: state.getCourseInquiries,
    isLoading: state.isLoading,
    courseInquiries: state.courseInquiries || null
  }));

  const {isLoading: isEnrollmentLoading, getIsEnrolled, enrollment: enrollmentData, getEnrollmentProgress, enrollmentProgress, clearEnrollment} = enrollment(state => ({isLoading: state.isLoading, getIsEnrolled: state.getIsEnrolled, enrollment: state.enrollment, getEnrollmentProgress: state.getEnrollmentProgress, enrollmentProgress: state.enrollmentProgress, clearEnrollment: state.clearEnrollment }));

  const myUserId = useMemo(() => {
    const data = sessionStorage.getItem("auth-storage");
    return data ? JSON.parse(data).state?.user?.userId : null;
  }, []);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);
  useEffect(() => {
    clearEnrollment();
    if(course_id && myUserId){
      getIsEnrolled(myUserId, course_id)
    }
    clearCourse();
    getService(course_id);
    getCourseInquiries(course_id);
  }, [course_id]);

  useEffect(() => {
    if(enrollmentData){
      getEnrollmentProgress(enrollmentData?.id)
    }
  }, [enrollmentData]);

  // console.log("enrollmentProgress", enrollmentProgress);
  return (
    <>
      <Header />
      <main className="course-background">
        <section className="course-section">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <h2 className="course-title">{course?.title}</h2>
              <div className="course-desc">
                <div className="course-preview">
                  <div className="course-image-wrap">
                    <img
                      src={course?.thumbnail ? course?.thumbnail : mainImage}
                      alt="강의 섬네일"
                      className="course-image"
                    />
                  </div>
                  { enrollmentData ?
                   <></>
                   : 
                   <Button
                    variant="secondary"
                    size="full"
                    label="강의미리보기"
                    onClick={handleOpenModal}
                  /> 
                  }
                </div>
                <div className={enrollmentData ? "enrolled-course-info" : "course-info"}>
                { enrollmentData ?
                   (
                   <>
                    <div className="enrolled-course-progress-container">
                      <h3 className="course-index-text">진도율</h3>
                      <div className="enrolled-course-progress-wrap">
                        {`${enrollmentData?.completed_lecture_count}/${course?.total_lecture_count}`}
                        <progress
                          max="100"
                          value={enrollmentData?.progress}
                          className="enrolled-course-progress"
                        >
                        </progress>
                        {enrollmentData?.progress}%
                      </div>
                    </div>
                    {enrollmentData?.is_completed ? (<>
                      <div className="enrolled-course-certification-wrap">
                        <h3 className="course-index-text">이수증서</h3>
                        <Link to="/mypage/certificates" buttonStyle="default" label="이수증 발급하기" color="white" fontSize="16px"/>
                      </div>
                    </>): <></>}
                   </>
                   )
                   : (
                  <>
                  <div>
                    <h3 className="course-index-text">요약설명</h3>
                    <SummaryWithShowMore summary={course?.summary} />
                    <div className="course-info-flex course-info-price">
                      <h3 className="course-index-text">결제금액</h3>
                      <div className="course-price">
                        <div className="">
                          {course?.discounted_price.toLocaleString()}원
                        </div>{" "}
                        {(course?.price === course?.discounted_price)? "" : <del>{course?.price.toLocaleString()}원</del>}
                      </div>
                    </div>
                    <div className="course-info-flex course-info-service-period">
                      <h3 className="course-index-text">서비스 제공기간</h3>
                      <div className="course-service-period">
                      온라인 상품 구매 후 바로 사용이 가능하며, 무제한으로 서비스 이용이 가능합니다.
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/cart/${myUserId}/${course?.id}`}
                    buttonStyle="default"
                    label="수강신청하기"
                    color="white"
                    fontSize="16px"
                    style={{ width: "100%", height: "56px" }}
                  />
                  </>
                  )}
                </div>
              </div>
              <div className="course-detail">
                <img
                  className="button-play-6"
                  alt="Button play"
                  src={playButtonIcon}
                />
                <div className="course-detail-wrap">
                  <h3 className="course-index-text">상세설명</h3>
                  <pre className="course-detail-desc">
                    {course?.description}
                  </pre>
                </div>
              </div>
              <div className="course-lecture-list">
                <img
                  className="button-play-6"
                  alt="Button play"
                  src={playButtonIcon}
                />
                <div className="course-lecture-list-wrap">
                  <h3 className="course-index-text">강의구성</h3>
                  {course?.sections?.map((section) => (
                    <Accordion key={section.id} section={section} enrollmentData={enrollmentData} enrollmentProgress={enrollmentProgress} />
                  ))}
                </div>
              </div>
              <div className="course-QnA">
                <img
                  className="button-play-6"
                  alt="Button play"
                  src={playButtonIcon}
                />
                <div className="course-QnA-wrap">
                  <h3 className="course-index-text">QnA</h3>
                  <Pagination
                    inquiries={courseInquiries}
                    isLoading={isCourseInquiriesLoading}
                  />
                </div>
              </div>
            </>
          )}
        </section>
        <VideoModal
          isOpen={isOpen}
          videoSrc={course?.sections?.[0]?.lectures?.[0]?.video_url}
          onClose={handleCloseModal}
        />
      </main>
      <Footer />
    </>
  );
};
