import "./Admin.css";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { auth } from "../../store";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    email: yup.string().required("이메일 주소를 입력하세요"),
    password: yup.string().required("비밀번호를 입력하세요"),
  })
  .required();

export const Admin = () => {
  const adminLogin = auth((state) => state.adminLogin);
  const user = auth((state) => state.user);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    const { email, password } = data;

    try {
      const success = await adminLogin(email, password);
      if (success) {
        navigate("/admin/users");
      } else {
        alert("로그인 실패. 아이디와 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      alert(`Login failed: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <>
      <div className="admin-login-background">
        <div className="admin-form-container">
          <h2 className="admin-title">관리자페이지 로그인</h2>
          <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="username">
                아이디
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    className="admin-input"
                    {...field}
                    type="text"
                    placeholder="이메일주소를 입력하세요"
                  />
                )}
              />
              {errors.email && (
                <p className="input-error-message">{errors.email.message}</p>
              )}
            </div>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="password">
                비밀번호
              </label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    className="admin-input"
                    {...field}
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                  />
                )}
              />
              {errors.password && (
                <p className="input-error-message">{errors.password.message}</p>
              )}
            </div>
            <div className="admin-form-group">
              <Button
                className="admin-button"
                type="submit"
                label={isSubmitting ? "로그인 중..." : "Sign in"}
                size="full"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
