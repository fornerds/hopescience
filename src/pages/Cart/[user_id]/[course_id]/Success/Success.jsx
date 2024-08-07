import "./style.css"
import { useEffect, useCallback, useRef } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Header, Footer, Link } from "../../../../../components";
import { payment, enrollment } from "../../../../../store";

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const confirmPayment = payment((state) => state.confirmPayment);
  const createEnrollment = enrollment((state) => state.createEnrollment);
  let { course_id, user_id } = useParams();
  
  const hasRunEffect = useRef(false);

  const today = new Date();
  const yyyy = String(today.getFullYear());
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}.${mm}.${dd}`;

  const handlePaymentConfirm = useCallback(async () => {
    if (hasRunEffect.current) return;
    hasRunEffect.current = true;

    try {
      const orderId = searchParams.get("orderId");
      const paymentKey = searchParams.get("paymentKey");
      const amount = parseInt(searchParams.get("amount"));

      // console.log("결제 확인 시도:", { orderId, paymentKey, amount });
      
      const paymentSuccess = await confirmPayment(orderId, paymentKey, amount);

      console.log("결제 확인 결과:", paymentSuccess);
      if (!paymentSuccess) {
        throw new Error("결제 확인에 실패했습니다.");
      }
      
      console.log("결제가 성공적으로 완료되었습니다.");
  
      const enrollmentData = {
        user_id: parseInt(user_id),
        course_id: parseInt(course_id)
      };
      
      console.log("강의 등록 시도:", enrollmentData);

      const enrollmentSuccess = await createEnrollment(enrollmentData);

      console.log("강의 등록 결과:", enrollmentSuccess);

      if (!enrollmentSuccess) {
        throw new Error("강의 등록에 실패했습니다.");
      }
  
      console.log("강의 등록이 정상적으로 완료되었습니다.");
      alert("결제 및 강의 등록이 성공적으로 완료되었습니다!");
  
    } catch (error) {
      console.error("처리 중 오류 발생:", error);
      
      if (error.response) {
        console.error("서버 응답:", error.response.data);
        console.error("상태 코드:", error.response.status);
      } else if (error.request) {
        console.error("요청 오류:", error.request);
      } else {
        console.error("오류 메시지:", error.message);
      }
  
      alert(`처리 중 오류가 발생했습니다: ${error.message}\n자세한 내용은 콘솔을 확인하고 관리자에게 문의해주세요.`);
    }
  }, [searchParams, confirmPayment, createEnrollment, course_id, user_id]);

  useEffect(() => {
    handlePaymentConfirm();
  }, [handlePaymentConfirm]);

  return (
    <>
      <Header />
      <main className="cart-background">
        <div className="cart-info-wrap">
          <div className="result-wrapper">
            <div className="box_section">
              <div className="box_section-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="80px" height="80px" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12C3 4.5885 4.5885 3 12 3C19.4115 3 21 4.5885 21 12C21 19.4115 19.4115 21 12 21C4.5885 21 3 19.4115 3 12Z" stroke="#bd9a31" strokeWidth="2"/>
                  <path d="M9 12L10.6828 13.6828V13.6828C10.858 13.858 11.142 13.858 11.3172 13.6828V13.6828L15 10" stroke="#bd9a31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h2 className="cart-success-title">결제가 정상적으로 완료되었습니다.</h2>
              </div>
              <div className="cart-success-label-wrap">
                <p className="cart-success-label">{`주문번호: ${searchParams.get("orderId")}`}</p>
                <p className="cart-success-label">{`결제일: ${dateStr}`}</p>
                <p className="cart-success-label">{`결제 금액: ${Number(
                  searchParams.get("amount")
                ).toLocaleString()}원`}</p>
              </div>
              <Link to={`/courses/${course_id}`} label="구매한 강의로 이동하기" fontSize="16px" buttonStyle="default" color="white" className="cart-success-link-button" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
