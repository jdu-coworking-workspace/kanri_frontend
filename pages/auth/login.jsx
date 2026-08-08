import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Seo from "@/components/Seo/Seo";
import { Button, BaseInput, PasswordInput } from "@/components/ui";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Xatoni tozalash
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスを入力してください。";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "正しいメールアドレスを入力してください。";
    }

    if (!formData.password) {
      newErrors.password = "パスワードを入力してください。";
    } else if (formData.password.length < 8) {
      newErrors.password = "パスワードは8文字以上で入力してください。";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: API call
      console.log("Login:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
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

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <BaseInput
                id="login-email"
                label="メールアドレス"
                name="email"
                type="email"
                placeholder="Example@email.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
              />

              {/* Password */}
              <PasswordInput
                id="login-password"
                label="パスワード"
                name="password"
                placeholder="パスワードは8文字以上で入力してください。"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="current-password"
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
                isLoading={isLoading}
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
