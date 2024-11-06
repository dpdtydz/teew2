"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { AlertCircle } from "lucide-react"

const FiveElementsGraph = ({ elementCounts }) => {
    const colors = {
        '목': '#7CB342', // 연한 녹색
        '화': '#FF5722', // 붉은색
        '토': '#FFA000', // 황토색
        '금': '#FFD700', // 금색
        '수': '#29B6F6'  // 하늘색
    }

    const maxCount = Math.max(...Object.values(elementCounts))
    const scale = (value) => (value / maxCount) * 80 + 20 // Scale to 20-100

    const points = [
        [50, 10],   // 화 (top)
        [90, 58],   // 토 (right)
        [75, 90],   // 금 (bottom right)
        [25, 90],   // 수 (bottom left)
        [10, 58]    // 목 (left)
    ]

    const elements = ['화', '토', '금', '수', '목']

    return (
        <div className="w-full aspect-square max-w-xl mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                    <pattern id="koreaPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M0 10 L10 0 L20 10 L10 20 Z" fill="none" stroke="#E0E0E0" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#koreaPattern)" />

                {elements.map((element, i) => {
                    const nextIndex = (i + 1) % 5
                    const [x1, y1] = points[i]
                    const [x2, y2] = points[nextIndex]
                    const count = elementCounts[element] || 0
                    const scaledX = 50 + (x1 - 50) * scale(count) / 100
                    const scaledY = 50 + (y1 - 50) * scale(count) / 100

                    return (
                        <React.Fragment key={element}>
                            <line
                                x1="50" y1="50"
                                x2={scaledX} y2={scaledY}
                                stroke={colors[element]}
                                strokeWidth="2"
                            />
                            <circle
                                cx={scaledX} cy={scaledY}
                                r="3"
                                fill={colors[element]}
                            />
                            <text
                                x={x1} y={y1}
                                textAnchor="middle"
                                fill={colors[element]}
                                fontSize="4"
                                fontWeight="bold"
                            >
                                {element} ({count})
                            </text>
                        </React.Fragment>
                    )
                })}

                <polygon
                    points="50,10 90,58 75,90 25,90 10,58"
                    fill="none"
                    stroke="#8D6E63"
                    strokeWidth="1"
                />
            </svg>
        </div>
    )
}

const interpretDominantElement = (elementCounts) => {
    const dominantElement = Object.entries(elementCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]

    const interpretations = {
        '목': "창의성과 성장의 기운이 강합니다. 새로운 아이디어를 실현하고 성장을 추구하는 데 유리한 시기입니다. 유연성을 발휘하여 변화에 잘 적응할 수 있습니다.",
        '화': "열정과 활력의 기운이 넘칩니다. 적극적으로 목표를 향해 나아가고 자신의 의견을 표현하기에 좋은 시기입니다. 다만, 충동적인 행동을 조심해야 합니다.",
        '토': "안정과 중용의 기운이 강합니다. 실용적이고 신중한 접근이 효과적일 것입니다. 기초를 다지고 장기적인 계획을 세우는 데 유리한 시기입니다.",
        '금': "결단력과 정의의 기운이 돋보입니다. 명확한 판단과 결정이 필요한 상황에서 뛰어난 능력을 발휘할 수 있습니다. 정확성과 효율성을 추구하세요.",
        '수': "지혜와 통찰력의 기운이 강합니다. 깊이 있는 사고와 학습에 유리한 시기입니다. 유연한 소통과 협력을 통해 문제를 해결할 수 있습니다."
    }

    return interpretations[dominantElement] || "오행이 균형을 이루고 있습니다. 다양한 측면에서 조화로운 발전이 가능한 시기입니다."
}

export default function SajuAnalysisPage() {
    const [analysisData, setAnalysisData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            if (!router.isReady) return;
            const { userId } = router.query;
            if (!userId) return;

            try {
                setLoading(true)
                const token = localStorage.getItem('jwtToken')
                const response = await axios.get(
                    `http://localhost:8080/api/user-info/${userId}/saju-analysis`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setAnalysisData(response.data)
            } catch (err) {
                console.error('Error:', err)
                setError('사주 분석을 불러오는데 실패했습니다.')
                if (err.response?.status === 401) {
                    router.push('/')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router.isReady, router.query])

    if (loading) {
        return (
            <div className="space-y-4 p-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive" className="m-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>오류</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    if (!analysisData) return null

    const { analysis, elementCounts } = analysisData
    const dominantElementInterpretation = interpretDominantElement(elementCounts)

    return (
        <div className="min-h-screen bg-stone-100 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-stone-800">
                            사주 분석 결과
                        </CardTitle>
                        <CardDescription>
                            귀하의 사주에 대한 오행 분석과 해석입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FiveElementsGraph elementCounts={elementCounts} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-stone-800">
                            우세한 오행의 해석
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-stone-700">
                            {dominantElementInterpretation}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-stone-800">
                            상세 분석
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {analysis.split('\n').map((line, index) => (
                                <p key={index} className="text-stone-700">{line}</p>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}