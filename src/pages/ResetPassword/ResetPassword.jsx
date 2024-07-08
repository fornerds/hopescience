import { Button, Footer, Header, Input } from "../../components"
import { useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { auth } from "../../store";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    password: yup
      .string()
      .required("비밀번호를 입력해주세요.")
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .matches(/[a-zA-Z]/, "비밀번호에는 문자가 포함되어야 합니다.")
      .matches(/[0-9]/, "비밀번호에는 숫자가 포함되어야 합니다."),
  })
  .required();

export const ResetPassword = () => {
    const resetPasswordConfirm = auth((state) => state.resetPasswordConfirm);
    const [searchParams] = useSearchParams();
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
      } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
          password: "",
        },
        mode: 'onSubmit',
      });

      const onSubmit = async (data) => {
        const token = searchParams.get("token");
        const {password} = data;
        try {
            const success = await resetPasswordConfirm(token, password);
            if(success){
                alert(success.message)
            }
        } catch (error) {
            alert("비밀번호 변경 API에서 오류가 발생했습니다.")
        }
      };

    return (
        <>
            <Header />
            <main className="signup-background">
                <div className="find-password-box">
                <h3 className="signup-title">비밀번호 재설정</h3>
                <div className="find-password-content">
                    <form className="signin-form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="signin-input">
                            <label htmlFor="password" className="signin-input-label">
                            새로운 비밀번호
                            </label>
                            <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input
                                {...field}
                                type="password"
                                placeholder="새로운 비밀번호를 입력하세요"
                                />
                            )}
                            />
                            {errors.password && (
                            <p className="input-error-message">{errors.password.message}</p>
                            )}
                        </div>
                        <Button
                            variant="default"
                            size="full"
                            type="submit"
                            label={isSubmitting ? "전송 중.." : "비밀번호 변경하기"}
                            disabled={isSubmitting}
                        />
                    </form>
                </div>
            </div>
            </main>
            <Footer />
        </>
    )
}
