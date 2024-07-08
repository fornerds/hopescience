import React from "react";
import "./Home.css";
import { Header, Footer, Link, Input, Button } from "../../components";
import { Carousel, FaqAccordion } from "../../modules";
import mainImage from "../../images/main.png";
import coursesImage from "../../images/courses.png";
import certificationImage from "../../images/certification.jpg";
import certificationImage02 from "../../images/certification02.png";
import certificationImage03 from "../../images/certification03.png";
import articleImage01 from "../../images/article01.png";
import articleImage02 from "../../images/article02.png";
import locationPinIcon from "../../icons/location-pin.svg";
import phoneIcon from "../../icons/phone.svg";
import mailIcon from "../../icons/mail.svg";
import contactImage from "../../images/contact.png";
import { useCounselingStore } from '../../store';
import { useState } from 'react';


const reviews = [
  {
    name: "김○수",
    rating: 4.5,
    date: "2024-04-20",
    review: 
`  이 교육 프로그램은 빠르게 이수증을 받을 수 있어 너무 좋았습니다.

  바쁜 일정 속에서도 단기간에 수료할 수 있어서 큰 도움이 되었어요.`,
  },
  {
    name: "박○연",
    rating: 4.5,
    date: "2024-04-17",
    review: 
`  단기간에 이수증을 받을 수 있다는 점이 정말 만족스러웠습니다. 교육 과정 중 상담도 매우 친절하게 이루어져서 편안한 마음으로 수강할 수 있었습니다.`,
  },
  {
    name: "이○훈",
    rating: 4.5,
    date: "2024-04-16",
    review: 
` 빠른 이수증 발급이 가능한 프로그램이라 시간 효율적으로 학습할 수 있었습니다. 
    
  상담 과정도 세심하게 배려해 주셔서 문제 없이 수료할 수 있었고, 실제 업무에서도 많은 도움이 되었습니다.`,
  },
  {
    name: "윤○희",
    rating: 4.5,
    date: "2024-04-13",
    review: 
` 짧은 시간 안에 이수증을 받을 수 있어서 바쁜 일정을 소화하기에 딱 좋았습니다. 

  상담이 친절하고 상세해서 교육 과정 내내 만족스러웠습니다. 교육 덕분에 양형에 도움이 되어 큰 걱정을 덜 수 있었습니다.`,
  },
  {
    name: "최○호",
    rating: 4.5,
    date: "2024-04-12",
    review: `  단기간에 이수증을 취득할 수 있어 매우 효율적이었습니다. 상담 또한 매우 친절하고 정확하게 해주셔서 수강 중에도 불편함이 없었습니다. 이 교육 덕분에 양형 문제도 해결할 수 있었어요.`,
  },
  {
    name: "박○준",
    rating: 4.5,
    date: "2024-04-10",
    review: `  상담을 친절하게 해주셔서 궁금한 점을 바로 해결할 수 있었습니다. 
    
  희망과학심리상담센터의 상담이 많은 사람에게 도움이 되었으면 좋겠습니다.`,
  },
  {
    name: "이○은",
    rating: 4.5,
    date: "2024-04-06",
    review: `  강의가 매우 체계적이고 이해하기 쉽게 구성되어 있어 많은 도움이 되었습니다.`,
  },
  {
    name: "오○현",
    rating: 4.5,
    date: "2024-04-04",
    review: `  직접 대면해야 하는 불편함없이 간단하게 영상으로 교육을 받고 이수할 수 있어서 좋았습니다.`,
  },
  {
    name: "서○빈",
    rating: 4.5,
    date: "2024-04-01",
    review: `  희망과학심리상담센터의 재범 방지 교육이 정말 유익했습니다. 
    
  단기간에 이수증을 받을 수 있어 좋았고, 많은 것을 배울 수 있었습니다.`,
  },
];

