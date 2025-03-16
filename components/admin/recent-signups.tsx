"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useStatistics } from "@/app/admin/(routes)/(dashboard)/_contexts/statistics-provider"

export function RecentSignups() {
  const { users } = useStatistics();
  
  // 사용자 데이터가 없으면 더미 데이터를 보여줍니다
  const displayUsers = users.length > 0 ? users : dummyUsers;
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>가입 방법</TableHead>
          <TableHead>가입일</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {user.name}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{getSignUpMethodName(user.signUpMethod)}</TableCell>
            <TableCell>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

// 가입 방법 이름 변환 함수
function getSignUpMethodName(method: string) {
  const methodMap: Record<string, string> = {
    'email': '이메일',
    'kakao': '카카오',
    'naver': '네이버',
    'apple': '애플'
  };
  
  return methodMap[method] || method;
}

// 더미 데이터
const dummyUsers = [
  {
    id: "1",
    name: "김철수",
    email: "user1@example.com",
    signUpMethod: "email",
    createdAt: "2023-05-15T09:24:15",
  },
  {
    id: "2",
    name: "이영희",
    email: "user2@example.com",
    signUpMethod: "kakao",
    createdAt: "2023-05-14T15:32:44",
  },
  // ... 더 많은 사용자 데이터
]; 