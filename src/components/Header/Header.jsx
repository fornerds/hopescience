import React, { useState } from "react";
import "./Header.css";
import { Link } from "../Link";
import { auth } from "../../store";
import { useNavigate } from "react-router-dom";
import MainLogo from "../../images/main-logo.png";
import Avatar from "../../icons/avatar.svg";

export const Header = () => {
  const { user, logout } = auth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <Link
        to="/"
        label="희망과학심리상담센터"
        buttonStyle="transparent"
        color="white"
        fontSize="24px"
        className="main-logo-link"
        style={{
          width: "fit-content",
          display: "flex",
          alignItems: "center",
          height: "50px",
        }}
      >
        <img
          className="img"
          alt="희망과학심리상담센터 메인로고"
          src={MainLogo}
          width="60px"
          height="60px"
        />
      </Link>
      <div className={`header-signin ${menuOpen ? "open" : ""}`}>
        <div className={`header-menu ${menuOpen ? "open" : ""}`}>
          <Link
            className="header-link"
            to="/"
            label="센터소개"
            color="white"
          />
          <Link
            className="header-link"
            to="/courses"
            label="서비스 목록"
            color="white"
          />
          <Link
            className="header-link"
            to="/QnA"
            label="문의게시판"
            color="white"
          />
          <Link
            className="header-link"
            to="/mypage/courses"
            label="내 강의목록"
            color="white"
          />
          {user && (
                <div className="header-dropdown-menu-mobile">
                  <Link
                    className="header-mypage-link"
                    to="/mypage/courses"
                    label="마이페이지"
                    buttonStyle="transparent"
                    color="white"
                    fontSize="14px"
                  />
                  <button onClick={handleLogout} className="header-mypage-link">
                    로그아웃
                  </button>
                </div>
              )}
        </div>
        {user ? (
          <div className="header-user-section">
            <img
              className="user-profile-image"
              src={Avatar}
              alt="사용자 프로필 이미지"
            />
            <span className="header-user-name" onClick={toggleDropdown}>
              {user.name} 님
            </span>
            {dropdownOpen && (
              <div className="header-dropdown-menu">
                <Link
                  className="header-mypage-link"
                  to="/mypage/courses"
                  label="마이페이지"
                  buttonStyle="transparent"
                  color="black"
                  fontSize="16px"
                />
                <button onClick={handleLogout} className="header-logout-button">
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="header-buttons">
            <Link
              to="/signin"
              label="로그인"
              buttonStyle="transparent"
              color="#BD9A31"
              fontSize="16px"
            />
            <Link to="/signup" label="회원가입" buttonStyle="default" color="white" fontSize="16px" />
          </div>
        )}
      </div>
      <button className="menu-toggle-button" onClick={toggleMenu}>
        ☰
      </button>
      {menuOpen && <div className="menu-overlay" onClick={toggleMenu} />}
    </header>
  );
};
