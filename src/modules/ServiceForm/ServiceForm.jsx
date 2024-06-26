import React, { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import "./ServiceForm.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal } from "../Modal";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { service } from "../../store";
import axios from "axios";
import arrowUpIcon from "../../icons/chevron-up-large.svg"
import arrowDownIcon from "../../icons/chevron-down-large-4.svg"

const schema = yup
  .object({
    courseTitle: yup.string().required("서비스명을 입력해주세요."),
    courseCategoryId: yup.string().required("카테고리를 선택해주세요."),
    courseGroupId: yup.string().required("서비스 타입을 선택해주세요."),
    courseStatus: yup.string().required("서비스 상태를 선택해주세요."),
    courseSummary: yup.string().required("요약설명을 작성해주세요."),
    courseDescription: yup.string().required("설명을 작성해주세요."),
    coursePrice: yup.number().positive("가격은 양수여야 합니다.").required(),
    courseDiscount: yup.number().min(0, "할인 가격은 0 이상이어야 합니다."),
  })
  .required();

export const ServiceForm = () => {
  const [buttonLabel, setButtonLabel] = useState("서비스 수정");
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  let { course_id } = useParams();
  const createService = service((state) => state.createService);
  const updateService = service((state) => state.updateService);
  const course = service((state) => state.course);
  const clearCourse = service((state) => state.clearCourse);
  const getService = service((state) => state.getService);
  const navigate = useNavigate();
  const getCategories = service((state) => state.getCategories);
  const categories = service((state) => state.categories);
  const getGroups = service((state) => state.getGroups);
  const groups = service((state) => state.groups);
  const [totalUploadProgress, setTotalUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      courseTitle: "",
      courseSummary: "",
      courseDescription: "",
      coursePrice: 0,
      courseDiscount: 0,
      courseCategoryId: 1,
      courseGroupId: 1,
      courseCategory: "",
      courseGroup: "",
      sections: [
        {
          title: "",
          order: 1,
          lectures: [
            {
              title: "",
              videoUrl: null,
              videoDuration: null,
              order: 1,
            },
          ],
        },
      ],
    },
  });

  useEffect(() => {
    if(course_id){
      getService(course_id);
    } else {
      clearCourse();
      setButtonLabel("서비스 등록");
      reset({
        courseTitle: "",
        courseSummary: "",
        courseDescription: "",
        courseCategoryId: 1,
        courseGroupId: 1,
        courseCategory: "",
        courseGroup: "",
        coursePrice: 0,
        courseDiscount: 0,
        sections: [
          {
            title: "",
            order: 1,
            lectures: [
              {
                title: "",
                videoUrl: null,
                videoDuration: null,
                order: 1,
              },
            ],
          },
        ],
      });
    }
  }, [course_id, getService, clearCourse, reset]);

  if(course){
    console.log(course)
  }

  // const onSubmit = async (data) => {

    // const category = categories.find((c) => c.id === Number(data.courseCategoryId));
    // const group = groups.find((g) => g.id === Number(data.courseGroupId));
    // const formData = new FormData();

    // console.log("Form Data:", data);
    // console.log("category:", category.name);
    // console.log("group:", group.name);

    // formData.append("title", data.courseTitle);
    // formData.append("category_id", data.courseCategoryId);
    // formData.append("group_id", data.courseGroupId);
    // formData.append("category", category.name);
    // formData.append("group", group.name);
    // formData.append("summary", data.courseSummary);
    // formData.append("is_active", data.courseStatus === "활성화" ? true : false);
    // formData.append("description", data.courseDescription);
    // formData.append("price", data.coursePrice);
    // formData.append("discounted_price", data.courseDiscount);
    // if (data.thumbnail) {
    //   formData.append("thumbnail_image", data.thumbnail);
    // }

    // let totalDuration = 0;
    // let totalLectureCount = 0;
    // const sectionsData = [];

    // data.sections.forEach((section, sectionIndex) => {
    //   const sectionData = {
    //     title: section.title,
    //     description: "",
    //     order: sectionIndex + 1,
    //     lectures: [],
    //   };

    //   section.lectures.forEach((lecture, lectureIndex) => {
    //     totalLectureCount += 1;
    //     const lectureData = {
    //       title: lecture.title,
    //       videoUrl: lecture.videoUrl || null,
    //       videoDuration: typeof(lecture.videoDuration) === 'string' ? lecture.videoDuration : formatDuration(lecture.videoDuration || 0),
    //       order: lectureIndex + 1,
    //     };
    //     if(lecture.videoDuration && typeof(lecture.videoDuration) === 'string') {
    //       totalDuration += parseDuration(lecture.videoDuration);
    //     }else if(lecture.videoDuration){
    //       totalDuration += lecture.videoDuration
    //     }
    //     sectionData.lectures.push(lectureData);
    //   });

    //   sectionsData.push(sectionData);
    // });

    // formData.append("total_duration", formatDuration(totalDuration));
    // formData.append("total_lecture_count", totalLectureCount.toString());
    // formData.append("sections", JSON.stringify(sectionsData));

    // console.log("Form Data:", formData);

  //   if (buttonLabel === "서비스 등록") {
  //     const createServiceSuccess = await createService(formData);
  //     if (createServiceSuccess) {
  //       navigate("/admin/service");
  //     }
  //   } else {
  //     // 1. 데이터 구조 확인 2. 파일 형식의 데이터 전달방식 수정하기
  //     const updateServiceSuccess = await updateService(course_id, formData);
  //     if (updateServiceSuccess) {
  //       navigate("/admin/service");
  //     }
  //   }
  // };

  const onSubmit = async (data) => {
    try {
    const category = categories.find((c) => c.id === Number(data.courseCategoryId));
    const group = groups.find((g) => g.id === Number(data.courseGroupId));
    const formData = new FormData();
  
    // 기본 정보 추가
    formData.append("title", data.courseTitle);
    formData.append("category_id", data.courseCategoryId);
    formData.append("group_id", data.courseGroupId);
    formData.append("category", category.name);
    formData.append("group", group.name);
    formData.append("summary", data.courseSummary);
    formData.append("is_active", data.courseStatus === "활성화" ? "true" : "false");
    formData.append("description", data.courseDescription);
    formData.append("price", data.coursePrice);
    formData.append("discounted_price", data.courseDiscount);
    if (data.thumbnail) {
      formData.append("thumbnail_image", data.thumbnail);
    }
  
    let totalDuration = 0;
    let totalLectureCount = 0;
    const sectionsData = [];
    const videoUploads = [];
  
    for (let sectionIndex = 0; sectionIndex < data.sections.length; sectionIndex++) {
      const section = data.sections[sectionIndex];
      const sectionData = {
        title: section.title,
        description: "",
        order: sectionIndex + 1,
        lectures: [],
      };
  
      for (let lectureIndex = 0; lectureIndex < section.lectures.length; lectureIndex++) {
        const lecture = section.lectures[lectureIndex];
        totalLectureCount += 1;
        
        const lectureData = {
          title: lecture.title,
          order: lectureIndex + 1,
        };
  
        if (lecture.videoDuration) {
          if (typeof lecture.videoDuration === 'string') {
            totalDuration += parseDuration(lecture.videoDuration);
            lectureData.videoDuration = lecture.videoDuration;
          } else {
            totalDuration += lecture.videoDuration;
            lectureData.videoDuration = formatDuration(lecture.videoDuration);
          }
        }
  
        const lectureElement = document.getElementById(`lecture-${sectionIndex}-${lectureIndex}`);
        const fileInput = lectureElement.querySelector('input[type="file"]');
        
        if (fileInput && fileInput.files.length > 0) {
          videoUploads.push({
            file: fileInput.files[0],
            sectionIndex,
            lectureIndex
          });
        } else if (lecture.videoUrl) {
          lectureData.videoUrl = lecture.videoUrl;
        }
  
        sectionData.lectures.push(lectureData);
      }
  
      sectionsData.push(sectionData);
    }
  
    // 영상 업로드
    if (videoUploads.length > 0) {
      const videoFormData = new FormData();
      videoUploads.forEach(upload => {
        videoFormData.append('videos', upload.file);
      });

      setTotalUploadProgress(0); // 업로드 시작 시 진행률 초기화
      const response = await axios.post('https://nike-c5ae6242356b.herokuapp.com/courses/video', videoFormData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setTotalUploadProgress(percentCompleted);
        }
      });

      if (response.data && response.data.length === videoUploads.length) {
        response.data.forEach((uploadedVideo, index) => {
          const { sectionIndex, lectureIndex } = videoUploads[index];
          sectionsData[sectionIndex].lectures[lectureIndex].videoUrl = uploadedVideo.video_url;
        });
      } else {
        throw new Error('Uploaded video count does not match');
      }
    }
  
    formData.append("total_duration", formatDuration(totalDuration));
    formData.append("total_lecture_count", totalLectureCount.toString());
    formData.append("sections", JSON.stringify(sectionsData));
  
    // 서비스 생성/수정
    if (course_id) {
      await updateService(course_id, formData);
      console.log('Course updated successfully');
      alert('서비스가 성공적으로 수정되었습니다.');
    } else {
      await createService(formData);
      console.log('Course created successfully');
      alert('서비스가 성공적으로 생성되었습니다.');
    }
    navigate("/admin/service");

  } catch (error) {
    console.error('Error:', error);
    if (error.message === 'Uploaded video count does not match') {
      alert('영상 업로드 중 오류가 발생했습니다: 업로드된 비디오 수가 일치하지 않습니다.');
    } else {
      alert('서비스 저장 중 오류가 발생했습니다: ' + error.message);
    }
    setTotalUploadProgress(0); // 오류 발생 시 진행률 초기화
  } finally {
    setTotalUploadProgress(100); // 프로세스 완료 시 100%로 설정
  }
};

  const onError = (errors) => {
    console.error("Form Errors:", errors);
    if (
      !errors.courseTitle &&
      !errors.courseDescription &&
      !errors.courseSummary &&
      !errors.coursePrice &&
      errors.sections
    ) {
      errors.sections.forEach((sectionError, index) => {
        if (sectionError.title) {
          setErrorMessage(
            `서비스 등록하기 위해선 세션 이름이 필요합니다. 세션 이름을 작성해주세요.`
          );
          setShowModal(true);
        } else if (sectionError.lectures) {
          sectionError.lectures &&
            sectionError.lectures.forEach((lectureError, lectureIndex) => {
              if (lectureError.title) {
                setErrorMessage(
                  `서비스 등록하기 위해선 강의명이 필요합니다. 강의명을 작성해주세요.`
                );
                setShowModal(true);
              }
              if (lectureError.videoUrl) {
                setErrorMessage(
                  `서비스 등록하기 위해선 강의 파일이 필요합니다. 강의마다 파일을 선택한 뒤, 서비스 등록을 해주세요.`
                );
                setShowModal(true);
              }
            });
        }
      });
    }
  };

  const setupVideoMetadata = (sectionIndex, lectureIndex, file) => {
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration;
      setValue(
        `sections[${sectionIndex}].lectures[${lectureIndex}].videoDuration`,
        duration
      );
    };
    videoElement.src = URL.createObjectURL(file);
  };

  const formatDuration = (duration) => {
    const seconds = Math.floor(duration % 60);
    const minutes = Math.floor((duration / 60) % 60);
    const hours = Math.floor(duration / 3600);

    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedHours = hours < 10 ? `0${hours}` : hours;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const parseDuration = (durationString) => {
    const [hours, minutes, seconds] = durationString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  useEffect(() => {
    if (course_id && course) {
      const defaultValues = {
        courseTitle: course.title || "",
        courseDescription: course.description || "",
        courseSummary: course.summary || "",
        coursePrice: course.price || 0,
        courseDiscount: course.discounted_price || 0,
        courseCategoryId: course.category.id || 1,
        courseGroupId: course.group.id || 1,
        courseCategory: course.category.name || "양형교육",
        courseGroup: course.group.name || "강의",
        courseStatus: course.is_active ? "활성화" : "비활성화",
        thumbnail: course.thumbnail_image || "",
        sections: course.sections.map((section) => ({
          title: section.title,
          description: section.description,
          order: section.order,
          lectures: section.lectures.map((lecture) => ({
            title: lecture.title,
            videoUrl: lecture.videoUrl,
            videoDuration: lecture.video_duration,
            order: lecture.order,
          })),
        })),
      };
      reset(defaultValues);
    }
  }, [course, reset]);

  useEffect(() => {
    getCategories();
    getGroups();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="service-form-wrap">
          <div className="service-form-buttons-wrap">
            {totalUploadProgress > 0 && totalUploadProgress < 100 && (
              <div className="upload-progress-bar">
                <div 
                  className="upload-progress-fill" 
                  style={{width: `${totalUploadProgress}%`}}
                ></div>
                <span className="upload-progress-text">{totalUploadProgress}%</span>
              </div>
            )}
            <Button
              label={buttonLabel !== undefined ? buttonLabel : "서비스 수정"}
              className="create-service-button"
              type="submit"
            />
          </div>

          <AccordionSection title="일반정보">
            <GeneralInfo
              register={register}
              errors={errors}
              categories={categories}
              groups={groups}
            />
          </AccordionSection>
          {location.pathname !== "/admin/service/new" && (
            <AccordionSection title="썸네일">
              <ThumbnailUploader register={register} setValue={setValue} course_id={course_id} getValues={getValues}/>
            </AccordionSection>
          )}
          <AccordionSection title="가격정보">
            <PricingInfo register={register} errors={errors} />
          </AccordionSection>

          <AccordionSection title="강의목록">
            <CourseBuilder
              setupVideoMetadata={setupVideoMetadata}
              control={control}
              register={register}
              getValues={getValues}
              setValue={setValue}
              watch={watch}
              errors={errors}
              setShowModal={setShowModal}
              setErrorMessage={setErrorMessage}
            ></CourseBuilder>
          </AccordionSection>
        </div>
      </form>
      <Modal
        modalTitle="서비스 등록 오류"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <p>{errorMessage}</p>
      </Modal>
    </>
  );
};

const AccordionSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="service-form-accordian">
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="service-form-accordian-header"
      >
        {title}
        {isOpen ? (
          <img src={arrowUpIcon} alt="" />
        ) : (
          <img src={arrowDownIcon} alt="" />
        )}
      </button>
      {isOpen && (
        <div className="service-form-accordian-content">{children}</div>
      )}
    </div>
  );
};

