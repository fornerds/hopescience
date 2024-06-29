import "./style.css"
import { useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Header, Footer, Link } from "../../../../../components";
import { payment, enrollment } from "../../../../../store";


export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const confirmPayment = payment((state) => state.confirmPayment);
  const createEnrollment = enrollment((state)=> state.createEnrollment);
  let { course_id, user_id } = useParams();
  // const data = sessionStorage.getItem("auth-storage");
  // const accessToken = data ? JSON.parse(data).state?.accessToken : null;

  const today = new Date();
  const yyyy = String(today.getFullYear());
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}.${mm}.${dd}`;

  useEffect(() => {
    handlePaymentConfirm();
  }, []);

  const handlePaymentConfirm = async () => {
    try {
      const orderId = searchParams.get("orderId");
      const paymentKey = searchParams.get("paymentKey");
      const amount = parseInt(searchParams.get("amount"));
      
      const success = await confirmPayment(orderId, paymentKey, amount);
      if (success) {
        alert("결제 완료!");
        const enrollmentData = {
          user_id: parseInt(user_id),
          course_id: parseInt(course_id)
        };
        
        const enrollmentResponse = await createEnrollment(enrollmentData);
        if (enrollmentResponse) {
          console.log("강의 등록이 정상적으로 완료되었습니다.");
        } else {
          alert("결제는 성공했으나 강의 등록이 정상적으로 처리되지 않았습니다. 해당 내용을 문의해주시면, 강의 등록을 도와드리겠습니다.");
        }
      }
    } catch (error) {
      alert(`결제 오류 ${error}`);
    }
  };

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
