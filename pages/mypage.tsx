import React, {useState, useEffect, useCallback} from 'react'
import { useAuth } from './AuthContext';
import Link from "next/link";

interface User {
    id: number;
    email: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    birthDate?: {
        year: number;
        month: number;
        day: number;
    };
    zodiacSign?: string;
    saju?: string; // JSON 문자열 형태로 저장된 사주 정보
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
    role?: 'user' | 'admin' | 'moderator';
    profileImageUrl?: string;
    lastLoginDate?: Date;
}
interface Saju {
    year: string;
    month: string;
    day: string;
    yearElement: string;
    dayElement: string;
}

const SajuVisualization = ({ saju }: { saju: any }) => (
    <svg width="200" height="200" viewBox="0 0 200 200">
        <rect x="10" y="10" width="80" height="80" fill="#FFD700" stroke="#000" strokeWidth="2" />
        <rect x="110" y="10" width="80" height="80" fill="#87CEEB" stroke="#000" strokeWidth="2" />
        <rect x="10" y="110" width="80" height="80" fill="#90EE90" stroke="#000" strokeWidth="2" />
        <rect x="110" y="110" width="80" height="80" fill="#FFA07A" stroke="#000" strokeWidth="2" />
        <text x="50" y="55" textAnchor="middle" dominantBaseline="middle">{saju.year}</text>
        <text x="150" y="55" textAnchor="middle" dominantBaseline="middle">{saju.month}</text>
        <text x="50" y="155" textAnchor="middle" dominantBaseline="middle">{saju.day}</text>
        <text x="150" y="155" textAnchor="middle" dominantBaseline="middle">시주</text>
    </svg>
);
const ZodiacVisualization = ({ zodiacSign }: { zodiacSign: string }) => {
    const zodiacImages: { [key: string]: string } = {
        "염소자리": "♑", "물병자리": "♒", "물고기자리": "♓", "양자리": "♈",
        "황소자리": "♉", "쌍둥이자리": "♊", "게자리": "♋", "사자자리": "♌",
        "처녀자리": "♍", "천칭자리": "♎", "전갈자리": "♏", "사수자리": "♐"
    };

    return (
        <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="#F0F0F0" stroke="#000" strokeWidth="2" />
            <text x="50" y="50" fontSize="40" textAnchor="middle" dominantBaseline="middle">
                {zodiacImages[zodiacSign] || "?"}
            </text>
        </svg>
    );
};
// 별자리 계산 함수
const getZodiacSign = (month: number, day: number) => {
    const signs = ["염소자리", "물병자리", "물고기자리", "양자리", "황소자리", "쌍둥이자리",
        "게자리", "사자자리", "처녀자리", "천칭자리", "전갈자리", "사수자리"]
    const cutoffDays = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22]

    // 월을 조정하지 않고, 현재 월과 다음 월 사이의 경계를 확인합니다.
    if (day < cutoffDays[month - 1]) {
        return signs[month - 1]
    } else {
        return signs[month % 12]
    }
}
// 만세력
const heavenlyStems = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const earthlyBranches = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
const elements = ["목", "화", "토", "금", "수"];

function calculateSaju(year: number, month: number, day: number) {
    // 년간
    const yearStem = heavenlyStems[(year - 4) % 10];
    const yearBranch = earthlyBranches[(year - 4) % 12];

    // 월간 (정확한 계산을 위해서는 절기를 고려해야 하지만, 여기서는 간단히 처리합니다)
    const monthStem = heavenlyStems[(year * 2 + month + 3) % 10];
    const monthBranch = earthlyBranches[month];

    // 일간 (간단한 계산 방식으로, 정확한 계산을 위해서는 더 복잡한 로직이 필요합니다)
    const baseDate = new Date(1900, 0, 1);
    const targetDate = new Date(year, month - 1, day);
    const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    const dayStem = heavenlyStems[daysDiff % 10];
    const dayBranch = earthlyBranches[daysDiff % 12];

    return {
        year: `${yearStem}${yearBranch}`,
        month: `${monthStem}${monthBranch}`,
        day: `${dayStem}${dayBranch}`,
        yearElement: elements[heavenlyStems.indexOf(yearStem) % 5],
        dayElement: elements[heavenlyStems.indexOf(dayStem) % 5]
    };
}

