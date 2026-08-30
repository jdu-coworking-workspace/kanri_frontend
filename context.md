# Frontend Development Context

## Sana: 2026-08-28
### Backend API integratsiyasi bo'yicha tuzatishlar:
1. **Avtorizatsiya Cookie sozlamalari**: 
   - Backend HttpOnly Cookie orqali tokenni qaytaradi, shuning uchun `frontend/redux/slice/auth.js` faylidan eski `localStorage` (access_cads) logikasi olib tashlandi.
   - Login va Logout jarayonlarida faqat API bilan ishlash qoldirildi, brauzer cookie'larni o'zi saqlab boshqaradi.
2. **Axios interseptori**:
   - `frontend/utils/axios.js` faylida tokenni `localStorage` dan qidirib `Authorization` sarlavhasiga qo'shuvchi request interceptor (so'rovni ushlab qoluvchi) olib tashlandi.
   - `withCredentials: true` oldindan yozilgani uchun so'rovlar muvaffaqiyatli HttpOnly Cookie bilan ketadi.
3. **SWR Fetcher sozlamalari**:
   - `frontend/utils/fetcher.js` faylida `fetch` so'rovi uchun `credentials: "include"` opsiyasi qo'shildi. Shu orqali Next.js (port 3000) dan Backendga (port 8000) so'rov yuborilganda Cookie muvaffaqiyatli yuboriladi.

*Ushbu o'zgarishlar orqali frontend va backend o'rtasidagi avtorizatsiya to'liq HttpOnly cookie orqali ishlaydigan bo'ldi.*

### Data Fetching integratsiyasi (SWR):
1. **StudentLists komponenti**:
   - `frontend/components/custom/students/student-lists.jsx` fayli statik (dummy) ma'lumotlardan tozalab tashlandi.
   - `useSWR` xuki va `fetcher` funksiyasi yordamida `/students` API'dan dinamik ravishda haqiqiy ma'lumotlar olinadigan qilindi.
2. **ProjectLists komponenti**:
   - `frontend/components/custom/home/project-lists.jsx` faylida ham statik data o'chirildi.
   - `useSWR('projects')` yordamida backenddan loyihalar ro'yxati olinadigan bo'ldi va `ProjectCard` propslariga moslashtirildi.

### 3. Qidiruv va Filtr integratsiyasi (URL Query Parameters):
- Qidiruv va filtratsiya UI komponentlari (`ProjectSearchBox`, `StudentSearchBox`, `StudentListFilter`) to'g'ridan-to'g'ri ro'yxat komponentlariga bog'lanmasdan, o'zgarishlarni Next.js `router` orqali URL'ga (masalan: `?q=...&status=...`) yozadigan qilindi.
- `StudentLists` va `ProjectLists` komponentlarida `useRouter` orqali ushbu URL parametrlarni o'qib, SWR yordamida backend API'siga qidiruv parametrlarini dinamik uzatish yo'lga qo'yildi. 
- **Foydasi:** Bu arxitekturaviy yondashuv komponentlarni bir-biriga qaram bo'lishidan asraydi va foydalanuvchilarga qidiruv natijalari saqlangan URL havolalarini ulashish imkonini beradi.

### 4. Ma'lumot yaratish integratsiyasi (Modallar va POST API):
- **Student Qo'shish (`StudentListFilter` & `AddStudentModal`)**:
  - Forma `onSubmit` funksiyasi orqali birinchi bo'lib talabani `POST /students` orqali yaratadi.
  - Agar talaba muvaffaqiyatli yaratilsa va unga rasm tanlangan bo'lsa, `POST /uploads/avatar` API ga rasm yuborilib talaba profili rasmi saqlanadi.
  - SWR keshini yangilash (`mutate`) to'g'ri o'rnatildi.
- **Loyiha Yaratish (`ProjectSearchBox` & `CreateProjectModal`)**:
  - `CreateProjectModal` ga backend talab qilgan `category` dropdown tanlovi qo'shildi.
  - Loyihaning boshlanish va tugash sanalari (`YYYY/MM/DD`) backend formati (`YYYY-MM-DD`) bo'yicha formatlandi va `POST /projects` API siga ulangan holda muvaffaqiyatli yaratiladigan qilindi.

### 5. Foydalanuvchi Sessiyasi Integratsiyasi (Auth Profile):
- `pages/_app.jsx` da ilova birinchi yuklanganda avtomatik `getMe` thunk chaqiriladigan bo'ldi. Bu foydalanuvchining session cookie holatini tekshiradi.
- `DetailedBtns` (Header) komponenti endi foydalanuvchining to'liq ismini (`user.full_name`) Redux auth slice orqali dinamik o'qib ko'rsatadi (muqaddam statik edi).

### 6. Sahifalar Himoyasi va Avtomatik Yo'naltirish (Phase 3):
- Redux auth slice (`auth.js`) ga `initialized` flagi qo'shildi. Bu sessiya tekshiruvi (`getMe`) yakunlanganligini bildiradi.
- `pages/_app.jsx` ichida xavfsiz **Route Guard** tizimi o'rnatildi.
- Mehmon foydalanuvchilar himoyalangan `/dashboard` sahifalariga kirishga urinsa `/auth/login` ga avtomatik yo'naltiriladi.
- Tizimga kirgan foydalanuvchilar login sahifalariga (`/auth/login`) yoki bosh sahifaga (`/`) kirsa avtomatik `/dashboard` ga yo'naltiriladi.
- Sessiya tekshirilayotgan vaqtda (ya'ni `initialized` false bo'lsa), layout va kontent miltillashini (flash) oldini olish uchun chiroyli yuklanish ekrani (loading spinner) ko'rsatiladi.

