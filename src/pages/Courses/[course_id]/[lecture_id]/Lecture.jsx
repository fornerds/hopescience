import "./style.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header, Footer, Link } from "../../../../components";
import { Pagination } from "../../../../modules/Pagination";
import { VideoPlayer } from "../../../../modules/VideoPlayer";
import { service, courseInquiry } from "../../../../store";

export const Lecture = () => {
  let { course_id, lecture_id } = useParams();
  const { isLoading, getLecture, lecture } = service((state) => ({
    isLoading: state.isLoading,
    getLecture: state.getLecture,
    lecture: state.lecture,
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
                  <Link
                    to={`/courses/${course_id}/${lecture_id}`}
                    label="&#60; 이전영상"
                  />
                  <Link to={`/courses/${course_id}`} label="목록으로" />
                  <Link
                    to={`/courses/${course_id}/${lecture_id}`}
                    label="다음영상 &#62;"
                  />
                </div>
              </>
            )}
          </div>
          <div className="lecture-QnA">
            <img
              className="button-play-3"
              alt="Button play"
              src="/img/button-play-1.svg"
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