const GeneralInfo = ({ register, errors, categories, groups }) => {
  return (
    <>
      <div className="service-form-input-group">
        <label htmlFor="courseTitle" className="service-form-label">
          서비스명
        </label>
        <input
          {...register("courseTitle")}
          type="text"
          name="courseTitle"
          id="courseTitle"
          className="service-form-input"
          placeholder="서비스명을 작성해주세요."
        />
        {errors.courseTitle && (
          <p className="input-error-message">{errors.courseTitle.message}</p>
        )}
      </div>
      <div className="service-form-input-group-flexbox">
        <div className="service-form-input-group">
          <label htmlFor="courseCategoryId" className="service-form-label">
            카테고리
          </label>
          <select
            type="text"
            name="courseCategoryId"
            id="courseCategoryId"
            className="service-form-input"
            {...register("courseCategoryId")}
          >
            {categories.length > 0
              ? categories.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))
              : (
              <option value={1}>양형교육</option>
            )}
          </select>
        </div>
        <div className="service-form-input-group">
          <label htmlFor="courseGroupId" className="service-form-label">
            서비스 종류
          </label>
          <select
            type="text"
            name="courseGroupId"
            id="courseGroupId"
            className="service-form-input"
            {...register("courseGroupId")}
          >
            {groups.length > 0
              ? groups.map((group) => (
                  <option value={group.id} key={group.id}>
                    {group.name}
                  </option>
                ))
              : (
              <option value={1}>강의</option>
            )}
          </select>
        </div>
      </div>
      <div className="service-form-input-group">
        <label htmlFor="courseStatus" className="service-form-label">
          서비스 상태
        </label>
        <select
          type="text"
          name="courseStatus"
          id="courseStatus"
          className="service-form-input"
          {...register("courseStatus")}
        >
          <option value="활성화">활성화</option>
          <option value="비활성화">비활성화</option>
        </select>
      </div>
      <div className="service-form-input-group">
        <label htmlFor="courseSummary" className="service-form-label">
          요약설명
        </label>
        <textarea
          {...register("courseSummary")}
          name="courseSummary"
          id="courseSummary"
          className="service-form-course-summary"
          wrap="hard"
          placeholder="요약 설명을 적어주세요."
        />
        {errors.courseSummary && (
          <p className="input-error-message">
            {errors.courseSummary.message}
          </p>
        )}
        <label htmlFor="courseDescription" className="service-form-label">
          설명
        </label>
        <textarea
          {...register("courseDescription")}
          name="courseDescription"
          id="courseDescription"
          className="service-form-course-description"
          wrap="hard"
          placeholder="설명을 적어주세요."
        />
        {errors.courseDescription && (
          <p className="input-error-message">
            {errors.courseDescription.message}
          </p>
        )}
      </div>
    </>
  );
};