const faqData = [
  {
    question: "수강 시간: 한 과목을 듣는 데 필요한 시간은 얼마인가요?",
    answer:
      "한 과목을 완료하는 데는 대략 1시간이 소요됩니다. 결제를 완료하면 바로 강의를 들을 수 있습니다. 주말이나 공휴일에도 1년 365일, 하루 24시간 언제든지 강의를 듣고, 결제를 하며, 수료증을 발급받을 수 있습니다.",
  },
  {
    question: "수료증 발급: 수료증은 언제 받을 수 있나요?",
    answer:
      "교육을 모두 듣고 시험에 합격하면 바로 교육 수료증을 받을 수 있습니다. 결제를 하자마자 1시간 안에 수료증을 인쇄할 수 있습니다.",
  },
  {
    question: "변호사 연결: 변호사를 소개받을 수 있나요?",
    answer:
      "희망과학심리상담센터는 변호사법 및 관련 법률이 금지하는 모든 변호사 소개나 중개를 진행하지 않습니다. 변호사 소개나 중개를 통해 어떠한 이익이나 금전적 보상을 받지 않으며, 변호사의 전문적 업무와 관련하여 변호사로부터 보수를 받거나 이익을 나눠 가지지 않습니다.",
  },
  {
    question: "법률 상담: 사건에 대해 법률적 조언을 받을 수 있나요?",
    answer:
      "희망과학심리상담센터는 돈을 받고 법률 업무 서비스나, 일반 사람들에게 특정한 문제에 대한 법률 조언이나 도움을 주지 않습니다.",
  },
  {
    question: "감경 효과: 감경을 받을 수 있는 실질적인 가능성이 있나요?",
    answer:
      "법관은 이유 없이 처벌의 기준을 넘어설 수 없고, '진심으로 반성하는 것’은 처벌의 기준 중 하나로 양형위원회에서 정해져 있습니다. 그래서 교육을 끝내고 그 과정에서 보낸 시간과 노력, 그리고 배운 것들을 적어서 피의자나 피고인이 진심으로 반성하고 있다는 것을 보여주면, 그것은 처벌의 기준으로 인정됩니다.",
  },
  {
    question: "강의 시청 방법: 강의를 어떻게 시청하면 되나요?",
    answer:
      "희망과학심리상담센터의 강의는 강의 상세 페이지 아래에서 볼 수 있습니다. ‘강의 내용 보기’ 부분에서 강의 제목을 클릭하면 동영상 강의 창이 열리고, 그 창에서 강의를 듣고 시험을 볼 수 있습니다.",
  },
  {
    question:
      "강의 번들 수강: 강의 번들을 구입했을 때, 수강 방법은 무엇인가요?",
    answer:
      "번들 상품을 사면 결제한 후에 '내 강의실’에서 강의를 들을 수 있고, 산 강의 페이지에서도 바로 강의를 들을 수 있습니다.",
  },
  {
    question: "수료증명서 발급 절차: 수료증명서는 어떻게 발급받나요?",
    answer:
      "강의를 다 듣고, 시험에 합격하면 (60점 이상) 수료증을 받을 수 있습니다. 수료증은 마이페이지 -> 이수증서 페이지에서 볼 수 있습니다.",
  },
  {
    question:
      "수료증명서 제출처: 희망과학심리상담센터의 수료증명서를 어디에 제출해야 하나요?",
    answer:
      "희망과학심리상담센터에서 준 수료증은 처벌의 기준을 정할 때 쓸 수 있는 자료로, 법원이나 검찰청 같은 공공기관에 내주실 수 있습니다.",
  },
  {
    question: "추가 의견서 발급: 교육 수료 후 추가로 의견서를 어떻게 받나요?",
    answer:
      "의견서를 받으려면 ‘결제’ 메뉴에서 의견서 발급 상품을 결제하고, ‘교육과정’ 메뉴에서 의견서 발급을 체크한 후 신청 버튼을 누르면 자동으로 접수가 됩니다.",
  },
  {
    question:
      "수료증/의견서 수령처: 수료증이나 의견서는 어디에서 받을 수 있나요?",
    answer:
      "수료증과 의견서는 모두 PDF로 만들어져서, '입력폼에 적으신 이메일 주소’로 보내집니다. 그래서 발급 신청할 때 이메일 주소를 한 번 더 확인해 주세요.",
  },
  {
    question: "환불 및 취소: 환불이나 취소는 어떻게 하나요?",
    answer:
      "희망과학심리상담센터에서 진행하는 심리교육과정은 결제 완료 시 환불 및 취소가 불가합니다. 다만, 무통장입금으로 결제 시 입금 대기인 상태(입금 전)에는 3시간 내 입금처리 되지 않을 경우 자동 취소 됩니다. ",
  },
  {
    question: "개별 과정 이수: 각 과정을 개별적으로 이수할 수 있나요?",
    answer:
      "네, 그렇게 할 수 있습니다. 예를 들어, 처음에는 성범죄 재발 방지 교육을 결제하고, 그것을 수료한 후에 수료증을 받을 수 있습니다. 그 다음에는 음주운전 강화 교육을 결제하고, 그것을 수료한 후에 수료증을 받을 수 있습니다. 이런 식으로 차례대로 결제하고 수료증을 받을 수 있습니다. 하지만 각 과정을 따로따로 수료하기보다는 모든 과정을 한 번에 결제하고 수료하는 것이 시간과 돈을 아낄 수 있습니다.",
  },
  {
    question:
      "수료증/의견서 수령 시간: 수료증이나 의견서는 신청 후 얼마나 빨리 받을 수 있나요?",
    answer:
      "일하는 시간 동안에는 신청하고 나서 최소 2시간 안에 이메일로 받을 수 있습니다. 일하는 시간이 아닌 경우에는(오후 6시 이후에 신청하면), 다음 날 아침에 받을 수 있습니다.",
  },
];

