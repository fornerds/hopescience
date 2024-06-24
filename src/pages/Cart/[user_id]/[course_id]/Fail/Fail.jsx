import { useSearchParams } from "react-router-dom";
import { Footer } from "../../../../../components/Footer";
import { Header } from "../../../../../components/Header";

export function FailPage() {
  const [searchParams] = useSearchParams();

  return (
    <>
      <Header />
      <main className="cart-background">
        <div className="cart-info-wrap">
          <div className="result wrapper">
            <div className="box_section">
              <h2>결제 실패</h2>
              <p>{`에러 코드: ${searchParams.get("code")}`}</p>
              <p>{`실패 사유: ${searchParams.get("message")}`}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