const ThumbnailUploader = ({ register, setValue, course_id, getValues }) => {
  // const uploadThumbnail = service((state) => state.uploadThumbnail);
  // const isUploadThumbnailLoading = service((state)=> state.isUploadThumbnailLoading);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const [preview, setPreview] = useState("");

  const handleFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview("");
      setValue("thumbnail", null);
    }
  };

  useEffect(()=>{
    if(!!getValues("thumbnail")){
      setPreview(getValues("thumbnail"))
    }
  },[getValues("thumbnail")])

  const handleThumbnailUpload = async (e) => {
    e.preventDefault();
    const thumbnail = document.getElementById('thumbnail').files[0];
    const formData = new FormData();
    formData.append('thumbnail', thumbnail);

    // (1) zustand로 API 통신 => 422 에러 발생
    // const response = await uploadThumbnail(formData, course_id);
    // if (response) {
    //   const thumbnailUrl = response.data.thumbnail_url;
    //   setValue("thumbnail", thumbnailUrl);
    // }

    // (2) zustand 없이 직접 API 통신
    try {
      setIsVideoUploading(true)
      // Axios 요청 설정
      const response = await axios.post(`https://nike-c5ae6242356b.herokuapp.com/courses/${course_id}/thumbnail`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.status === 200) {
        // 업로드 성공 후 처리할 로직
        alert("썸네일이 성공적으로 업로드되었습니다.");
  
        // 업로드된 썸네일 URL을 해당 섹션 및 강의의 videoUrl에 설정
        const thumbnailUrl = response.data.thumbnail_url;
        setValue("thumbnail", thumbnailUrl);
      } else {
        // 업로드 실패 시 처리할 로직
        alert("썸네일 업로드에 실패하였습니다.");
      }
    } catch (error) {
      console.error("Video Upload Error:", error.response || error);
      alert("썸네일 업로드 중 오류가 발생하였습니다.");
    } finally {
      setIsVideoUploading(false)
    }
  };

  const handleClear = () => {
    setPreview("");
    setValue("thumbnail", null);
  };

  return (
    <>
      <div className="service-form-add-section-button-wrap">
        <button className="service-form-upload-button" onClick={handleThumbnailUpload}>
          {isVideoUploading ? (
            <>
              썸네일 업로드 중 <div className="loader"></div>
            </>
          ) : (
            <>썸네일 업로드</>
          )}
        </button>
      </div>
      <input
        className="service-form-image-upload-button"
        type="file"
        accept="image/*"
        id="thumbnail"
        onChange={(e) => handleFileChange(e)}
      />
      {preview && (
        <div className="service-form-image-preview">
          <img
            src={preview}
            alt="Preview"
            style={{ width: "300px", height: "auto" }}
          />
          <button
            className="service-form-image-clear-button"
            onClick={handleClear}
          >
            선택한 이미지 지우기
          </button>
        </div>
      )}
    </>
  );
};

