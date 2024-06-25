import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../components/Header";
import "./style.css";
import { Footer } from "../../../components/Footer";
import { MyPageSideBar } from "../../../modules/MyPageSideBar";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { Modal } from "../../../modules/Modal/Modal";
import { user, auth } from "../../../store";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import rightArrowButton from "../../../icons/chevron-right-large.svg"

const schema = yup
  .object({
    name: yup.string().required("이름을 입력해주세요."),
    phone: yup
      .string()
      .required("연락처를 입력해주세요.")
      .matches(
        /^\d{3}-\d{3,4}-\d{4}$/,
        "유효한 연락처를 입력해주세요. 예 010-0000-0000"
      ),
    email: yup
      .string()
      .required("이메일 주소를 입력해주세요.")
      .email("유효한 이메일 주소를 입력해주세요."),
    password: yup.string().required("현재 비밀번호를 입력해주세요."),
    newPassword: yup.string().required("새 비밀번호를 입력해주세요."),
    newPasswordConfirm: yup
      .string()
      .oneOf(
        [yup.ref("newPassword"), null],
        "새 비밀번호와 새 비밀번호 확인의 값이 일치하지 않습니다."
      )
      .required("새 비밀번호 확인을 입력해주세요."),
  })
  .required();

export const Setting = () => {
  const isLoading = user((state) => state.isLoading);
  const getUser = user((state) => state.getUser);
  const userData = user((state) => state.profile);
  const updateUser = user((state) => state.updateUser);
  const updatePassword = auth((state) => state.updatePassword);
  const signout = auth((state) => state.signout);
  const [showModal, setShowModal] = useState(false);
  const data = sessionStorage.getItem("auth-storage");
  const myUserId = data ? JSON.parse(data).state?.user?.userId : null;
  const myUserUUID = data ? JSON.parse(data).state?.user?.uuid : null;
  const myAccessToken = data ? JSON.parse(data).state?.accessToken : null;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getUser(myUserId);
  }, []);

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    }
  }, [userData, reset]);

  const onSubmit = async (data) => {
    // console.log(myUserId, myUserUUID, data.email, data.name, data.phone);
    await updateUser(myUserId, myUserUUID, data.email, data.name, data.phone);
  };

  const changePassword = async (data) => {
    await updatePassword(data.password, data.newPassword, myAccessToken);
  };

  return (
    <>
      <Header />
      <main className="mypage-background">
        <div className="mypage-section-wrap">
          <MyPageSideBar />
          <div className="mypage-section">
            <div className="setting-title-group">
              <h2 className="setting-title">환경설정</h2>
              {isLoading ? <p>사용자 정보를 가져오는 중입니다...</p> : ""}
            </div>
            <form className="name-edit" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="name">성함</label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...register("name")}
                    type="name"
                    placeholder="ex) 홍길동"
                    mode="dark"
                    style={{ marginTop: "10px" }}
                    {...field}
                  />
                )}
              />
              {errors.name && (
                <p className="input-error-message">{errors.name?.message}</p>
              )}
              <Button
                label="저장하기"
                variant="primary"
                style={{
                  maxWidth: "280px",
                  width: "100%",
                  marginTop: "32px",
                  alignSelf: "center",
                }}
                type="submit"
              />
            </form>
            <form className="email-edit" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="email">Email</label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="ex) test@naver.com"
                    mode="dark"
                    style={{ marginTop: "10px" }}
                    value={watch("email", userData ? userData.email : "")}
                    onChange={(e) => setValue("email", e.target.value)}
                  />
                )}
              />
              {errors.email && (
                <p className="input-error-message">{errors.email?.message}</p>
              )}
              <Button
                label="저장하기"
                variant="primary"
                style={{
                  maxWidth: "280px",
                  width: "100%",
                  marginTop: "32px",
                  alignSelf: "center",
                }}
                type="submit"
              />
            </form>
            <form className="phone-edit" onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="phone">휴대폰 번호</label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <Input
                    {...register("phone")}
                    type="tel"
                    placeholder="ex) 010-0000-0000"
                    mode="dark"
                    style={{ marginTop: "10px" }}
                    value={watch("phone", userData ? userData.phone : "")}
                    onChange={(e) => setValue("phone", e.target.value)}
                  />
                )}
              />
              {errors.phone && (
                <p className="input-error-message">{errors.phone?.message}</p>
              )}
              <Button
                label="저장하기"
                variant="primary"
                style={{
                  maxWidth: "280px",
                  width: "100%",
                  marginTop: "32px",
                  alignSelf: "center",
                }}
                type="submit"
              />
            </form>
            <form
              className="password-edit"
              onSubmit={handleSubmit(changePassword)}
            >
              <label htmlFor="password">비밀번호</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    type="password"
                    mode="dark"
                    placeholder="현재 비밀번호"
                    style={{ marginTop: "10px" }}
                    {...field}
                  />
                )}
              />
              {errors.password && (
                <p className="input-error-message">
                  {errors.password?.message}
                </p>
              )}
              <Controller
                name="newPassword"
                control={control}
                render={({ field }) => (
                  <Input
                    type="password"
                    mode="dark"
                    placeholder="새 비밀번호"
                    style={{ marginTop: "10px" }}
                    {...field}
                  />
                )}
              />
              {errors.newPassword && (
                <p className="input-error-message">
                  {errors.newPassword?.message}
                </p>
              )}
              <Controller
                name="newPasswordConfirm"
                control={control}
                render={({ field }) => (
                  <Input
                    type="password"
                    mode="dark"
                    placeholder="새 비밀번호 확인"
                    style={{ marginTop: "10px" }}
                    {...field}
                  />
                )}
              />
              {errors.newPasswordConfirm && (
                <p className="input-error-message">
                  {errors.newPasswordConfirm?.message}
                </p>
              )}
              <Button
                label="저장하기"
                variant="primary"
                style={{
                  maxWidth: "280px",
                  width: "100%",
                  marginTop: "32px",
                  alignSelf: "center",
                }}
                type="submit"
              />
            </form>
            <div className="sign-out">
              <span className="sign-out-label">회원탈퇴</span>
              <Button
                label=""
                style={{
                  backgroundColor: "transparent",
                  width: "fit-content",
                  height: "fit-content",
                }}
                onClick={() => setShowModal(true)}
              >
                <img
                  className="img-11"
                  alt="Chevron right large"
                  src={rightArrowButton}
                />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Modal
        modalTitle="회원탈퇴"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          signout(myUserId);
          setShowModal(false);
          navigate("/");
        }}
      >
        <p>
          회원님이 결제한 강의정보와 이수증서 등 회원님이 활동한 정보가 탈퇴한
          시점으로 3개월 뒤에 모두 삭제됩니다. 현재 계정을 정말
          삭제하시겠습니까?
        </p>
      </Modal>
      <Footer />
    </>
  );
};
