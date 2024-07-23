import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Player from "@vimeo/player";
import "./style.css";
import { enrollment, service, certificate } from "../../store";
import { debounce } from 'lodash';

export const VideoPlayer = ({ videoUrl, enrollmentData, lectureId, course_id }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const watchedIntervalsRef = useRef([]);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const { createEnrollmentProgress, updateEnrollmentProgress, getEnrollmentProgress, updateEnrollmentCompletedCount, updateEnrollmentIsCompleted, updateEnrollmentTotalProcess } = enrollment((state) => ({
    createEnrollmentProgress: state.createEnrollmentProgress,
    updateEnrollmentProgress: state.updateEnrollmentProgress,
    getEnrollmentProgress: state.getEnrollmentProgress,
    updateEnrollmentCompletedCount: state.updateEnrollmentCompletedCount,
    updateEnrollmentIsCompleted: state.updateEnrollmentIsCompleted,
    updateEnrollmentTotalProcess: state.updateEnrollmentTotalProcess
  }));
  const { getService } = service((state) => ({getService: state.getService}))
  const { createCertificate } =  certificate((state)=> ({createCertificate: state.createCertificate}))

  const videoId = useMemo(() => {
    if (!videoUrl) return null;
    const id = videoUrl.split('/').pop().split('?')[0];
    return id && id.length > 0 ? id : null;
  }, [videoUrl]);

  const calculateTotalWatchedTime = useCallback(() => {
    return watchedIntervalsRef.current.reduce((total, interval) => {
      return total + (interval.end - interval.start);
    }, 0);
  }, []);

  const saveProgress = useCallback(
    debounce(async () => {
      const totalWatchedTime = calculateTotalWatchedTime();
      const currentIsCompleted = (totalWatchedTime / duration) >= 0.9;
  
      if (!enrollmentData?.id) {
        console.error("Enrollment ID is undefined");
        return;
      }
  
      try {
        const existingProgress = await getEnrollmentProgress(Number(enrollmentData.id));
        const progressArray = Array.isArray(existingProgress) ? existingProgress : [];
        const existingLectureProgress = progressArray.find(p => Number(p.lecture_id) === Number(lectureId));
        
        const isNewlyCompleted = currentIsCompleted && (!existingLectureProgress || !existingLectureProgress.is_completed);
  
        const progressData = {
          enrollment_id: enrollmentData.id,
          lecture_id: lectureId,
          video_progress_time: Math.min(totalWatchedTime, duration),
          is_completed: currentIsCompleted
        };
  
        if (existingLectureProgress) {
          await updateEnrollmentProgress(enrollmentData.id, lectureId, progressData);
        } else {
          await createEnrollmentProgress(enrollmentData.id, progressData);
        }
  
        // 새로 완료되었거나 기존에 실패했던 강의가 완료된 경우에만 전체 진도 업데이트
        if (isNewlyCompleted) {
          const updatedProgressArray = existingLectureProgress 
            ? progressArray.map(p => p.lecture_id === lectureId ? progressData : p)
            : [...progressArray, progressData];
  
          const completedLecturesCount = updatedProgressArray.filter(p => p.is_completed).length;
          await updateEnrollmentCompletedCount(enrollmentData.id, completedLecturesCount);
  
          const courseData = await getService(course_id);
          if (courseData) {
            const processRate = Math.round((completedLecturesCount / Number(courseData.total_lecture_count)) * 100);
            await updateEnrollmentTotalProcess(enrollmentData.id, processRate);
  
            if (Number(courseData.total_lecture_count) === completedLecturesCount) {
              await updateEnrollmentIsCompleted(enrollmentData.id);
  
              const generateCertificateNumber = () => {
                const today = new Date();
                const yyyy = String(today.getFullYear());
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}${mm}${dd}`;
                const randomNum = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
                
                return `${dateStr}${randomNum}`;
              };
  
              const certificateId = generateCertificateNumber();
              const userName = enrollmentData.user_name;
              const completionDate = new Date().toISOString();
              const certificateData = { certificate_id: certificateId, user_name: userName, completion_date: completionDate, is_issued: false };
  
              await createCertificate(enrollmentData.user_id, course_id, certificateData);
            }
          }
        }
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }, 2000),
    [enrollmentData?.id, lectureId, duration, calculateTotalWatchedTime, getEnrollmentProgress, updateEnrollmentProgress, createEnrollmentProgress, updateEnrollmentCompletedCount, getService, course_id, updateEnrollmentIsCompleted, createCertificate]
  );

  const updateWatchedIntervals = useCallback((newTime) => {
    const intervals = watchedIntervalsRef.current;
    const lastInterval = intervals[intervals.length - 1];

    if (intervals.length === 0 || newTime > lastInterval.end + 1) {
      intervals.push({ start: newTime, end: newTime });
    } else if (newTime >= lastInterval.start && newTime <= lastInterval.end + 1) {
      lastInterval.end = Math.max(lastInterval.end, newTime);
    } else {
      let inserted = false;
      for (let i = 0; i < intervals.length; i++) {
        if (newTime < intervals[i].start - 1) {
          intervals.splice(i, 0, { start: newTime, end: newTime });
          inserted = true;
          break;
        } else if (newTime >= intervals[i].start - 1 && newTime <= intervals[i].end + 1) {
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
        merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, current.end);
      }
      return merged;
    }, []);
  }, []);

  const initializePlayer = useCallback(async () => {
    if (!videoId || !iframeRef.current || playerRef.current || !enrollmentData?.id) return;

    try {
      const player = new Player(iframeRef.current, {
        id: videoId,
        width: '100%',
        height: '100%',
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
        saveProgress();
      };

      const handleEnded = () => {
        console.log("Video ended");
        saveProgress.flush();
      };

      player.on('timeupdate', handleTimeUpdate);
      player.on('ended', handleEnded);
      player.on('loaded', () => setIsLoading(false));

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
  }, [videoId, lectureId, enrollmentData?.id, saveProgress, updateWatchedIntervals]);

  useEffect(() => {
    initializePlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.off('timeupdate');
        playerRef.current.off('ended');
        playerRef.current.off('loaded');
        playerRef.current.destroy();
      }
      playerRef.current = null;
    };
  }, [initializePlayer]);


  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress.flush();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveProgress.flush();
    };
  }, [saveProgress]);

  // const formatTime = (time) => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = Math.floor(time % 60);
  //   return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  // };

  if (!videoUrl) {
    return <div>영상이 정상적으로 처리되지 않았습니다. 관리자에게 문의해주세요.</div>;
  }

  if (!videoUrl) {
    return <div>영상이 정상적으로 처리되지 않았습니다. 관리자에게 문의해주세요.</div>;
  }

  return (
    <div className="video-player-container" style={{ width: '100%', maxWidth: '1150px', margin: '0 auto' }}>
      {isLoading && (
        <div className="video-player-loading">
          <div className="video-player-loader"></div>
        </div>
      )}
      <div ref={iframeRef} style={{ aspectRatio: '16 / 9' }}></div>
      {/* <p>Current Time: {formatTime(currentTime)} / {formatTime(duration)}</p>
      <p>Total Watched Time: {formatTime(calculateTotalWatchedTime())}</p> */}
    </div>
  );
};