const PricingInfo = ({ register, errors }) => {
  return (
    <>
      <div className="service-form-input-group-flexbox">
        <div className="service-form-input-group">
          <label htmlFor="coursePrice" className="service-form-label">
            기존 가격
          </label>
          <input
            {...register("coursePrice")}
            type="number"
            name="coursePrice"
            id="coursePrice"
            className="service-form-input"
            step="10"
          />
          {errors.coursePrice && (
            <p className="input-error-message">{errors.coursePrice.message}</p>
          )}
        </div>
        <div className="service-form-input-group">
          <label htmlFor="courseDiscount" className="service-form-label">
            할인된 가격 &#40;최종 가격&#41;
          </label>
          <input
            {...register("courseDiscount")}
            type="number"
            name="courseDiscount"
            id="courseDiscount"
            className="service-form-input"
            step="10"
          />
          {errors.courseDiscount && (
            <p className="input-error-message">
              {errors.courseDiscount.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const CourseBuilder = ({
  control,
  register,
  getValues,
  setValue,
  watch,
  setupVideoMetadata,
  errors,
  setShowModal,
  setErrorMessage,
}) => {
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  // const uploadVideo = service((state) => state.uploadVideo);
  // const uploadVideoLoading = service((state) => state.isUploadLoading);
  const [isVideoUploading, setIsVideoUploading] = useState(false);

  const addSection = (e) => {
    e.preventDefault();
    const sectionIndex = sectionFields.length;
    appendSection({
      title: "",
      order: sectionIndex + 1,
      lectures: [
        {
          title: "",
          videoUrl: null,
          videoDuration: null,
          order: 1,
        },
      ],
    });
  };

  useEffect(() => {
    sectionFields.forEach((section, index) => {
      setValue(`sections[${index}].order`, index + 1);
    });
  }, [sectionFields, setValue]);

  // const handleVideoUpload = async (e) => {
  //   e.preventDefault();
  //   const sectionFields = getValues("sections");
  //   const formData = new FormData();

  //   // videoUrl이 null인 비디오 파일만 FormData에 추가합니다.
  //   sectionFields.forEach((section, sectionIndex) => {
  //     section.lectures.forEach((lecture, lectureIndex) => {
  //       if (!lecture.videoUrl) {
  //         const fileInput = document.querySelector(`#lecture-${sectionIndex}-${lectureIndex}-file`);
  //         if (fileInput && fileInput.files[0]) {
  //           formData.append('videos', fileInput.files[0]);
  //         }
  //       }
  //     });
  //   });

  //   // (1) zustand를 이용한 API 통신 => 422 에러 발생
  //   // const response = await uploadVideo(formData);

  //   // if (response) {
  //   //   const videoUrls = response.data;

  //   //   let tempIndex = 0;
  //   //   sectionFields.forEach((section, sectionIndex) => {
  //   //     section.lectures.forEach((lecture, lectureIndex) => {
  //   //       if (!lecture.videoUrl && tempIndex < videoUrls.length) {
  //   //         setValue(`sections[${sectionIndex}].lectures[${lectureIndex}].videoUrl`, videoUrls[tempIndex].video_url);
  //   //         tempIndex += 1;
  //   //       }
  //   //     });
  //   //   });

  //   //   // console.log(getValues("sections"));
  //   // }

  //   // (2) zustand 없이 직접 API 통신
  //   try {
  //     setIsVideoUploading(true);
  //     // Axios 요청 설정
  //     const response = await axios.post('https://nike-c5ae6242356b.herokuapp.com/courses/video', formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });
  
  //     if (response.status === 200) {
  //       // 업로드 성공 후 처리할 로직
  //       alert("비디오가 성공적으로 업로드되었습니다.");
  
  //       // 업로드된 비디오 URL을 해당 섹션 및 강의의 videoUrl에 설정
  //       const videoUrls = response.data;
    
  //       let tempIndex = 0;
  //       sectionFields.forEach((section, sectionIndex) => {
  //         section.lectures.forEach((lecture, lectureIndex) => {
  //           if (!lecture.videoUrl && tempIndex < videoUrls.length) {
  //             setValue(`sections[${sectionIndex}].lectures[${lectureIndex}].videoUrl`, videoUrls[tempIndex].video_url);
  //             tempIndex += 1;
  //           }
  //         });
  //       });
    
  //       console.log(getValues("sections"));
  //     } else {
  //       // 업로드 실패 시 처리할 로직
  //       alert("비디오 업로드에 실패하였습니다.");
  //     }
  //   } catch (error) {
  //     console.error("Video Upload Error:", error.response || error);
  //     alert("비디오 업로드 중 오류가 발생하였습니다.");
  //   } finally {
  //     setIsVideoUploading(false); // 요청이 완료된 후에는 로딩 상태를 false로 설정
  //   }

  //   // (3) API 통신없이 테스트용 URL 생성 로직
  //   // try {
  //   //   uploadVideoLoading = true;
  
  //   //   // 테스트용 URL 생성 로직
  //   //   const videoUrls = [];
  //   //   formData.forEach((file, key) => {
  //   //     const testUrl = `https://example.com/test_video_${key}.mp4`;
  //   //     videoUrls.push({ video_url: testUrl });
  //   //   });
  
  //   //   // 업로드 성공 후 처리할 로직
  //   //   uploadVideoLoading = false;
  //   //   alert("비디오가 성공적으로 업로드되었습니다.");
  
  //   //   // 업로드된 비디오 URL을 해당 섹션 및 강의의 videoUrl에 설정
  //   //   let tempIndex = 0;
  //   //   sectionFields.forEach((section, sectionIndex) => {
  //   //     section.lectures.forEach((lecture, lectureIndex) => {
  //   //       if (!lecture.videoUrl && tempIndex < videoUrls.length) {
  //   //         setValue(`sections[${sectionIndex}].lectures[${lectureIndex}].videoUrl`, videoUrls[tempIndex].video_url);
  //   //         tempIndex += 1;
  //   //       }
  //   //     });
  //   //   });
  
  //   //   console.log(getValues("sections"));
  //   // } catch (error) {
  //   //   uploadVideoLoading = false;
  //   //   console.error("Video Upload Error:", error);
  //   //   alert("비디오 업로드 중 오류가 발생하였습니다.");
  //   // }

  // };

  return (
    <>
      <div className="service-form-add-section-button-wrap">
        {/* <button className="service-form-upload-button" onClick={handleVideoUpload}>
          {isVideoUploading ? (
            <>
              영상 업로드 중 <div className="loader"></div>
            </>
          ) : (
            <>영상 업로드</>
          )}
        </button> */}
        <button
          onClick={addSection}
          className="service-form-add-section-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14px"
            height="14px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 12H20M12 4V20"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          세션 추가하기
        </button>
      </div>
      {sectionFields.map((section, index) => (
        <CourseSection
          key={section.id}
          section={section}
          sectionIndex={index}
          control={control}
          register={register}
          getValues={getValues}
          setValue={setValue}
          watch={watch}
          removeSection={removeSection}
          setupVideoMetadata={setupVideoMetadata}
          errors={errors}
          setShowModal={setShowModal}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </>
  );
};

const CourseSection = React.memo(
  ({
    section,
    sectionIndex,
    control,
    register,
    getValues,
    setValue,
    removeSection,
    watch,
    setupVideoMetadata,
    errors,
    setShowModal,
    setErrorMessage,
  }) => {
    const {
      fields: lectureFields,
      append: appendLecture,
      remove: removeLecture,
      move,
    } = useFieldArray({
      control,
      name: `sections[${sectionIndex}].lectures`,
    });

    const addLecture = (e) => {
      e.preventDefault();
      const order = lectureFields.length + 1;
      appendLecture({
        title: "",
        videoUrl: null,
        videoDuration: null,
        order,
      }, order);
    };

    useEffect(() => {
      lectureFields.forEach((_, index) => {
        setValue(
          `sections[${sectionIndex}].lectures[${index}].order`,
          index + 1
        );
      });
    }, [lectureFields, setValue]);

    const [draggedLectureId, setDraggedLectureId] = useState(null);
    const handleDragStart = (index) => (event) => {
      event.dataTransfer.setData("text/plain", index);
      event.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    const handleDrop = (targetIndex) => (event) => {
      event.preventDefault();
      const fromIndex = parseInt(event.dataTransfer.getData("text/plain"), 10);
      console.log(
        "Before move:",
        lectureFields.map((l) => l.title)
      );
      if (fromIndex !== targetIndex) {
        move(fromIndex, targetIndex);
        console.log(
          "After move:",
          lectureFields.map((l) => l.title)
        );
      }
    };

    useEffect(() => {
      lectureFields.forEach((_, index) => {
        setValue(`sections[${sectionIndex}].lectures[${index}].order`, index + 1);
      });
    }, [lectureFields, setValue]);

    return (
      <div className="service-form-course-section">
        <div className="service-form-section-input-group">
          <div className="service-form-input-group">
            <label
              htmlFor={`sections[${sectionIndex}].title`}
              className="service-form-label"
            >
              세션 {sectionIndex + 1}
            </label>
            <input
              type="text"
              {...register(`sections[${sectionIndex}].title`)}
              name={`sections[${sectionIndex}].title`}
              id={`sections[${sectionIndex}].title`}
              className="service-form-input"
              placeholder="세션 제목을 입력해주세요."
            />
          </div>
          <button
            type="button"
            onClick={() => removeSection(sectionIndex)}
            className="section-delete-button"
          >
            세션 삭제
          </button>
        </div>
        <div className="service-form-course-section-header">
          <div></div>
          <div>강의명</div>
          <div>강의영상업로드</div>
          <div>삭제</div>
        </div>
        {lectureFields.map((lecture, lectureIndex) => (
          <Lecture
            key={lecture.id}
            lecture={lecture}
            sectionIndex={sectionIndex}
            lectureIndex={lectureIndex}
            watch={watch}
            register={register}
            getValues={getValues}
            setValue={setValue}
            removeLecture={() => removeLecture(lectureIndex)}
            onDragStart={handleDragStart(lectureIndex)}
            onDragOver={handleDragOver}
            onDrop={handleDrop(lectureIndex)}
            isDragging={draggedLectureId === lectureIndex}
            control={control}
            setupVideoMetadata={setupVideoMetadata}
            errors={errors}
            setShowModal={setShowModal}
            setErrorMessage={setErrorMessage}
          />
        ))}
        <button
          onClick={addLecture}
          className="service-form-add-lecture-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14px"
            height="14px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 12H20M12 4V20"
              stroke="#F3C63F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          강의 추가
        </button>
      </div>
    );
  }
);

const Lecture = ({
  lecture,
  sectionIndex,
  lectureIndex,
  register,
  getValues,
  setValue,
  removeLecture,
  onDragStart,
  onDragOver,
  onDrop,
  onDragLeave,
  isDragging,
  watch,
  control,
  setupVideoMetadata,
  errors,
  setShowModal,
  setErrorMessage,
}) => {
  const dragClass = isDragging ? "dragging" : "";

  const handleFileChange = (event, sectionIndex, lectureIndex) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      setupVideoMetadata(sectionIndex, lectureIndex, file);
    }
  };

  return (
    <div
      className={`service-form-course-section-content ${dragClass}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      id={`lecture-${sectionIndex}-${lectureIndex}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20px"
        height="20px"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M4 6H20M4 12H20M4 18H20"
          stroke="#9095A1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        {...register(
          `sections[${sectionIndex}].lectures[${lectureIndex}].title`
        )}
        name={`sections[${sectionIndex}].lectures[${lectureIndex}].title`}
        id={`sections[${sectionIndex}].lectures[${lectureIndex}].title`}
        className="service-form-input"
        placeholder="강의명을 입력해주세요."
      />
      {lecture.video_url ? (
        <span>{lecture.video_url}</span>
      ) : (
        <input
          type="file"
          accept="video/*"
          className="service-form-image-upload-button"
          id={`lecture-${sectionIndex}-${lectureIndex}-file`}
          onChange={(e) => handleFileChange(e, sectionIndex, lectureIndex)}
        />
      )}
      <button
        onClick={removeLecture}
        className="service-form-delete-lecture-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16px"
          height="14px"
          viewBox="0 0 24 22"
          fill="none"
        >
          <path
            d="M10 12V17"
            stroke="#DE3B40"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 12V17"
            stroke="#DE3B40"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 7H20"
            stroke="#DE3B40"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
            stroke="#DE3B40"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
            stroke="#DE3B40"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default ServiceForm;
