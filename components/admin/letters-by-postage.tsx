import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useStatistics } from '@/app/admin/(routes)/(dashboard)/_contexts/statistics-provider';
import { getPostTypeByValue } from '@/constants';

export function LettersByPostage() {
    const { letters } = useStatistics();

    // 우표 금액별 데이터 처리
    const processLettersByPostage = () => {
        if (letters.length === 0) {
            return []; // 기본 더미 데이터
        }

        // 우편 유형별로 편지 수 집계
        const postTypeCounts: Record<string, number> = {};

        // 모든 편지를 순회하며 postType 별로 카운트
        letters.forEach(letter => {
            const postType = letter.postType;
            if (postType) {
                postTypeCounts[postType] = (postTypeCounts[postType] || 0) + 1;
            }
        });

        // 차트 데이터 형식으로 변환
        const chartData = Object.entries(postTypeCounts).map(([postTypeValue, count]) => {
            const postTypeInfo = getPostTypeByValue(postTypeValue);
            // console.log(postTypeInfo);
            return {
                name: postTypeInfo ? `${postTypeInfo.label}` : `알 수 없는 유형`,
                value: count,
                color: postTypeInfo?.color || '#999999',
                price: postTypeInfo?.price || 0,
            };
        });

        // 가격 순으로 정렬
        chartData.sort((a, b) => a.price - b.price);

        return chartData;
    };

    // // 더미 데이터 (데이터가 없을 때만 사용)
    // const dailyData = [
    //   { name: "일반우편 (1,000원)", value: 25, color: "#FFBD16", price: 1000 },
    //   { name: "준등기우편 (2,500원)", value: 10, color: "#40B822", price: 2500 },
    //   { name: "등기우편 (3,000원)", value: 7, color: "#4BB3D7", price: 3000 },
    //   { name: "익일특급 (4,000원)", value: 3, color: "#F17B4D", price: 4000 },
    // ]

    // const monthlyData = [
    //   { name: "일반우편 (1,000원)", value: 180, color: "#FFBD16", price: 1000 },
    //   { name: "준등기우편 (2,500원)", value: 90, color: "#40B822", price: 2500 },
    //   { name: "등기우편 (3,000원)", value: 50, color: "#4BB3D7", price: 3000 },
    //   { name: "익일특급 (4,000원)", value: 30, color: "#F17B4D", price: 4000 },
    // ]

    const data = processLettersByPostage();

    // 총 편지 수 계산
    const totalLetters = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name} (${value}건)`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [
                            `${value}건 (${((value / totalLetters) * 100).toFixed(1)}%)`,
                            '발송수',
                        ]}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>

            {/* 우편 유형별 통계 표 */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 bg-gray-50">
                        <tr>
                            <th className="px-4 py-2">우편 유형</th>
                            <th className="px-4 py-2">발송 건수</th>
                            <th className="px-4 py-2">비율</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2 flex items-center">
                                    <span
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: item.color }}
                                    ></span>
                                    {item.name}
                                </td>
                                <td className="px-4 py-2">{item.value}건</td>
                                <td className="px-4 py-2">
                                    {((item.value / totalLetters) * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-semibold">
                            <td className="px-4 py-2">합계</td>
                            <td className="px-4 py-2">{totalLetters}건</td>
                            <td className="px-4 py-2">100%</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
