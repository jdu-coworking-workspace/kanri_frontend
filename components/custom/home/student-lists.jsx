import { StudentCard } from '@/components/ui'
import React from 'react'

export default function StudentLists() {
    return (
        <div className="flex flex-col gap-2 h-[400px] overflow-y-auto no-scrollbar">
            <StudentCard avatar="/images/avatar-2.png" name="Mamatova Shahlo" status="A" groupCount={"1"} katakana={"ママトワ・シャフロ"} studentId={"JP240004"} />
            <StudentCard avatar="/images/avatar-4.png" name="Qosimova Muhabbat" status="B" katakana={"コシモワ・ムハッバット"} studentId={"UZ240019"} />
            <StudentCard avatar="/images/avatar-3.png" name="Ergashev Ulugbek" status="B" katakana={"エルガシェフ・ウルグベク"} studentId={"UZ240009"} />
            <StudentCard avatar="/images/avatar-1.png" name="伊藤 みなみ" status="S" groupCount={2} katakana={"イトウ・ミナミ"} studentId={"UZ240009"} />
            <StudentCard avatar="/images/avatar-4.png" name="Qosimova Muhabbat" status="B" katakana={"コシモワ・ムハッバット"} studentId={"UZ240019"} />
            <StudentCard avatar="/images/avatar-3.png" name="Ergashev Ulugbek" status="B" katakana={"エルガシェフ・ウルグベク"} studentId={"UZ240009"} />
            <StudentCard avatar="/images/avatar-1.png" name="伊藤 みなみ" status="S" groupCount={2} katakana={"イトウ・ミナミ"} studentId={"UZ240009"} />
        </div>
    )
}
