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
    return videoUrl.split('/').pop().split('?')[0];
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
        const existingLectureProgress = progressArray?.find(p => Number(p.lecture_id) === Number(lectureId));
        let isCompleted = currentIsCompleted;
  
        if (existingLectureProgress && existingLectureProgress.is_completed) {
          isCompleted = true;
        }
  
        const progressData = {
          enrollment_id: enrollmentData.id,
          lecture_id: lectureId,
          video_progress_time: Math.min(totalWatchedTime, duration),
          is_completed: isCompleted
        };
  
        if (existingLectureProgress) {
          await updateEnrollmentProgress(enrollmentData.id, lectureId, progressData);
        } else {
          await createEnrollmentProgress(enrollmentData.id, progressData);
        }
  
        if (isCompleted) {
          const completedLecturesCount = progressArray.filter(p => p.is_completed).length + (existingLectureProgress ? 0 : 1);
          await updateEnrollmentCompletedCount(enrollmentData.id, completedLecturesCount);
  
          const courseData = await getService(course_id);
          if(courseData){
            const processRate = Math.round((Number(completedLecturesCount) / Number(courseData.total_lecture_count)) * 100);
            await updateEnrollmentTotalProcess(enrollmentData.id, processRate);
          }
  
          if (courseData && Number(courseData.total_lecture_count) === Number(completedLecturesCount)) {
            await updateEnrollmentIsCompleted(enrollmentData.id);
  
            const generateCertificateNumber = () => {
              const today = new Date();
              const yyyy = String(today.getFullYear()).slice(4);
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
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }, 1000),
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

  useEffect(() => {
    if (!videoId || !iframeRef.current || playerRef.current || !enrollmentData?.id) return;
  
    setIsLoading(true);
    const player = new Player(iframeRef.current, {
      id: videoId,
      width: 1150,
      height: 600,
      autopause: false,
      autoplay: false,
      loop: false,
      controls: true,
    });
  
    playerRef.current = player;
  
    const handleTimeUpdate = (data) => {
      setCurrentTime(data.seconds);
      localStorage.setItem(`watchedTime-${lectureId}`, calculateTotalWatchedTime().toString());
      updateWatchedIntervals(data.seconds);
      saveProgress();
    };
  
    const handleEnded = () => {
      console.log("Video ended");
      saveProgress.flush();
    };
  
    const handleLoaded = () => {
      setIsLoading(false);
    };
  
    player.on('timeupdate', handleTimeUpdate, { passive: true });
    player.on('ended', handleEnded);
    player.on('loaded', handleLoaded);
  
    player.ready().then(() => {
      player.getDuration().then((duration) => setDuration(duration));
      const savedTime = localStorage.getItem(`watchedTime-${lectureId}`);
      if (savedTime) {
        const parsedTime = parseFloat(savedTime);
        if (parsedTime < duration) {
          player.setCurrentTime(parsedTime);
        } else {
          localStorage.removeItem(`watchedTime-${lectureId}`);
        }
      }
    }).catch(error => console.error("Error initializing Vimeo player:", error));
  
    return () => {
      player.off('timeupdate', handleTimeUpdate);
      player.off('ended', handleEnded);
      player.off('loaded', handleLoaded);
      player.destroy();
      playerRef.current = null;
    };
  }, [videoId, lectureId, saveProgress, updateWatchedIntervals, enrollmentData?.id, calculateTotalWatchedTime]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress.flush(); // 디바운스된 함수를 즉시 실행
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveProgress.flush(); // 컴포넌트 언마운트 시 디바운스된 함수를 즉시 실행
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

  return (
    <div className="video-player-container">
      {isLoading && (
        <div className="video-player-loading">
          <div className="video-player-loader"></div>
        </div>
      )}
      <div ref={iframeRef} className={isLoading ? 'hidden' : ''}></div>
      {/* <p>Current Time: {formatTime(currentTime)} / {formatTime(duration)}</p>
      <p>Total Watched Time: {formatTime(calculateTotalWatchedTime())}</p> */}
    </div>
  );
};
