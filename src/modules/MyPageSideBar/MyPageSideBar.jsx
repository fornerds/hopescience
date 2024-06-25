import "./MyPageSideBar.css";
import { NavLink } from "react-router-dom";

export const MyPageSideBar = () => {
  return (
    <section className="sidebar-section">
      <ul className="sidebar-link-list">
        <li className="sidebar-link-item">
          <NavLink
            to="/mypage/courses"
            className="sidebar-link"
            activeclassname="active"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.7137 2.57129L4.28516 2.57129L4.28516 21.4284L19.7137 21.4284L19.7137 2.57129Z"
                stroke="#DEE1E6"
                strokeWidth="2.05714"
                strokeMiterlimit="10"
                strokeLinecap="square"
              />
              <path
                d="M14.5723 6.85693H16.2866"
                stroke="#DEE1E6"
                strokeWidth="2.05714"
                strokeMiterlimit="10"
                strokeLinecap="square"
              />
              <path
                d="M14.5723 10.2856H16.2866"
                stroke="#DEE1E6"
                strokeWidth="2.05714"
                strokeMiterlimit="10"
                strokeLinecap="square"
              />
              <path
                d="M7.71484 13.7144L16.2863 13.7144"
                stroke="#DEE1E6"
                strokeWidth="2.05714"
                strokeMiterlimit="10"
                strokeLinecap="square"
              />
              <path
                d="M7.71484 17.1431L16.2863 17.1431"
                stroke="#DEE1E6"
                strokeWidth="2.05714"
                strokeMiterlimit="10"
                strokeLinecap="square"
              />
              <path
                d="M11.1434 6.85693L7.71484 6.85693L7.71484 10.2855H11.1434V6.85693Z"
                stroke="#DEE1E6"
                strokeWidth="2.05714"
                strokeMiterlimit="10"
                strokeLinecap="square"
              />
            </svg>

            <div className="sidebar-link-title">수강목록</div>
          </NavLink>
        </li>
        <li className="sidebar-link-item">
          <NavLink
            to="/mypage/certificates"
            className="sidebar-link"
            activeclassname="active"
          >
            <svg
              className="certificate-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              viewBox="0 0 48 48"
            >
              <path
                d="M40,18A16,16,0,1,0,15,31.2V43.9A2.1,2.1,0,0,0,17,46a1.5,1.5,0,0,0,1.1-.4L24,41l5.9,4.6A1.5,1.5,0,0,0,31,46a2.1,2.1,0,0,0,2-2.1V31.2A16,16,0,0,0,40,18ZM12,18A12,12,0,1,1,24,30,12,12,0,0,1,12,18ZM29,39.8l-4.4-3.4a.9.9,0,0,0-1.2,0L19,39.8V33.2a16.9,16.9,0,0,0,5,.8,16.9,16.9,0,0,0,5-.8Z"
                fill="#dee1e6"
                strokeWidth="1.05714"
                strokeMiterlimit="10"
              />
              <path
                d="M20.4,19.7l-.5,3.1a1.1,1.1,0,0,0,1.5,1.1L24,22l2.6,1.9a1.1,1.1,0,0,0,1.5-1.1l-.5-3.1,2.1-2a1.1,1.1,0,0,0-.6-1.8l-2.9-.4-1.3-2.9a1,1,0,0,0-1.8,0l-1.3,2.9-2.9.4a1.1,1.1,0,0,0-.6,1.8Z"
                fill="#dee1e6"
              />
            </svg>
            <div className="sidebar-link-title">이수증서</div>
          </NavLink>
        </li>
        <li className="sidebar-link-item">
          <NavLink
            to="/mypage/orders"
            className="sidebar-link"
            activeclassname="active"
          >
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.7151 12.7999C17.8986 12.7999 18.858 11.8405 18.858 10.657C18.858 9.47355 17.8986 8.51416 16.7151 8.51416C15.5317 8.51416 14.5723 9.47355 14.5723 10.657C14.5723 11.8405 15.5317 12.7999 16.7151 12.7999Z"
                stroke="#dee1e6"
                strokeWidth="2.05714"
                strokeMiterlimit="10"
                strokeLinecap="square"
              />
              <path
                d="M9.8577 7.65681C11.0412 7.65681 12.0006 6.69742 12.0006 5.51395C12.0006 4.33048 11.0412 3.37109 9.8577 3.37109C8.67423 3.37109 7.71484 4.33048 7.71484 5.51395C7.71484 6.69742 8.67423 7.65681 9.8577 7.65681Z"
                stroke="#dee1e6"
                strokeWidth="2.05714"
                strokeMiterlimit="10"
                strokeLinecap="square"
              />
              <path
                d="M13.266 16.2284H18.0008C20.4154 16.2284 20.5723 17.9427 20.5723 17.9427L10.488 21.8212C9.81341 22.0809 9.06084 22.0441 8.41455 21.7209L2.57227 18.7998L2.57227 12.7998H3.42941C4.37655 12.7998 6.77741 13.1752 7.71512 14.5141H10.2866C12.18 14.5141 13.7151 16.0492 13.7151 17.9427L7.71512 17.9427"
                stroke="#dee1e6"
                strokeWidth="2.05714"
                strokeMiterlimit="10"
              />
            </svg>
            <div className="sidebar-link-title">결제내역</div>
          </NavLink>
        </li>
        <li className="sidebar-link-item">
          <NavLink
            to="/mypage/setting"
            className="sidebar-link"
            activeclassname="active"
          >
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.9992 15.1717C13.4193 15.1717 14.5706 14.0204 14.5706 12.6002C14.5706 11.1801 13.4193 10.0288 11.9992 10.0288C10.579 10.0288 9.42773 11.1801 9.42773 12.6002C9.42773 14.0204 10.579 15.1717 11.9992 15.1717Z"
                stroke="#DEE1E6"
                strokeWidth="2.05714"
                strokeMiterlimit="10"
                strokeLinecap="square"
              />
              <path
                d="M18.8579 12.6C18.8569 12.1062 18.8029 11.6139 18.6968 11.1317L21.0231 9.37024L19.3088 6.4011L16.6148 7.53767C15.8853 6.86884 15.0194 6.36615 14.0768 6.06424L13.7151 3.17139L10.2865 3.17139L9.9248 6.06424C8.98224 6.36615 8.11635 6.86884 7.3868 7.53767L4.6928 6.4011L2.97852 9.37024L5.3048 11.1317C5.09 12.0987 5.09 13.1012 5.3048 14.0682L2.97852 15.8297L4.6928 18.7988L7.3868 17.6622C8.11635 18.3311 8.98224 18.8338 9.9248 19.1357L10.2865 22.0285H13.7151L14.0768 19.1357C15.0194 18.8338 15.8853 18.3311 16.6148 17.6622L19.3088 18.7988L21.0231 15.8297L18.6968 14.0682C18.8029 13.586 18.8569 13.0937 18.8579 12.6Z"
                stroke="#DEE1E6"
                strokeWidth="2.05714"
                strokeMiterlimit="10"
                strokeLinecap="square"
              />
            </svg>

            <div className="sidebar-link-title">환경설정</div>
          </NavLink>
        </li>
      </ul>
    </section>
  );
};