export const Home = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const counseling = useCounselingStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [content, setContent] = useState('');

  const handleCounselingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await counseling.createCounseling(name, email, phone, content);
      if (success) {
        alert("상담문의가 정상적으로 접수되었습니다.");
        setName('');
        setEmail('');
        setPhone('');
        setContent('');
      } else {
        alert("상담문의 등록에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("상담문의 등록 실패:", error);
      alert("상담문의 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    }

    setIsSubmitting(false);
  };


  return (
    <>
      <Header />
      <section className="main-section">
        <figure className="main-section-figure">
          <figcaption className="main-title">
            교육수료까지 단 30분.
            <br />
            30분의 투자로
            <br />
            여러분의 인생을 되찾으세요
          </figcaption>
          <figcaption className="sub-title">
            새로운 양형자료 준비 서비스,
            <br />
            당신은 더 나은 삶을 살 자격이 있습니다.
          </figcaption>
          <Link buttonStyle="default" color="white" to="/courses" label="수강신청 바로가기" fontSize="16px" />
        </figure>
        <img
          className="main-section-image"
          src={mainImage}
          alt="니케를 설명하는 이미지"
        />
      </section>
      <section className="home-about-section">
        <div className="home-section-title">About</div>
        <div className="home-section-title-large">
          불편하고 비합리적인
          <br />
          양형자료 준비 서비스를 혁신하고자 합니다.
        </div>
        <div className="home-section-desc">
          불편하고 복잡한 준비과정 그동안 힘드셨죠?
          <br />
          저희는 여러분이 더 나은 삶을 영위하실 수 있도록 노력하고 있습니다.
        </div>
        <Link buttonStyle="default" color="white" to="/courses" label="더 알아보기" fontSize="16px" />
        <img
          className="home-about-image"
          src={coursesImage}
          alt="더 알아보기 이미지"
        />
      </section>
      <section className="home-certificate-section">
        <div className="home-section-title">Certificate</div>
        <div className="home-section-title-large">
          양형교육센터에서 수료증 받고
          <br />
          재범방지 약속하세요.
        </div>
        <div className="home-certificate-table">
          <figure className="home-certificate-table-figure">
            <h4>성범죄 예방 심리교육</h4>
            <img
              className="home-certificate-image"
              src={certificationImage}
              alt="이수증서 예시 이미지"
            />
          </figure>
          <figure className="home-certificate-table-figure">
            <h4>음주폐혜 예방 심리교육&#40;준비중&#41;</h4>
            <img
              className="home-certificate-image"
              src={certificationImage03}
              alt="이수증서 예시 이미지"
            />
          </figure>
          <figure className="home-certificate-table-figure">
            <h4>중독범죄 예방 심리교육&#40;준비중&#41;</h4>
            <img
              className="home-certificate-image"
              src={certificationImage02}
              alt="이수증서 예시 이미지"
            />
          </figure>
        </div>
      </section>
      <section className="home-feature-section">
        <div className="home-section-title">Feature</div>
        <div className="home-section-title-large">
          희망과학심리상담센터만의 혜택
        </div>
        <div className="home-section-desc">
          여러분들만 아셨으면 좋겠습니다.
          <br />
          저희와 함께 하시면 이 모든 혜택들을 누리실 수 있습니다.
        </div>
        <div className="home-feature-section-article">
          <div className="home-feature-section-article-text">
            <div className="home-feature-section-article-title">
              #1 무제한 수강
            </div>
            <div className="home-feature-section-article-title-large">
              한번의 결제로
              <br />
              수강완료 할때까지,
              <br />
              무제한으로 수강하세요
            </div>
            <div className="home-feature-section-article-desc">
              테스트를 통과하지 못하더라도 괜찮습니다.
              <br />
              저희는 패스할때까지 무제한 수강이 가능합니다.
              <br />
              맘편하게 학습하세요.
              <br />
              패스할 때까지 저희가 함께해드립니다.
            </div>
          </div>
          <img className="home-feature-section-article-image01" alt="무제한 수강이 가능합니다." src={articleImage01} />
        </div>
        <div className="home-feature-section-article-black">
          <div className="home-feature-section-article">
            <img
              className="home-feature-section-article-image02"
              alt="수료증 보관이 영구적으로 가능합니다"
              src={articleImage02}
            />
            <div className="home-feature-section-article-text">
              <div className="home-feature-section-article-title">
                #2 수료증 무료 발급
              </div>
              <div className="home-feature-section-article-title-large">
                수강생들의 편의를 위한
                <br />
                양형교육센터 수료증
                <br />
                보관서비스 제공
              </div>
              <div className="home-feature-section-article-desc">
                수료증을 어디다 저장했는지 모르시겠다구요?
                <br />
                이제 수료증 잃어버릴 걱정 끝.
                <br />
                수강이 완료되면 수료증을 무료로 발급해드립니다.
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="home-review-section">
        <div className="home-review-section-title">User Reviews</div>
        <div className="home-review-section-title-large">
          저희 센터와 함께 많은 분들이
          <br />
          자신의 권리를 되찾으셨습니다.
        </div>
        <div className="home-section-title-p">
          그 다음 주인공은 바로 여러분 입니다.
        </div>
        <Carousel items={reviews} />
        </section>
      <section className="home-FAQ-section">
        <div className="home-FAQ-section-title">FAQ</div>
        <div className="home-section-title-large">자주 묻는 질문</div>
        <FaqAccordion faqs={faqData} />
        </section>
      <section className="home-contact-section">
        <div className="home-contact-info">
          <h4 className="home-contact-info-title">상담문의</h4>
          <table className="home-contact-info-table">
            <tbody>
              <tr>
                <td>
                  <img alt="Location pin" src={locationPinIcon} />
                </td>
                <td>서울특별시 성동구 상원6길 8, 비 1층 이72호&#40;성수동1가&#41;</td>
              </tr>
              <tr>
                <td>
                  <img alt="Phone" src={phoneIcon} />
                </td>
                <td>&#40;+82&#41; 010-2952-1960</td>
              </tr>
              <tr>
                <td>
                  <img alt="Mail" src={mailIcon} />
                </td>
                <td>hopescience0110@naver.com</td>
              </tr>
            </tbody>
          </table>
          <img
            className="home-contact-info-image"
            alt="희망과학심리상담센터 문의 상담 이미지"
            src={contactImage}
          />
        </div>
        <div className="home-contact-form">
        <form onSubmit={handleCounselingSubmit}>
      <Input
        mode="underline"
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "90%", height: "44px", padding: "0", maxWidth: "456px", display: "flex" }}
      />
      <Input
        mode="underline"
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "90%", height: "44px", padding: "0", maxWidth: "456px", display: "flex" }}
      />
      <Input
        mode="underline"
        type="tel"
        placeholder="연락처"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ width: "90%", height: "44px", padding: "0", maxWidth: "456px", display: "flex" }}
      />
      <textarea
        id="contact-content"
        placeholder="문의 내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
        {isSubmitting ? (
          <Button type="submit" label="문의 접수 중..." style={{ marginTop: "25px" }} disabled />
        ) : (
          <Button type="submit" label="문의하기" style={{ marginTop: "25px" }} />
        )}
        </form>
        </div>
      </section>
      <Footer />
    </>
  );
};