### 7. Loyiha va Talabalar uchun To'liq CRUD Amallari (Phase 4):
- **Loyihalarni Tahrirlash va O'chirish**:
  - `CreateProjectModal` modali endi mavjud loyiha tahrirlanayotgan bo'lsa, formani o'sha loyiha ma'lumotlari bilan to'ldiradi va sarlavhalarni o'zgartiradi.
  - `ProjectCard` dropdown menyusidagi tahrirlash (Edit) va o'chirish (Delete) tugmalari API (`PUT /projects/{id}` va `DELETE /projects/{id}`) ga ulandi.
  - O'chirish yoki saqlash amallari yakunlanganda SWR global keshini tozalash filter funksiyasi orqali loyihalar ro'yxati avtomatik yangilanadi (`mutate((key) => key.startsWith('projects'))`).
- **Talabalarni Tahrirlash va O'chirish**:
  - `AddStudentModal` modali talaba tahrirlanayotgan bo'lsa, uning ma'lumotlari (ism, katakana, ID, semestr) bilan prefill qilinadi va "Save" (Saqlash) hamda "Delete" (O'chirish) tugmalarini chiqaradi.
  - `StudentCard` kartasiga bosilganda o'sha talabani tahrirlash / o'chirish modali ochiladi.
  - Tahrirlash va o'chirish API (`PUT /students/{id}` va `DELETE /students/{id}`) logikalari va rasmni qayta yuklash/yangilash to'liq ulandi.

### 8. Loyiha A'zolarini Boshqarish va HTML5 Drag & Drop (Phase 5):
- **A'zo Biriktirish (`AssignMemberModal`)**:
  - Loyihadagi bo'sh slotlar (`+` tugmalari) bosilganda yangi a'zo biriktirish modali ochiladi.
  - Tizimdagi talabalar `/students` API orqali tortilib, loyihada allaqachon mavjud a'zolar ro'yxatdan filtrlanadi.
  - Talabani loyiha rahbari (`is_leader`) sifatida ham qo'shish imkoniyati qo'shildi (`POST /projects/{id}/members`).
- **A'zolarni Boshqarish (Dropdown Popover)**:
  - `ProjectCard` ichidagi student avatariga klik qilinganda kichik dropdown menyu ochiladi.
  - Unda "Leader qilish / Leaderlikni bekor qilish" (is_leader holatini o'zgartirish) va "Loyihadan o'chirish" (`DELETE /projects/{id}/members/{student_id}`) amallari to'liq ulandi.
- **Loyihalararo Drag & Drop**:
  - HTML5 native Drag & Drop API yordamida loyihalararo talabalarni sichqoncha bilan surib ko'chirish yo'lga qo'yildi.
  - Tortilayotgan (dragging) student ustiga olib borilganda maqsad loyiha kartasi atrofida **neon ko'k rangli border/glow** effekti paydo bo'lib, modern UX taqdim etadi.
  - Drop hodisasi amalga oshganda `PATCH /projects/{source_id}/members/{student_id}/move` API si chaqirilib, SWR kesh avtomatik yangilanadi.

### 9. Sozlamalar Sahifasi va Xodimlar Boshqaruvi (Phase 6):
- **Kirish Xavfsizligi (Access Control)**:
  - `/dashboard/settings` sahifasiga kirish faqatgina `admin` huquqiga ega bo'lgan foydalanuvchilar uchun cheklandi (`user?.role === 'admin'`).
  - Oddiy xodim (`staff`) kirishga urinsa, unga xavfsiz va premium dizayndagi **"Access Denied" (Kirish taqiqlangan)** ogohlantirish ekrani ko'rsatiladi.
- **Xodimlar Ro'yxati va Rol O'zgartirish**:
  - `GET /users` API ga ulanib, tizimdagi barcha xodimlarning premium ro'yxati (Ism, Email, Yaratilgan sana, Rol va Harakatlar) ko'rsatildi.
  - Xodimlarning rollarini (Admin/Staff) bevosita jadval ichidagi qulay dropdown orqali o'zgartirish ulandi (`PUT /users/{id}/role`).
  - Xavfsizlik uchun tizimdagi joriy foydalanuvchining o'z rolini o'zgartira olishi va o'zini o'chira olishi dasturiy jihatdan qulflab qo'yildi.
- **Xodim Qo'shish va O'chirish**:
  - Yangi xodim (Helper yoki Admin) yaratish uchun `AddStaffModal` formasi yaratildi. U orqali xodim ismi, elektron pochtasi va kamida 6 ta belgili parol talab qilinadi (`POST /users`).
  - Xodimni tizimdan o'chirish (`DELETE /users/{id}`) to'liq ulandi va SWR kesh yangilanishi (`mutate('users')`) bilan ta'minlandi.

### 10. Tizim uchun to'liq Mock Seeder Ssenariysi:
- **`seed_all.py` Yaratildi**:
  - Barcha jadvallarni (Loyihalar, Talabalar, Loyiha a'zolari) tozalab, ma'lumotlar yaxlitligini ta'minlovchi seeder yaratildi (`backend/src/database/seed_all.py`).
  - **20 ta talaba** yapon va o'zbek ismlari, tegishli Katakana o'qilishlari, semestr va skill darajalari bilan yaratildi. Avatarlar `/images/avatar-1.png` dan `avatar-4.png` gacha bo'lgan rasmlarga mos ravishda aylantirilib yuklandi.
  - **5 ta loyiha** har xil kategoriya va statuslar bo'yicha shakllantirildi (IT, video, cowork, trial, light_work).
  - **Loyiha a'zolari va rahbarlari** o'zaro bog'lanib, real ma'lumotlar bilan to'ldirildi.




