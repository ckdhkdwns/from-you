'use client';

import { ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, LineChart } from 'recharts';
import { useStatistics } from '@/app/admin/(routes)/(dashboard)/_contexts/statistics-provider';

interface OverviewProps {
    isMonthly?: boolean;
}

export function Overview({ isMonthly = false }: OverviewProps) {
    const { letters, users } = useStatistics();

    // 데이터 변환 함수
    const processData = () => {
        if (letters.length === 0 && users.length === 0) {
            // 데이터가 없는 경우에도 기본 구조 생성
            if (isMonthly) {
                // 1일부터 31일까지의 빈 데이터 생성
                const emptyDailyData = [];
                for (let i = 1; i <= 31; i++) {
                    const date = i.toString().padStart(2, '0');
                    emptyDailyData.push({ date, 결제금액: 0, 신규가입: 0 });
                }
                return emptyDailyData;
            } else {
                // 00시부터 23시까지의 빈 데이터 생성
                const emptyHourlyData = [];
                for (let i = 0; i < 24; i++) {
                    const hour = i.toString().padStart(2, '0');
                    emptyHourlyData.push({ hour, 결제금액: 0, 신규가입: 0 });
                }
                return emptyHourlyData;
            }
        }

        // isMonthly에 따라 일별 또는 시간대별 데이터 처리
        if (isMonthly) {
            // 1일부터 31일까지의 기본 데이터 초기화
            const dailyData = new Map();
            for (let i = 1; i <= 31; i++) {
                const date = i.toString().padStart(2, '0');
                dailyData.set(date, { date, 결제금액: 0, 신규가입: 0 });
            }

            // 결제 완료된 편지들의 일별 결제금액 합계 계산
            letters.forEach(letter => {
                if (letter.paymentStatus === 'complete' && letter.priceInfo?.totalPrice) {
                    const date = letter.paymentCompletedAt
                        ? new Date(letter.paymentCompletedAt)
                              .toISOString()
                              .split('T')[0]
                              .substring(8, 10)
                        : new Date(letter.createdAt || '')
                              .toISOString()
                              .split('T')[0]
                              .substring(8, 10);

                    if (dailyData.has(date)) {
                        const dayData = dailyData.get(date);
                        dayData['결제금액'] += letter.priceInfo?.totalPrice;
                        dailyData.set(date, dayData);
                    }
                }
            });

            // 일별 가입자 수 계산
            users.forEach(user => {
                const date = new Date(user.createdAt).toISOString().split('T')[0].substring(8, 10);

                if (dailyData.has(date)) {
                    const dayData = dailyData.get(date);
                    dayData['신규가입'] += 1;
                    dailyData.set(date, dayData);
                }
            });

            // Map을 배열로 변환하고 날짜순으로 정렬
            return Array.from(dailyData.values()).sort(
                (a, b) => parseInt(a.date) - parseInt(b.date),
            );
        } else {
            // 시간대별 데이터 처리
            const hourlyData = new Map();

            // 24시간 기본 데이터 초기화 (00시 ~ 23시)
            for (let i = 0; i < 24; i++) {
                const hour = i.toString().padStart(2, '0');
                hourlyData.set(hour, { hour, 결제금액: 0, 신규가입: 0 });
            }

            // 결제 완료된 편지들의 시간대별 결제금액 합계 계산
            letters.forEach(letter => {
                if (letter.paymentStatus === 'complete' && letter.priceInfo?.totalPrice) {
                    const hour = letter.paymentCompletedAt
                        ? new Date(letter.paymentCompletedAt).getHours().toString().padStart(2, '0')
                        : new Date(letter.createdAt || '').getHours().toString().padStart(2, '0');

                    const hourData = hourlyData.get(hour);
                    hourData['결제금액'] += letter.priceInfo?.totalPrice;
                    hourlyData.set(hour, hourData);
                }
            });

            // 시간대별 가입자 수 계산
            users.forEach(user => {
                const hour = new Date(user.createdAt).getHours().toString().padStart(2, '0');

                const hourData = hourlyData.get(hour);
                hourData['신규가입'] += 1;
                hourlyData.set(hour, hourData);
            });

            // Map을 배열로 변환하고 시간순으로 정렬
            return Array.from(hourlyData.values()).sort(
                (a, b) => parseInt(a.hour) - parseInt(b.hour),
            );
        }
    };

    const data = processData();
    const xDataKey = isMonthly ? 'date' : 'hour';

    // 숫자 포맷팅을 위한 함수
    const formatNumber = (value: number) => {
        return value.toLocaleString('ko-KR');
    };

    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
                <XAxis
                    dataKey={xDataKey}
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    yAxisId="left"
                    stroke="#fe5172"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatNumber}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#0eb1d2"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatNumber}
                />
                <Tooltip
                    formatter={(value, name) => [formatNumber(value as number), name]}
                    labelFormatter={label => (isMonthly ? `${label}일` : `${label}시`)}
                />
                <Legend />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="결제금액"
                    stroke="#fe5172"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="신규가입"
                    stroke="#0eb1d2"
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
