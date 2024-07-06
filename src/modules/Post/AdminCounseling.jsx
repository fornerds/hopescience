import React, { useState, useEffect } from "react";
import "./Post.css";
import { Button } from "../../components/Button";
import { useParams, useNavigate } from "react-router-dom";
import { useCounselingStore } from "../../store";
import { Modal } from "../Modal";
import AvatorIcon from "../../icons/avatar-22-2.svg"


export const AdminCounseling = () => {
    let { counseling_id } = useParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const {getCounseling, isCounselingisLoading, counseling, deleteCounseling} = useCounselingStore((state) => ({
        getCounseling: state.getCounseling,
        isCounselingisLoading: state.isLoading,
        counseling: state.counseling,
        deleteCounseling: state.deleteCounseling
    }))

    useEffect(()=>{
        getCounseling(counseling_id);
    }, [])

    
    return (
        <main className="post-detail-page-background">
            <div className="post-detail-page">
                {isCounselingisLoading ? (<p>Loading...</p>):(<>
            <div className="post-header">
              <div className="counseling-post-info-wrap">
                <div className="post-category">
                    문의하기
                </div>
                <div className="counseling-post-info">
                  <span className="counseling-post-info-user">
                    <img src={AvatorIcon} alt="사용자 이미지" />{" "}
                    {counseling?.name}
                  </span>
                  <span className="counseling-post-info-value">
                    {`${new Date(counseling.created_at).toLocaleDateString("ko-KR")} ${new Date(counseling.created_at).toLocaleTimeString("ko-KR")}`}
                  </span>
                  <span className="counseling-post-info-value">
                  {counseling?.email}
                  </span>
                  <span className="counseling-post-info-value">
                  {counseling?.phone}
                  </span>
                </div>
            </div>
            <div className="counseling-post-actions">
                <Button
                    label="삭제하기"
                    variant="danger"
                    style={{
                    width: "105px",
                    height: "36px",
                    fontSize: "14px",
                    }}
                    onClick={() => setShowModal(true)}
                />
            </div>
            </div>
            <pre className="post-content">
              {counseling?.content}
            </pre>
            </>)}
            <Modal
                modalTitle="문의 삭제"
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => {
                    deleteCounseling(counseling_id)
                    setShowModal(false);
                    navigate("admin/QnA");
                }}
                confirmLabel="삭제"
                >
                <p>정말 문의한 내용을 삭제하시겠습니까?</p>
            </Modal>
            </div>
        </main>
    )
}