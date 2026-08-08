import React, { useState } from "react";
import {
  Button,
  Heading,
  Tag,
  Avatar,
  BaseInput,
  SearchInput,
  DateInput,
  BaseSelect,
  StudentCard,
  ProjectCard,
  Modal,
} from "../components/ui";

export default function UIDemo() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-kanri-bg p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        <section>
          <Heading level={1} size="xl" className="mb-6">
            UI Components Demo
          </Heading>
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
            <Heading level={2} size="lg">Buttons</Heading>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">追加する</Button>
              <Button variant="secondary">キャンセル</Button>
              <Button variant="outline">+ 学生を追加</Button>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" loading>Loading</Button>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
            <Heading level={2} size="lg">Inputs & Selects</Heading>
            <div className="grid grid-cols-2 gap-6">
              <BaseInput label="プロジェクトの名前" placeholder="グループ名を入力してください" />
              <SearchInput label="検索" placeholder="氏名・フリガナ・学籍番号" />
              <DateInput label="開始日" />
              <BaseSelect
                label="ステータス"
                placeholder="選択してください"
                options={[
                  { value: "1", label: "稼働中" },
                  { value: "2", label: "トライアル" },
                ]}
              />
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
            <Heading level={2} size="lg">Tags & Avatars</Heading>
            <div className="flex items-center gap-4">
              <Tag variant="trial">トライアル</Tag>
              <Tag variant="active">稼働</Tag>
              <Tag variant="complete">修復</Tag>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Avatar src="" alt="M" size="sm" status="online" />
              <Avatar src="" alt="S" size="md" status="recording" countryFlag="🇯🇵" />
              <Avatar src="" alt="U" size="lg" countryFlag="🇺🇿" />
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
            <Heading level={2} size="lg">Cards</Heading>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Heading level={3} size="md" className="mb-4">Student Card</Heading>
                <StudentCard
                  name="Mamatova Shahlo"
                  katakana="ママトワ・シャフロ"
                  studentId="JP240004"
                  countryFlag="🇯🇵"
                  status="online"
                />
              </div>
              <div>
                <Heading level={3} size="md" className="mb-4">Project Card</Heading>
                <ProjectCard
                  title="スマート農業IoT管理"
                  tags={[
                    { label: "トライアル", variant: "trial" },
                    { label: "稼働", variant: "active" },
                  ]}
                  dateRange="2026/05/25 〜 2026/10/06"
                  students={[
                    { name: "伊藤 みなみ", katakana: "イトウ・ミナミ", studentId: "JP240004", roleBadge: "S", isLeader: true, countBadge: 2 },
                    { name: "Mamatova Shahlo", katakana: "ママトワ・シャフロ", studentId: "JP240004", roleBadge: "A" },
                  ]}
                  totalSlots={4}
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
            <Heading level={2} size="lg">Modal</Heading>
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="プロジェクトを作成"
            >
              <div className="space-y-4">
                <BaseInput label="プロジェクトの名前" placeholder="グループ名を入力してください" />
                <div className="grid grid-cols-2 gap-4">
                  <DateInput label="開始日" />
                  <DateInput label="終了日" />
                </div>
                <BaseSelect
                  label="ステータス"
                  options={[{ value: "1", label: "稼働中" }]}
                />
              </div>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>キャンセル</Button>
                <Button variant="primary">追加する</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </section>
      </div>
    </div>
  );
}