export default function Component() {
    const { user, loading, error, logout } = useAuth() as {
        user: User | null,
        loading: boolean,
        error: string | null,
        logout: () => void
    };

    const [birthDate, setBirthDate] = useState({ year: '', month: '', day: '' })
    const [isEditing, setIsEditing] = useState(true)
    const [zodiacSign, setZodiacSign] = useState('')
    const [saju, setSaju] = useState<Saju | null>(null);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);
        if (!isValidDate(birthDate.year, birthDate.month, birthDate.day)) {
            alert('올바른 날짜를 입력해주세요.');
            return;
        }
        if (!user || !user.id) {
            console.error('User not authenticated');
            // 사용자에게 알림을 표시할 수 있습니다.
            alert('로그인이 필요합니다. 다시 로그인해 주세요.');
            // 로그인 페이지로 리디렉션하거나 다른 적절한 처리를 할 수 있습니다.
            return;
        }

        const sign = getZodiacSign(parseInt(birthDate.month), parseInt(birthDate.day));
        const sajuResult = calculateSaju(
            parseInt(birthDate.year),
            parseInt(birthDate.month),
            parseInt(birthDate.day)
        );

        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`http://localhost:8080/api/user-info/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    birthYear: parseInt(birthDate.year),
                    birthMonth: parseInt(birthDate.month),
                    birthDay: parseInt(birthDate.day),
                    zodiacSign: sign,
                    saju: JSON.stringify(sajuResult)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save user info');
            }

            const data = await response.json();
            console.log('User info saved successfully:', data);

            setZodiacSign(sign);
            setSaju(sajuResult);

            // 사용자에게 성공 메시지를 표시할 수 있습니다.
            alert('정보가 성공적으로 저장되었습니다.');

        } catch (error) {
            console.error('Failed to save user info:', error);
            // 사용자에게 오류 메시지를 표시할 수 있습니다.
            alert('정보 저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
            setIsEditing(true); // 사용자가 다시 입력할 수 있도록 편집 모드로 전환
        }
    }, [user, birthDate]);
    const isValidDate = (year: string, month: string, day: string) => {
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.getFullYear() === parseInt(year) &&
            date.getMonth() === parseInt(month) - 1 &&
            date.getDate() === parseInt(day);
    };
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const fetchUserInfo = useCallback(async (userId: number) =>{
        setIsLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            console.log("Fetching user info with token:", token);  // 토큰 로깅

            const response = await fetch(`http://localhost:8080/api/user-info/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("User info response:", response);  // 응답 로깅

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch user info: ${response.status} ${errorText}`);
            }
            const data = await response.json();
            console.log("Fetched user info:", data);  // 받아온 데이터 로깅

            if (data && data.birthYear) {
                setBirthDate({
                    year: data.birthYear.toString(),
                    month: data.birthMonth.toString(),
                    day: data.birthDay.toString()
                });
                setZodiacSign(data.zodiacSign);
                setSaju(JSON.parse(data.saju));
                setIsEditing(false);
            } else {
                console.log("No birth date information available");
                setIsEditing(true);
            }
        }catch (error) {
            console.error('Failed to fetch user info:', error);
            setIsEditing(true);
            setFetchError('사용자 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
        }finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                console.log("User data:", user);  // user 객체 로깅
                if (user.id) {
                    await fetchUserInfo(user.id);
                } else {
                    console.error("User object doesn't have an id property", user);
                    // 여기서 적절한 처리를 추가할 수 있습니다. 예를 들어:
                    setIsEditing(true);
                }
            } else {
                console.log("User not logged in or data not loaded yet");
            }
        };

        fetchData();
    },  [user, fetchUserInfo]);
    const containerStyle: React.CSSProperties = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '1rem',
        fontFamily: 'Arial, sans-serif',
    }

    const cardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '1rem',
        padding: '1rem',
    }

    const headerStyle: React.CSSProperties = {
        borderBottom: '1px solid #e5e5e5',
        paddingBottom: '0.5rem',
        marginBottom: '1rem',
    }

    const titleStyle: React.CSSProperties = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '0.5rem',
    }

    const buttonStyle: React.CSSProperties = {
        backgroundColor: '#0070f3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        fontSize: '1rem',
    }
    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>오류 발생: {error}</div>;
    }

    if (!user) {
        return <div>로그인이 필요합니다.</div>;
    }
    if (fetchError) {
        return <div>오류: {fetchError}</div>;
    }
    if (isLoading) { return <div>사용자 정보를 불러오는 중...</div>; }
    return (
        <div style={containerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ ...titleStyle }}>안녕하세요, {user.email}님!</h1>
                <button aria-label="로그아웃" onClick={logout} style={buttonStyle}>로그아웃</button>
            </div>
            <h1 style={{ ...titleStyle, marginBottom: '1rem' }}>생년월일 및 운세 정보</h1>

            <div style={cardStyle}>
                <div style={headerStyle}>
                    <h2 style={titleStyle}>생년월일 {isEditing ? '등록' : '정보'}</h2>
                </div>
                <div>
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="year" style={{ display: 'block', marginBottom: '0.25rem' }}>년</label>
                                    <input
                                        id="year"
                                        type="number"
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        style={inputStyle}
                                        value={birthDate.year}
                                        onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}
                                        placeholder="YYYY"
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="month" style={{ display: 'block', marginBottom: '0.25rem' }}>월</label>
                                    <input
                                        id="month"
                                        type="number"
                                        min="1"
                                        max="12"
                                        style={inputStyle}
                                        value={birthDate.month}
                                        onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value })}
                                        placeholder="MM"
                                        required
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="day" style={{ display: 'block', marginBottom: '0.25rem' }}>일</label>
                                    <input
                                        id="day"
                                        type="number"
                                        min="1"
                                        max="31"
                                        style={inputStyle}
                                        value={birthDate.day}
                                        onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}
                                        placeholder="DD"
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" style={buttonStyle}>등록</button>
                        </form>
                    ) : (
                        <div>
                            <p>생년월일: {birthDate.year}년 {birthDate.month}월 {birthDate.day}일</p>
                            {user && (
                                <Link href={`/saju-analysis/${user.id}`}>
                                    내 사주 분석 결과 보기
                                </Link>
                            )}
                            <br></br>
                            <button onClick={() => setIsEditing(true)} style={{ ...buttonStyle, marginTop: '0.5rem' }}>수정</button>
                        </div>
                    )}
                </div>
            </div>

            <div style={cardStyle}>
                <div style={headerStyle}>
                    <h2 style={titleStyle}>만세력 (사주 분석)</h2>
                </div>
                <div>
                    {saju ? (
                        <div>
                            <SajuVisualization saju={saju} />
                            <p>년주: {saju.year} ({saju.yearElement})</p>
                            <p>월주: {saju.month}</p>
                            <p>일주: {saju.day} ({saju.dayElement})</p>
                            <p>* 시주는 생시(時) 정보가 필요하여 계산하지 않았습니다.</p>
                        </div>
                    ) : (
                        <p>생년월일을 입력하면 만세력 정보가 표시됩니다.</p>
                    )}
                </div>
            </div>

            <div style={cardStyle}>
                <div style={headerStyle}>
                    <h2 style={titleStyle}>별자리 정보</h2>
                </div>
                <div>
                    {zodiacSign ? (
                        <div>
                            <ZodiacVisualization zodiacSign={zodiacSign} />
                            <p>당신의 별자리는 {zodiacSign}입니다.</p>
                        </div>
                    ) : (
                        <p>생년월일을 입력하면 별자리 정보가 표시됩니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}