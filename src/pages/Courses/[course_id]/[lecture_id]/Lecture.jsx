import "./style.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header, Footer, Link } from "../../../../components";
import { Pagination } from "../../../../modules/Pagination";
import { VideoPlayer } from "../../../../modules/VideoPlayer";
import { service, courseInquiry } from "../../../../store";
import playIcon from "../../../../icons/button-play-1.svg"

export const Lecture = () => {
  let { course_id, lecture_id } = useParams();
  const [nextLecture, setNextLecture] = useState([])
  const { isLoading, getLecture, lecture, getNextLecture } = service((state) => ({
    isLoading: state.isLoading,
    getLecture: state.getLecture,
    lecture: state.lecture,
    getNextLecture: state.getNextLecture
  }));
  const { isCourseInquiryLoading, getCourseInquiries, courseInquiries } =
    courseInquiry((state) => ({
      isCourseInquiryLoading: state.isCourseInquiryLoading,
      getCourseInquiries: state.getCourseInquiries,
      courseInquiries: state.courseInquiries,
    }));

  useEffect(() => {
    getLecture(lecture_id);
    getCourseInquiries(course_id);
  }, [course_id, lecture_id]);

  useEffect(()=> {
    async function fetchData() {
      setNextLecture([])
      const res = await getNextLecture(course_id, lecture_id);
      setNextLecture(res)
    }
    fetchData();
  }, [course_id, lecture_id])

  const filteredInquiries = courseInquiries?.filter(
    (inquiry) => inquiry?.lecture_id === Number(lecture_id)
  );

  return (
    <>
      <Header />
      <main className="lecture-background">
        <section className="lecture-section">
          <div className="lecture-video-wrap">
            {isLoading ? (
              <p className="color-white">Loading...</p>
            ) : (
              <>
                <h2 className="lecture-title">
                  {lecture?.course_section_id}-{lecture?.id}. {lecture?.title}
                </h2>
                <VideoPlayer videoUrl={lecture?.video_url} />
                <div className="lecture-link-wrap">
                  {nextLecture?.previous ? (
                    <Link
                      to={`/courses/${course_id}/${nextLecture.previous.lecture_id}`}
                      label="이전영상"
                      color="white"
                      buttonStyle="default"
                    />
                  ) : (
                    <div className="link-placeholder"></div>
                  )}
                  
                  <Link 
                    to={`/courses/${course_id}`} 
                    label="목록으로" 
                    color="white" 
                    buttonStyle="default" 
                  />
                  
                  {nextLecture?.next ? (
                    <Link
                      to={`/courses/${course_id}/${nextLecture.next.lecture_id}`}
                      label="다음영상"
                      color="white"
                      buttonStyle="default"
                    />
                  ) : (
                    <div className="link-placeholder"></div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="lecture-QnA">
            <img
              className="button-play-3"
              alt="Button play"
              src={playIcon}
            />
            <div className="lecture-QnA-wrap">
              <h3 className="lecture-index-text">QnA</h3>
              <Pagination
                inquiries={filteredInquiries}
                isLoading={isCourseInquiryLoading}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};
