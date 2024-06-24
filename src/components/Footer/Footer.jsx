import React from "react";
import "./Footer.css";
import { HashLink as Link } from 'react-router-hash-link';

export const Footer = () => {
  return (
    <footer className="footer">
      <section className="footer-links-section">
        <ul className="footer-link-group">
          <li>
            <h3 className="footer-link-group-title">희망과학심리상담센터 주식회사</h3>
            <ul className="footer-link-group-list">
              <li>대표자: 이현호</li>
              <li>사업자 번호: 770-87-02961</li>
              <li>사업자 주소: 서울특별시 성동구 상원6길 8, 비 1층 이72호&#40;성수동1가&#41;</li>
              <li>이메일 주소: hopescience0110@naver.com</li>
              <li>대표 연락처: 010-2952-1960</li>
            </ul>
          </li>
          <address className="footer-address">
          <Link to="/policy#policy" className="footer-link">이용약관</Link>|<Link to="/policy#privacy" className="footer-link">개인정보 처리방침</Link>|<Link to="/policy#refund" className="footer-link">환불정책</Link>|<Link to="/policy#service_period" className="footer-link">서비스 제공기간 안내</Link>
        </address>
        </ul>
      </section>
    </footer>
  );
};
