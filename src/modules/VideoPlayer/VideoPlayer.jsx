import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Player from "@vimeo/player";
import "./style.css";
import { enrollment, service, certificate } from "../../store";
// import { debounce } from 'lodash';

export const VideoPlayer = ({
  videoUrl,
  enrollmentData,
  lectureId,
  course_id,
  onVideoComplete,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const watchedIntervalsRef = useRef([]);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);

  const {
    createEnrollmentProgress,
    updateEnrollmentProgress,
    getEnrollmentProgress,
    updateEnrollmentCompletedCount,
    updateEnrollmentIsCompleted,
    updateEnrollmentTotalProcess,
    getEnrollment,
  } = enrollment((state) => ({
    createEnrollmentProgress: state.createEnrollmentProgress,
    updateEnrollmentProgress: state.updateEnrollmentProgress,
    getEnrollmentProgress: state.getEnrollmentProgress,
    updateEnrollmentCompletedCount: state.updateEnrollmentCompletedCount,
    updateEnrollmentIsCompleted: state.updateEnrollmentIsCompleted,
    updateEnrollmentTotalProcess: state.updateEnrollmentTotalProcess,
    getEnrollment: state.getEnrollment,
  }));
  const { getService } = service((state) => ({ getService: state.getService }));
  const { createCertificate, checkCertificate } = certificate((state) => ({
    createCertificate: state.createCertificate,
    checkCertificate: state.checkCertificate,
  }));

  const videoId = useMemo(() => {
    if (!videoUrl) return null;
    const id = videoUrl.split("/").pop().split("?")[0];
    return id && id.length > 0 ? id : null;
  }, [videoUrl]);

  const calculateTotalWatchedTime = useCallback(() => {
    return watchedIntervalsRef.current.reduce((total, interval) => {
      return total + (interval.end - interval.start);
    }, 0);
  }, []);

  // VideoPlayer.jsx에서 saveProgress 함수의 수정 부분
  const saveProgress = useCallback(async () => {
    console.log("saveProgress 함수 시작");
    const totalWatchedTime = calculateTotalWatchedTime();
    const currentIsCompleted = totalWatchedTime / duration >= 0.9;

    if (!enrollmentData?.id) {
      console.error("Enrollment ID is undefined");
      return;
    }

    try {
      console.log("기존 진도 조회 중...");
      const existingProgress = await getEnrollmentProgress(
        Number(enrollmentData.id)
      );
      console.log("기존 진도:", existingProgress);

      const progressArray = Array.isArray(existingProgress)
        ? existingProgress
        : [];
      const existingLectureProgress = progressArray.find(
        (p) => Number(p.lecture_id) === Number(lectureId)
      );

      const progressData = {
        enrollment_id: enrollmentData.id,
        lecture_id: lectureId,
        video_progress_time: Math.min(totalWatchedTime, duration),
        is_completed: currentIsCompleted,
      };

      let isNewlyCompleted = false;

      if (!existingLectureProgress || !existingLectureProgress.is_completed) {
        if (currentIsCompleted) {
          console.log("새로운 진도 생성 중...");
          const result = await createEnrollmentProgress(
            enrollmentData.id,
            progressData
          );
          console.log("새로운 진도 생성 결과:", result);
          isNewlyCompleted = true;
        }
      } else {
        console.log("이미 완료된 강의입니다. 업데이트 생략.");
      }

      if (isNewlyCompleted) {
        console.log("수강 완료 수 및 전체 진도 업데이트 중...");
        const courseData = await getService(course_id);
        console.log("강좌 데이터:", courseData);

        if (courseData) {
          try {
            console.log("getEnrollment 호출, enrollmentId:", enrollmentData.id);
            const currentEnrollment = await getEnrollment(enrollmentData.id);
            console.log("현재 enrollment 정보:", currentEnrollment);

            if (currentEnrollment) {
              const currentCompletedCount =
                currentEnrollment.completed_lecture_count || 0;
              const newCompletedCount = currentCompletedCount + 1;

              console.log("updateEnrollmentCompletedCount 호출 전");
              const updatedCompletedCount =
                await updateEnrollmentCompletedCount(
                  enrollmentData.id,
                  newCompletedCount
                );
              console.log(
                "updateEnrollmentCompletedCount 호출 후, 결과:",
                updatedCompletedCount
              );

              const completedCount =
                updatedCompletedCount.completed_lecture_count ||
                newCompletedCount;
              console.log("업데이트된 수강 완료 수:", completedCount);

              const totalLectureCount =
                Number(courseData.total_lecture_count) || 1;
              let processRate = Math.round(
                (completedCount / totalLectureCount) * 100
              );
              console.log("계산된 진행률:", processRate);

              // 모든 강의를 완료했는지 확인
              if (completedCount >= totalLectureCount) {
                // 강의를 모두 완료했다면 진도율을 100%로 강제 설정
                processRate = 100;
                console.log("모든 강의 완료. 진도율을 100%로 설정");
              }

              console.log(
                "updateEnrollmentTotalProcess 호출 전, processRate:",
                processRate
              );
              const updateResult = await updateEnrollmentTotalProcess(
                enrollmentData.id,
                processRate
              );
              console.log(
                "updateEnrollmentTotalProcess 호출 후, 결과:",
                updateResult
              );

              if (completedCount >= totalLectureCount) {
                console.log(
                  "모든 강의 완료. updateEnrollmentIsCompleted 호출 전"
                );
                const completionResult = await updateEnrollmentIsCompleted(
                  enrollmentData.id
                );
                console.log(
                  "updateEnrollmentIsCompleted 호출 후, 결과:",
                  completionResult
                );

                const userId = enrollmentData.user_id;
                const courseId = enrollmentData.course_id;

                try {
                  let certificateExists = false;
                  let certificateInfo = null;

                  try {
                    const checkResult = await checkCertificate(
                      userId,
                      courseId
                    );
                    certificateExists = checkResult.exists;
                    certificateInfo = checkResult.certificateInfo;
                  } catch (checkError) {
                    if (
                      checkError.response &&
                      checkError.response.status === 404
                    ) {
                      console.log(
                        "Certificate not found, proceeding to create one."
                      );
                    } else {
                      throw checkError;
                    }
                  }

                  if (!certificateExists && !certificateInfo) {
                    const generateCertificateNumber = () => {
                      const today = new Date();
                      const yyyy = String(today.getFullYear());
                      const mm = String(today.getMonth() + 1).padStart(2, "0");
                      const dd = String(today.getDate()).padStart(2, "0");
                      const dateStr = `${yyyy}${mm}${dd}`;
                      const randomNum = String(
                        Math.floor(Math.random() * 10000)
                      ).padStart(4, "0");

                      return `${dateStr}${randomNum}`;
                    };

                    const certificateId = generateCertificateNumber();
                    const userName = enrollmentData.user_name;
                    const completionDate = new Date().toISOString();
                    const certificateData = {
                      certificate_id: certificateId,
                      user_name: userName,
                      completion_date: completionDate,
                      is_issued: false,
                    };

                    await createCertificate(userId, courseId, certificateData);
                    console.log("새로운 이수증서가 발급되었습니다.");
                  } else {
                    console.log(
                      "회원의 해당 강의 이수증서가 이미 발급된 상태입니다."
                    );
                  }
                } catch (error) {
                  console.error("이수증서 처리 중 오류 발생:", error);
                }
              }
            } else {
              console.error("현재 enrollment 정보를 가져오는데 실패했습니다.");
            }
          } catch (error) {
            console.error("getEnrollment 호출 중 오류 발생:", error);
          }
        }
      }
      console.log("진도 저장 완료");
    } catch (error) {
      console.error("진도 저장 중 오류 발생:", error);
    }
  }, [
    enrollmentData?.id,
    lectureId,
    duration,
    calculateTotalWatchedTime,
    getEnrollmentProgress,
    createEnrollmentProgress,
    updateEnrollmentCompletedCount,
    getService,
    course_id,
    updateEnrollmentIsCompleted,
    createCertificate,
    checkCertificate,
    updateEnrollmentTotalProcess,
    getEnrollment,
  ]);

  const updateWatchedIntervals = useCallback((newTime) => {
    const intervals = watchedIntervalsRef.current;
    const lastInterval = intervals[intervals.length - 1];

    if (intervals.length === 0 || newTime > lastInterval.end + 1) {
      intervals.push({ start: newTime, end: newTime });
    } else if (
      newTime >= lastInterval.start &&
      newTime <= lastInterval.end + 1
    ) {
      lastInterval.end = Math.max(lastInterval.end, newTime);
    } else {
      let inserted = false;
      for (let i = 0; i < intervals.length; i++) {
        if (newTime < intervals[i].start - 1) {
          intervals.splice(i, 0, { start: newTime, end: newTime });
          inserted = true;
          break;
        } else if (
          newTime >= intervals[i].start - 1 &&
          newTime <= intervals[i].end + 1
        ) {
          intervals[i].start = Math.min(intervals[i].start, newTime);
          intervals[i].end = Math.max(intervals[i].end, newTime);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        intervals.push({ start: newTime, end: newTime });
      }
    }

    watchedIntervalsRef.current = intervals.reduce((merged, current) => {
      if (!merged.length || current.start > merged[merged.length - 1].end + 1) {
        merged.push(current);
      } else {
        merged[merged.length - 1].end = Math.max(
          merged[merged.length - 1].end,
          current.end
        );
      }
      return merged;
    }, []);
  }, []);

  const handleVideoEnded = useCallback(async () => {
    console.log("비디오 종료. 진도 저장 및 완료 모달 표시");
    setIsSaving(true);
    await saveProgress();
    setIsSaving(false);
    console.log("모달 표시 직전");
    onVideoComplete(); // 부모 컴포넌트에 비디오 완료 알림
    console.log("모달 표시 직후");
  }, [saveProgress, onVideoComplete]);

  useEffect(() => {
    console.log("showCompletionModal 상태 변경:", showCompletionModal);
  }, [showCompletionModal]);

  const handleConfirmCompletion = useCallback(async () => {
    if (isSaving) return;
    console.log("완료 확인 및 진도 저장");
    setIsSaving(true);
    await saveProgress();
    setIsSaving(false);
    console.log("진도 저장 완료, 모달 닫기");
    setShowCompletionModal(false);
  }, [isSaving, saveProgress]);

  useEffect(() => {
    const initializePlayer = async () => {
      if (
        !videoId ||
        !iframeRef.current ||
        playerRef.current ||
        !enrollmentData?.id
      )
        return;

      try {
        const player = new Player(iframeRef.current, {
          id: videoId,
          width: "100%",
          height: "100%",
          autopause: false,
          autoplay: false,
          loop: false,
          controls: true,
          responsive: true,
        });

        playerRef.current = player;

        const handleTimeUpdate = (data) => {
          setCurrentTime(data.seconds);
          updateWatchedIntervals(data.seconds);
        };

        player.on("timeupdate", handleTimeUpdate);
        player.on("ended", () => {
          console.log("Vimeo 'ended' event triggered");
          handleVideoEnded();
        });
        player.on("loaded", () => setIsLoading(false));

        await player.ready();
        const videoDuration = await player.getDuration();
        setDuration(videoDuration);

        const savedTime = localStorage.getItem(`watchedTime-${lectureId}`);
        if (savedTime) {
          const parsedTime = parseFloat(savedTime);
          if (parsedTime < videoDuration) {
            await player.setCurrentTime(parsedTime);
          } else {
            localStorage.removeItem(`watchedTime-${lectureId}`);
          }
        }
      } catch (error) {
        console.error("Error initializing Vimeo player:", error);
        setIsLoading(false);
      }
    };

    initializePlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.off("timeupdate");
        playerRef.current.off("ended");
        playerRef.current.off("loaded");
        playerRef.current
          .destroy()
          .catch((error) =>
            console.error("Error destroying Vimeo player:", error)
          );
      }
      playerRef.current = null;
    };
  }, [videoId, lectureId, enrollmentData?.id, handleVideoEnded]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveProgress]);

  if (!videoUrl) {
    return (
      <div>영상이 정상적으로 처리되지 않았습니다. 관리자에게 문의해주세요.</div>
    );
  }

  return (
    <div
      className="video-player-container"
      style={{ width: "100%", maxWidth: "1150px", margin: "0 auto" }}
    >
      {isLoading && (
        <div className="video-player-loading">
          <div className="video-player-loader"></div>
        </div>
      )}
      <div ref={iframeRef} style={{ aspectRatio: "16 / 9" }}></div>
    </div>
  );
};
