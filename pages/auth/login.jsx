import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Seo from "@/components/Seo/Seo";
import { Button, BaseInput, PasswordInput } from "@/components/ui";
import { loginUser, clearAuthError } from "@/redux/slice/auth";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Seo
        title="ログイン — Kanri"
        description="Kanriにサインインして、プロジェクトの管理を始めましょう。"
      />

      <div className="min-h-screen flex">
        {/* ====== Chap tomon — Login Forma ====== */}
        <div className="flex-1 flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-20 xl:px-28">
          {/* Logo / Brand */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-[#0A1D37] tracking-tight"
            >
            </Link>
          </div>

          {/* Forma */}
          <div className="w-full max-w-[400px]">
            {/* Sarlavha */}
            <div className="mb-8">
              <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0A1D37] leading-tight mb-3">
                お帰りなさい
              </h1>
              <p className="text-[15px] text-[#6B7280] leading-relaxed">
                今日は新しい一日の始まりです。あなた自身の手で、
                <br className="hidden sm:block" />
                素晴らしい一日にしましょう。サインインして、プロ
                <br className="hidden sm:block" />
                ジェクトの管理を始めましょう。
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                {typeof error === "string" ? error : "ログイン中にエラーが発生しました。"}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email */}
              <BaseInput
                id="login-email"
                label="メールアドレス"
                type="email"
                placeholder="Example@email.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email", {
                  required: "メールアドレスを入力してください。",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "正しいメールアドレスを入力してください。",
                  },
                })}
              />

              {/* Password */}
              <PasswordInput
                id="login-password"
                label="パスワード"
                placeholder="パスワードは8文字以上で入力してください。"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register("password", {
                  required: "パスワードを入力してください。",
                  minLength: {
                    value: 8,
                    message: "パスワードは8文字以上で入力してください。",
                  },
                })}
              />

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#0A1D37] hover:text-[#1E4174] transition-colors duration-150 font-medium"
                >
                  パスワードをお忘れですか？
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={loading}
              >
                ログイン
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div>
            <p className="text-xs text-[#9CA3AF] tracking-wider">
              © 2026 ALL RIGHTS RESERVED
            </p>
          </div>
        </div>

        {/* ====== O'ng tomon — Cover Rasm ====== */}
        <div className="hidden lg:block lg:w-[45%] xl:w-[50%] p-3">
          <div className="relative w-full h-full rounded-3xl overflow-hidden">
            <Image
              src="/images/auth-cover.png"
              alt="Modern coworking space"
              fill
              className="object-cover"
              priority
              unoptimized
              sizes="(min-width: 1024px) 50vw, 0vw"
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Auth sahifalar uchun AuthLayout ishlatish
LoginPage.layout = "auth";
