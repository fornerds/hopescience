import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./PostEditor.css";
import { Button } from "../../components/Button";
import { inquiry, service, courseInquiry, auth } from "../../store";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const schema = yup
  .object({
    title: yup.string().required("제목을 입력해주세요"),
    category: yup.string().required("카테고리를 선택해주세요"),
    content: yup.string().required("내용을 작성해주세요"),
  })
  .required();

export const PostEditor = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      category: selectedCategory,
      content: "",
    },
  });
  const [buttonLabel, setButtonLabel] = useState("수정하기");

  const { refreshAccessToken, accessToken } = auth((state) => ({
    refreshAccessToken: state.refreshAccessToken,
    accessToken: state.accessToken,
  }));
  const { isLoading, createInquiry, updateInquiry, getInquiry, QnA } = inquiry(
    (state) => ({
      isLoading: state.isLoading,
      createInquiry: state.createInquiry,
      updateInquiry: state.updateInquiry,
      getInquiry: state.getInquiry,
      QnA: state.QnA,
    })
  );

  const { getService, course, isCategoryLoading, clearCourse } = service(
    (state) => ({
      getService: state.getService,
      course: state.course,
      isCategoryLoading: state.isCategoryLoading,
      clearCourse: state.clearCourse,
    })
  );

  const {
    getCourseInquiry,
    createCourseInquiry,
    updateCourseInquiry,
    courseQnA,
  } = courseInquiry((state) => ({
    getCourseInquiry: state.getCourseInquiry,
    createCourseInquiry: state.createCourseInquiry,
    updateCourseInquiry: state.updateCourseInquiry,
    courseQnA: state.courseQnA,
  }));
  const data = sessionStorage.getItem("auth-storage");
  const myUserId = data ? JSON.parse(data).state?.user?.userId : null;
  const refreshToken = data ? JSON.parse(data).state?.refreshToken : null;
  const navigate = useNavigate();
  const location = useLocation();
  let { inquiry_id, course_id, lecture_id, course_inquiry_id } = useParams();

  useEffect(() => {
    if (
      location.pathname === "/QnA/new" ||
      (course_id &&
        lecture_id &&
        location.pathname === `/courses/${course_id}/${lecture_id}/new`)
    ) {
      clearCourse();
      reset({
        title: "",
        category: "",
        content: "",
      });
      if (course_id && lecture_id) {
        getService(course_id).then(() => {
          if (course && course.category) {
            setSelectedCategory(course.category.name);
            reset({ title: "", category: course?.category.name, content: "" });
          }
        });
      }
      setButtonLabel("저장하기");
    } else if (course_id && lecture_id && course_inquiry_id) {
      getCourseInquiry(course_id, course_inquiry_id);
      getService(course_id);
    } else if (inquiry_id) {
      getInquiry(inquiry_id);
    }
  }, [location.pathname, inquiry_id, getInquiry, reset]);

  useEffect(() => {
    if (QnA && location.pathname !== "/QnA/new") {
      clearCourse();
      reset({
        title: QnA?.title,
        category: QnA?.category,
        content: QnA?.content,
      });
    } else if (
      courseQnA &&
      location.pathname ===
        `/courses/${course_id}/${lecture_id}/${course_inquiry_id}/edit`
    ) {
      reset({
        title: courseQnA?.title,
        category: course?.category.name,
        content: courseQnA?.content,
      });
    }
  }, [QnA, reset]);

  const onSubmit = (data, retryAttempted = false) => {
    console.log(data);
    if (myUserId) {
      const { accessToken, refreshToken } = auth.getState();
      if (buttonLabel === "저장하기") {
        if (course_id && lecture_id) {
          createCourseInquiry(
            course_id,
            lecture_id,
            data.title,
            data.content,
            accessToken
          )
            .then(() => {
              navigate(`/courses/${course_id}/${lecture_id}`);
            })
            .catch(async (error) => {
              if (error.response.status === 401 && !retryAttempted) {
                await refreshAccessToken(refreshToken);
                return onSubmit(data, true); // 재시도
              } else {
                console.error("Error during course inquiry creation:", error);
                alert("에러가 발생했습니다: " + error.message);
              }
            });
        } else {
          createInquiry(myUserId, data.title, data.category, data.content);
          navigate("/QnA");
        }
      } else if (buttonLabel === "수정하기") {
        if (course_id && lecture_id && course_inquiry_id) {
          const CourseQnAUpdateSuccess = updateCourseInquiry(
            course_id,
            course_inquiry_id,
            data.title,
            data.content
          );
          if (CourseQnAUpdateSuccess) {
            navigate(`/courses/${course_id}/${lecture_id}`);
          }
        } else {
          const QnAUpdateSuccess = updateInquiry(
            inquiry_id,
            data.title,
            data.category,
            data.content
          );
          if (QnAUpdateSuccess) {
            navigate("/QnA");
          }
        }
      }
    } else {
      alert("로그인이 필요한 작업입니다.");
    }
  };

  useEffect(() => {
    if (course && course.category) {
      setSelectedCategory(course.category.name);
    }
  }, [course]);

  useEffect(() => {
    setValue("category", selectedCategory);
  }, [selectedCategory, setValue]);

  return (
    <main className="post-editor-page-background">
      <div className="post-editor-page">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="post-editor-title-wrap">
            <h2 className="post-editor-title">문의하기</h2>
            <Button
              type="submit"
              label={buttonLabel !== undefined ? buttonLabel : "수정하기"}
              style={{
                width: "105px",
                height: "35px",
                fontSize: "14px",
              }}
            />
          </div>
          <label htmlFor="title" className="post-editor-label">
            제목
          </label>
          <input
            {...register("title")}
            id="title"
            name="title"
            type="text"
            placeholder="문의할 제목을 입력해주세요"
            className="post-editor-title-input"
          />
          {errors.title && (
            <p className="input-error-message">{errors.title.message}</p>
          )}

          <label htmlFor="category" className="post-editor-label">
            카테고리
          </label>
          <select
            name="category"
            id="post-editor-category"
            {...register("category")}
            value={selectedCategory} //
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {course ? (
              <option value={course?.category?.name} selected>
                {course?.category?.name}
              </option>
            ) : (
              <>
                <option value="">카테고리를 선택해주세요</option>
                <option value="강의 문의">강의 문의</option>
                <option value="계정 문의">계정 문의</option>
                <option value="결제/환불 문의">결제/환불 문의</option>
                <option value="서비스 오류 문의">서비스 오류 문의</option>
                <option value="기타 문의">기타 문의</option>
              </>
            )}
          </select>
          {errors.category && (
            <p className="input-error-message">{errors.category.message}</p>
          )}

          <textarea
            name="content"
            id="post-editor-textarea"
            wrap="hard"
            placeholder="문의할 내용을 작성해주세요"
            {...register("content")}
          ></textarea>
          {errors.content && (
            <p className="input-error-message">{errors.content.message}</p>
          )}
        </form>
      </div>
    </main>
  );
};
