import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { auth } from "../../store";

export const NaverSignIn = () => {
  const navigate = useNavigate();
  const naverLogin = auth((state) => state.naverLogin);

  const handleNaverLogin = useCallback(async () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const tokenType = params.get("token_type");
    const expiresIn = params.get("expires_in");
    const state = params.get("state");

    if (accessToken) {
      try {
        const data = await naverLogin(accessToken, tokenType, expiresIn, state);
        if (data) {
          navigate("/"); // 홈페이지로 이동
        }
      } catch (error) {
        console.error("로그인 실패:", error);
        alert(`네이버 로그인 실패: ${error.message || "Network Error"}`);
        navigate("/signin"); // 로그인 페이지로 리디렉션
      }
    } else {
      alert("로그인 실패: 네이버 계정으로 로그인하기 위해 필수정보가 필요합니다.");
      navigate("/signin");
    }
  }, [navigate, naverLogin]);

  useEffect(() => {
    handleNaverLogin();
  }, [handleNaverLogin]);

  return (
    <>
      <Header />
      <main className="signin-background color-white">
        <div className="naver-signin-wrap">
          <div className="naver-loader"/>
          <p>네이버 로그인 처리 중입니다...</p>
        </div>
      </main>
      <Footer />
    </>
  );
};
